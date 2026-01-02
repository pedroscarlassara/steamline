# Steamline

A Discord bot that integrates with Steam to simulate game playing sessions, allowing users to increase their game hours by making Steam think they're actively playing games.

## Overview

This bot combines two powerful frameworks:
- **Discord.js** - For Discord bot functionality and slash commands
- **steam-user** - For Steam account integration and game simulation

The bot allows users to log into their Steam accounts through Discord commands and simulate playing multiple games simultaneously, effectively increasing game hours without actually running the games.

## Features

- **Multi-Game Simulation** - Play multiple games simultaneously
- **Secure Login** - Steam Guard authentication support
- **Multi-User Support** - Multiple users can manage their own Steam accounts
- **Account Management** - List and manage logged-in Steam accounts
- **Permission System** - Users can only control their own accounts
- **Persistent Sessions** - Steam data is saved locally for reconnection

## Commands

| Command | Description | Parameters |
|---------|-------------|------------|
| `/login` | Log into a Steam account | `username`, `password`, `steam_guard` |
| `/logout` | Log out from a Steam account | `username` |
| `/play` | Set active games for an account | `username`, `appids` (semicolon-separated) |
| `/accounts` | List your logged-in Steam accounts | None |
| `/ping` | Check bot latency | None |
| `/help` | Show available commands | None |

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Discord application/bot token
- Steam account(s) with Steam Guard enabled

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd steam-game-hours-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in the root directory:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_CLIENT_ID=your_discord_application_id
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

   For development:
   ```bash
   npm run dev
   ```

## Usage

### 1. Logging into Steam

Use the `/login` command with your Steam credentials:
```
/login username:your_steam_username password:your_password steam_guard:123456
```

**Note**: The Steam Guard code is the 6-digit code from your authenticator app or email.

### 2. Starting Game Simulation

Use the `/play` command to simulate playing games:
```
/play username:your_steam_username appids:730;760;240
```

This example simulates playing:
- Counter-Strike 2 (730)
- Counter-Strike: Source (760)  
- Counter-Strike (240)

### 3. Managing Accounts

- List your accounts: `/accounts`
- Logout from an account: `/logout username:your_steam_username`

## Finding Game App IDs

To find Steam App IDs for games:

1. **Steam Store Method**: Visit the game's Steam store page and look at the URL
   - Example: `https://store.steampowered.com/app/730/` → App ID is `730`

2. **SteamDB**: Visit [steamdb.info](https://steamdb.info) and search for the game

3. **Steam Client**: Right-click game in library → Properties → Updates tab shows App ID

## Project Structure

```
├── dist/                 # Compiled JavaScript files
├── types/               # TypeScript type definitions
│   └── Account.ts       # Account interface
├── SteamData/          # Steam session data (auto-generated)
├── index.ts            # Main bot implementation
├── package.json        # Project configuration
├── accounts.txt        # Account data storage
└── README.md          # This file
```

## Security Considerations

**Important Security Notes**:

- Never share your Steam credentials with others
- The bot stores account data locally in `accounts.txt`
- Steam session data is saved in `SteamData/` directory
- Consider using environment variables for sensitive data
- This bot requires your actual Steam password - use at your own risk

## Technical Details

### Dependencies

- **discord.js**: Discord API wrapper for bot functionality
- **steam-user**: Steam client library for account management
- **steam-totp**: Two-factor authentication support
- **dotenv**: Environment variable management
- **TypeScript**: Type-safe development

### How It Works

1. The bot logs into Steam using the `steam-user` library
2. Sets the account status to "Online"
3. Uses `gamesPlayed()` method to simulate playing specified games
4. Steam registers this as active gameplay, incrementing game hours
5. Multiple games can be "played" simultaneously

## Limitations

- Requires Steam Guard authentication for each login
- Account sessions may expire and require re-authentication
- Steam may detect unusual patterns if overused
- Some games may have anti-cheat systems that detect this behavior

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Disclaimer

This bot is for educational purposes. Use responsibly and in accordance with Steam's Terms of Service. The developers are not responsible for any account restrictions or bans that may result from using this software.
