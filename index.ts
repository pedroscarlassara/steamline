import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder} from 'discord.js';
import SteamUser from 'steam-user';
import dotenv from 'dotenv';
import * as fs from 'fs';
import {Account} from "./types/Account";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const steamUsers = new Map<string, SteamUser>();
const steamToDiscord = new Map<string, string>();

if (!fs.existsSync('./accounts.txt')) {
    fs.writeFileSync('./accounts.txt', '');
}

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responds with Pong.')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands.')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('login')
        .setDescription('Log into Steam account')
        .addStringOption(o => o.setName('username').setDescription('Steam username').setRequired(true))
        .addStringOption(o => o.setName('password').setDescription('Steam password').setRequired(true))
        .addStringOption(o => o.setName('steam_guard').setDescription('Steam Guard code').setRequired(true))
        .toJSON(),
    new SlashCommandBuilder()
        .setName('logout')
        .setDescription('Log out from Steam account')
        .addStringOption(o =>
            o.setName('username')
                .setDescription('Steam account')
                .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('play')
        .setDescription('Set active games')
        .addStringOption(o =>
            o.setName('username')
                .setDescription('Steam account')
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName('appids')
                .setDescription('Game IDs separated by ; (ex: 730;760;240)')
                .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('accounts')
        .setDescription('List all logged Steam accounts')
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

            let account_data: Account = {username: username, password: password};

            const jsonString = JSON.stringify(account_data, null, 2)

            fs.writeFileSync('./accounts.txt', jsonString, { encoding: 'utf8', flag: 'w' });

            if (steamUsers.has(username)) {
                await interaction.reply({ content: `Account ${username} is already logged in`, ephemeral: true });
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
                console.log(`${username} logged in`);
                user.setPersona(SteamUser.EPersonaState.Online);
            });

            user.on('error', err => console.error(`Error in ${username}:`, err));

            user.logOn({ accountName: username, password });

            await interaction.reply({ content: `Attempting to log into ${username}...`, ephemeral: true });
        }

        else if (commandName === 'logout') {
            const username = interaction.options.getString('username', true);
            const user = steamUsers.get(username);
            if (!user) return interaction.reply({ content: `Account ${username} is not logged in`, ephemeral: true });

            user.logOff();
            steamUsers.delete(username);
            steamToDiscord.delete(username);

            await interaction.reply({ content: `Account ${username} logged out successfully`, ephemeral: true });
        }

        else if (commandName === 'play') {
            const username = interaction.options.getString('username', true);
            const discordId = interaction.user.id;

            if (steamToDiscord.get(username) !== discordId) {
                return interaction.reply({ content: `You don't have permission to control account ${username}`, ephemeral: true });
            }

            const user = steamUsers.get(username);
            if (!user) return interaction.reply({ content: `Account ${username} is not logged in`, ephemeral: true });

            const appidsInput = interaction.options.getString('appids', true);
            const appids = appidsInput.split(';').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

            if (appids.length === 0) {
                return interaction.reply({ content: 'No valid AppID provided', ephemeral: true });
            }

            user.gamesPlayed(appids);
            console.log(`${username} is playing: ${appids.join(', ')}`);

            await interaction.reply({ content: `${username} is playing ${appids.length} game(s): ${appids.join(', ')}`, ephemeral: true });
        }

        else if (commandName === 'accounts') {
            const discordId = interaction.user.id;
            const userAccounts = Array.from(steamUsers.entries())
                .filter(([username]) => steamToDiscord.get(username) === discordId)
                .map(([username]) => username);

            if (userAccounts.length === 0) {
                return interaction.reply({ content: 'You have no Steam accounts logged in', ephemeral: true });
            }

            const accountList = userAccounts.map(username => `• ${username}`).join('\n');

            await interaction.reply({
                content: `Your logged accounts (${userAccounts.length}):\n${accountList}`,
                ephemeral: true
            });
        }

        else if (commandName === 'ping') {
            await interaction.reply(`My ping: ${interaction.client.ws.ping}`);
        }

        else if (commandName === 'help') {
            const commandList = commands.map(cmd => `/${cmd.name}`).join(', ');
            await interaction.reply({ content: `Available commands: ${commandList}`, ephemeral: true });
        }

    } catch (err) {
        console.error(`Error executing command ${commandName}:`, err);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp('Error executing command.');
        } else {
            await interaction.reply('Error executing command.');
        }
    }
});

client.login("MTQ0NzAwODQzNTA4MTMxNDM2Ng.G-Qkps.LsFrlmXt3JMyhc6qti3K22RJwjUjTzt9_dId_g");
