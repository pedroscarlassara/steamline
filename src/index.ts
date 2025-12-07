import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import SteamUser from "steam-user";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const steamUsers = new Map<string, SteamUser>();

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com Pong.')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lista todos os comandos disponíveis.')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('login')
    .setDescription('Loga na conta da Steam.')
    .addStringOption((option) => 
      option
        .setName('username')
        .setDescription('Campo para inserir username da Steam.')
        .setRequired(true)
    )
    .addStringOption((option) => 
      option
        .setName('password')
        .setDescription('Campo para inserir senha da Steam.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('steam_guard')
        .setDescription('Campo para inserir codigo do Steam Guard.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('game_id')
        .setDescription('Campo para inserir o ID do Jogo.')
        .setRequired(true)
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName('logout')
    .setDescription('Desloga da conta da Steam.')
    .addStringOption((option) =>
      option
        .setName('username')
        .setDescription('Username da conta para deslogar.')
        .setRequired(true)
    )
    .toJSON(),
];

async function registerCommands() {
  const token = "MTQ0NzAwODQzNTA4MTMxNDM2Ng.G-Qkps.LsFrlmXt3JMyhc6qti3K22RJwjUjTzt9_dId_g";
  const clientId = "1447008435081314366";
  const rest = new REST().setToken(token);

  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
  } catch (error) {
    process.exit(1);
  }
}

client.on('clientReady', async () => {
  if (!client.user) return;
  console.log(`Bot conectado como ${client.user.tag}`);
  await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    if (commandName === 'login') {
      const username = interaction.options.getString('username', true);
      const password = interaction.options.getString('password', true);
      const steamGuard = interaction.options.getString('steam_guard', true);
      const gameId = interaction.options.getString('game_id', true);

      if (steamUsers.has(username)) {
        await interaction.reply(`A conta ${username} já está logada.`);
        return;
      }

      const user = new SteamUser({
        machineIdType: SteamUser.EMachineIDType.PersistentRandom,
        dataDirectory: `SteamData/${username}`,
        renewRefreshTokens: true,
      });

      let authenticated = false;
      let playingOnOtherSession = false;

      user.on('steamGuard', (_domain, callback) => {
        callback(steamGuard);
      });

      user.on('loggedOn', () => {
        authenticated = true;
        console.log(`${username} logado com sucesso`);
        user.setPersona(SteamUser.EPersonaState.Online);
        user.gamesPlayed([parseInt(gameId)]);
      });

      user.on('error', (err) => {
        console.error(`Erro na conta ${username}:`, err);
        authenticated = false;
      });

      user.on('playingState', (blocked) => {
        playingOnOtherSession = blocked;
        if (blocked) {
          console.log(`${username}: Jogo pausado (jogando em outra sessão)`);
          user.gamesPlayed([]);
        } else {
          console.log(`${username}: Retomando jogo`);
          user.gamesPlayed([parseInt(gameId)]);
        }
      });

      user.on('disconnected', () => {
        authenticated = false;
        console.log(`${username} desconectado`);
      });

      user.logOn({
        accountName: username,
        password: password,
        machineName: "steam-hour-farmer",
        clientOS: SteamUser.EOSType.Windows10,
        autoRelogin: true,
      });

      steamUsers.set(username, user);

      setInterval(() => {
        if (authenticated && !playingOnOtherSession) {
          user.gamesPlayed([parseInt(gameId)]);
        }
      }, 5 * 60 * 1000);

      await interaction.reply(`Tentando fazer login com a conta ${username} e iniciar o jogo ${gameId}...`);

    } else if (commandName === 'logout') {
      const username = interaction.options.getString('username', true);
      const user = steamUsers.get(username);

      if (!user) {
        await interaction.reply(`A conta ${username} não está logada.`);
        return;
      }

      user.logOff();
      steamUsers.delete(username);
      await interaction.reply(`Conta ${username} deslogada com sucesso.`);

    } else if (commandName === 'ping') {
      await interaction.reply('Pong!');

    } else if (commandName === 'help') {
      const commandList = commands.map(cmd => `/${cmd.name}`).join(', ');
      await interaction.reply(`Comandos disponíveis: ${commandList}`);
    }
  } catch (error) {
    console.error(`Erro ao executar comando ${commandName}:`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp('Ocorreu um erro ao executar este comando.');
    } else {
      await interaction.reply('Ocorreu um erro ao executar este comando.');
    }
  }
});

client.login("MTQ0NzAwODQzNTA4MTMxNDM2Ng.G-Qkps.LsFrlmXt3JMyhc6qti3K22RJwjUjTzt9_dId_g");
