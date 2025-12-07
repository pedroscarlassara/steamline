# Steam Hour Farmer Bot

Bot do Discord para farmar horas em jogos da Steam automaticamente.

## Funcionalidades

- Login em múltiplas contas Steam simultaneamente
- Farmar horas em múltiplos jogos ao mesmo tempo
- Gerenciamento via comandos slash do Discord
- Suporte a Steam Guard

## Requisitos

- Node.js 18 ou superior
- Uma aplicação Discord Bot configurada
- Conta(s) Steam

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/discord_bot.git
cd discord_bot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o bot:
   - Abra `src/index.ts`
   - Substitua `DISCORD_BOT_TOKEN` pelo token do seu bot Discord
   - Substitua `DISCORD_CLIENT_ID` pelo ID da sua aplicação Discord

4. Compile e execute:
```bash
npm run build
npm start
```

## Comandos

### `/login`
Faz login em uma conta Steam.

**Parâmetros:**
- `username` - Nome de usuário da Steam
- `password` - Senha da conta
- `steam_guard` - Código do Steam Guard

**Exemplo:**
```
/login username:minhaconta password:minhasenha steam_guard:ABC123
```

### `/logout`
Desloga de uma conta Steam.

**Parâmetros:**
- `username` - Nome de usuário da conta para deslogar

**Exemplo:**
```
/logout username:minhaconta
```

### `/jogo`
Define os jogos que serão farmados.

**Parâmetros:**
- `appids` - IDs dos jogos separados por `;`

**Exemplo:**
```
/jogo appids:730;760;240
```

IDs de jogos populares:
- Counter-Strike 2: `730`
- CS:GO: `730`
- Team Fortress 2: `440`
- Dota 2: `570`
- Rust: `252490`

Para encontrar o AppID de um jogo, visite a página do jogo na Steam Store e veja o número na URL:
`https://store.steampowered.com/app/730/` → AppID é `730`

### `/ping`
Verifica se o bot está online.

### `/help`
Lista todos os comandos disponíveis.

## Como criar um Bot Discord

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em "New Application"
3. Dê um nome ao seu bot e clique em "Create"
4. Vá para a aba "Bot" e clique em "Add Bot"
5. Copie o token do bot (você precisará dele no código)
6. Na aba "OAuth2" → "URL Generator":
   - Selecione `bot` e `applications.commands`
   - Selecione as permissões necessárias
   - Copie a URL gerada e use para adicionar o bot ao seu servidor

## Estrutura do Projeto

```
discord_bot/
├── src/
│   └── index.ts          # Código principal do bot
├── SteamData/            # Dados de sessão Steam (gerado automaticamente)
├── package.json
├── tsconfig.json
└── README.md
```

## Avisos

- Mantenha seu token do Discord e credenciais Steam em segurança
- Não compartilhe o arquivo `index.ts` com suas credenciais
- Use por sua conta e risco - farmar horas pode violar os termos de serviço da Steam
- Recomenda-se usar variáveis de ambiente para credenciais em produção

## Licença

MIT
