import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder} from 'discord.js';
import SteamUser from 'steam-user';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const steamUsers = new Map<string, SteamUser>();
const steamToDiscord = new Map<string, string>();

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
        .setDescription('Loga na conta Steam')
        .addStringOption(o => o.setName('username').setDescription('Steam username').setRequired(true))
        .addStringOption(o => o.setName('password').setDescription('Steam password').setRequired(true))
        .addStringOption(o => o.setName('steam_guard').setDescription('Steam Guard code').setRequired(true))
        .toJSON(),
    new SlashCommandBuilder()
        .setName('logout')
        .setDescription('Desloga da conta Steam')
        .addStringOption(o =>
            o.setName('username')
                .setDescription('Conta Steam')
                .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('jogo')
        .setDescription('Define os jogos ativos')
        .addStringOption(o =>
            o.setName('username')
                .setDescription('Conta Steam')
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName('appids')
                .setDescription('IDs dos jogos separados por ; (ex: 730;760;240)')
                .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('contas')
        .setDescription('Lista todas as contas Steam logadas')
        .toJSON(),
];

async function registerCommands() {
    const token = "MTQ0NzAwODQzNTA4MTMxNDM2Ng.G-Qkps.LsFrlmXt3JMyhc6qti3K22RJwjUjTzt9_dId_g";
    const clientId = "1447008435081314366";
    const rest = new REST().setToken(token);
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
}

client.on('clientReady', async () => {
    if (!client.user) return;
    console.log(`Bot conectado como ${client.user.tag}`);
    await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;

    try {
        if (commandName === 'login') {
            const username = interaction.options.getString('username', true);
            const password = interaction.options.getString('password', true);
            const steamGuard = interaction.options.getString('steam_guard', true);

            if (steamUsers.has(username)) {
                await interaction.reply({ content: `Conta ${username} já está logada`, ephemeral: true });
                return;
            }

            const user = new SteamUser({
                machineIdType: SteamUser.EMachineIDType.PersistentRandom,
                dataDirectory: `SteamData/${username}`,
            });

            steamUsers.set(username, user);
            steamToDiscord.set(username, interaction.user.id);

            user.on('steamGuard', (_domain, callback) => callback(steamGuard));

            user.on('loggedOn', () => {
                console.log(`${username} logado`);
                user.setPersona(SteamUser.EPersonaState.Online);
            });

            user.on('error', err => console.error(`Erro em ${username}:`, err));

            user.logOn({ accountName: username, password });

            await interaction.reply({ content: `Tentando logar em ${username}...`, ephemeral: true });
        }

        else if (commandName === 'logout') {
            const username = interaction.options.getString('username', true);
            const user = steamUsers.get(username);
            if (!user) return interaction.reply({ content: `Conta ${username} não está logada`, ephemeral: true });

            user.logOff();
            steamUsers.delete(username);
            steamToDiscord.delete(username);

            await interaction.reply({ content: `Conta ${username} deslogada com sucesso`, ephemeral: true });
        }

        else if (commandName === 'jogo') {
            const username = interaction.options.getString('username', true);
            const discordId = interaction.user.id;

            // Verifica se a conta pertence ao usuário
            if (steamToDiscord.get(username) !== discordId) {
                return interaction.reply({ content: `Você não tem permissão para controlar a conta ${username}`, ephemeral: true });
            }

            const user = steamUsers.get(username);
            if (!user) return interaction.reply({ content: `Conta ${username} não está logada`, ephemeral: true });

            const appidsInput = interaction.options.getString('appids', true);
            const appids = appidsInput.split(';').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

            if (appids.length === 0) {
                return interaction.reply({ content: 'Nenhum AppID válido fornecido', ephemeral: true });
            }

            user.gamesPlayed(appids);
            console.log(`${username} está jogando: ${appids.join(', ')}`);

            await interaction.reply({ content: `${username} está jogando ${appids.length} jogo(s): ${appids.join(', ')}`, ephemeral: true });
        }

        else if (commandName === 'contas') {
            const discordId = interaction.user.id;
            const userAccounts = Array.from(steamUsers.entries())
                .filter(([username]) => steamToDiscord.get(username) === discordId)
                .map(([username]) => username);

            if (userAccounts.length === 0) {
                return interaction.reply({ content: 'Você não tem contas Steam logadas', ephemeral: true });
            }

            const accountList = userAccounts.map(username => `🟢 ${username}`).join('\n');

            await interaction.reply({
                content: `Suas contas logadas (${userAccounts.length}):\n${accountList}`,
                ephemeral: true
            });
        }

        else if (commandName === 'ping') {
            await interaction.reply(`Meu ping: ${interaction.client.ws.ping}`);
        }

        else if (commandName === 'help') {
            const commandList = commands.map(cmd => `/${cmd.name}`).join(', ');
            await interaction.reply({ content: `Comandos disponíveis: ${commandList}`, ephemeral: true });
        }

    } catch (err) {
        console.error(`Erro ao executar comando ${commandName}:`, err);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp('Erro ao executar comando.');
        } else {
            await interaction.reply('Erro ao executar comando.');
        }
    }
});

client.login("MTQ0NzAwODQzNTA4MTMxNDM2Ng.G-Qkps.LsFrlmXt3JMyhc6qti3K22RJwjUjTzt9_dId_g");
