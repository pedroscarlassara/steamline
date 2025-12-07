import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

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
        await interaction.reply('wip')
    }

    if (commandName === 'ping') {
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

client.login("MTQ0NzAwODQzNTA4MTMxNDM2Ng.G-Qkps.LsFrlmXt3JMyhc6qti3K22RJwjUjTzt9_dId_g")