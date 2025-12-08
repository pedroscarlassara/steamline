# Como Buildar e Iniciar o Bot

## Pré-requisitos

- Node.js 18 ou superior instalado
- npm (vem com o Node.js)

## Instalação das Dependências

Primeiro, instale todas as dependências do projeto:

```bash
npm install
```

## Compilar o Código (Build)

Para compilar o código TypeScript para JavaScript:

```bash
npm run build
```

Isso irá:
- Compilar todos os arquivos `.ts` da pasta `src/`
- Gerar os arquivos JavaScript na pasta `dist/`

## Iniciar o Bot

Após compilar, inicie o bot com:

```bash
npm start
```

## Build + Start (Desenvolvimento)

Para compilar e iniciar em um único comando:

```bash
npm run dev
```

## Estrutura de Comandos

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instala todas as dependências |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm start` | Inicia o bot (requer build antes) |
| `npm run dev` | Compila e inicia o bot |

## Fluxo Completo

```bash
# 1. Instalar dependências (apenas na primeira vez)
npm install

# 2. Compilar o código
npm run build

# 3. Iniciar o bot
npm start
```

## Desenvolvimento

Durante o desenvolvimento, use:

```bash
npm run dev
```

Isso compila e inicia o bot automaticamente. Você precisará executar novamente após fazer alterações no código.

## Solução de Problemas

### Erro: "Cannot find module"
Execute `npm install` para instalar as dependências.

### Erro: "dist/index.js not found"
Execute `npm run build` antes de `npm start`.

### Erro de TypeScript
Verifique se o TypeScript está instalado:
```bash
npm install -D typescript
```

## Arquivos Gerados

Após o build, você verá:
- `dist/` - Pasta com código JavaScript compilado
- `SteamData/` - Dados de sessão Steam (criado automaticamente)
- `accounts.json` - Contas salvas (criado automaticamente)
