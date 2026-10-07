# Multi-Bot Setup Guide

This repository supports multiple Telegram bots with shared infrastructure.

## Project Structure

```
telegram-bots/
├── api/
│   ├── motumbito.ts          # Bot 1 webhook endpoint
│   └── another-bot.ts         # Bot 2 webhook endpoint
├── bots/
│   ├── motumbito.ts           # Bot 1 logic
│   └── another-bot.ts         # Bot 2 logic
└── scripts/
    ├── start-polling.ts       # Generic polling (works for all bots)
    └── setup-webhook.ts       # Flexible webhook setup
```

## Adding a New Bot

### 1. Create `bots/your-bot-name.ts`

```typescript
import TelegramBot, {Message} from 'node-telegram-bot-api'

export async function processMessage(bot: TelegramBot, msg: Message): Promise<void> {
    const text = msg.text || ''

    if (text === '/start') {
        await bot.sendMessage(msg.chat.id, 'Hello!')
    }
    // ... your bot logic
}
```

**Optional:** if your bot uses inline keyboards, also export `processCallbackQuery(bot, query)` from
this file. Both polling (`scripts/start-polling.ts`) and the webhook handler (step 2) pick it up
automatically; a bot that only exports `processMessage` is unaffected.

### 2. Create `api/your-bot-name.ts`

`lib/webhook.ts` already implements the Vercel handler boilerplate (token lookup, POST/GET handling,
error responses), so this file only wires your bot's logic into it:

```typescript
import {createWebhookHandler} from '../lib/webhook.js'
import {processMessage} from '../bots/your-bot-name.js'

export default createWebhookHandler('your-bot-name', processMessage)
```

If you also exported `processCallbackQuery` in step 1, pass it as a third argument:

```typescript
export default createWebhookHandler('your-bot-name', processMessage, processCallbackQuery)
```

### 3. Add environment variables

**Local (.env file):**

```bash
YOUR_BOT_NAME_BOT_TOKEN=your_token_here
```

**Vercel Dashboard:**

- Go to Settings → Environment Variables
- Add `YOUR_BOT_NAME_BOT_TOKEN` with your bot token

### 4. Add npm scripts to package.json

```json
{
    "scripts": {
        "dev:your-bot-name": "npm run dev your-bot-name",
        "setup-webhook:your-bot-name": "npm run setup-webhook your-bot-name",
        "setup-commands:your-bot-name": "npm run setup-commands your-bot-name"
    }
}
```

**Note:** The generic `npm run dev <bot-name>` script automatically handles polling for any bot!

### 5. Register bot commands in the Telegram app

Add your bot's commands to `scripts/setup-commands.ts` under `BOT_COMMANDS`:

```typescript
"your-bot-name": [
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show help" },
  // ... your commands
],
```

Then run it once to register them with Telegram:

```bash
npm run setup-commands:your-bot-name
```

This makes commands appear in the Telegram command menu (the `/` suggestions UI). Only needs to be
re-run if commands change.

### 6. Test and deploy

**Test locally:**

```bash
npm run dev:your-bot-name
```

**Deploy:**

```bash
git push  # Triggers Vercel deployment
```

**Set up webhook:**

```bash
npm run setup-webhook:your-bot-name https://your-app.vercel.app/api/your-bot-name
```

## Usage Examples

### Motumbito Bot

**Local development:**

```bash
npm run dev:motumbito
```

**Set up webhook:**

```bash
npm run setup-webhook:motumbito https://your-app.vercel.app/api/motumbito
```

### Generic webhook setup

You can also use the generic command:

```bash
npm run setup-webhook <bot-name> <webhook-url>
```

**Examples:**

```bash
npm run setup-webhook motumbito https://your-app.vercel.app/api/motumbito
npm run setup-webhook another-bot https://your-app.vercel.app/api/another-bot
```

## Environment Variable Naming Convention

Bot names are automatically converted to env variable names:

- `motumbito` → `MOTUMBITO_BOT_TOKEN`
- `another` → `ANOTHER_BOT_TOKEN`
- `my-cool-bot` → `MY_COOL_BOT_TOKEN`

## Key Benefits

✅ **Single source of truth**: Logic in `bots/<name>.ts` is used by both polling and webhook ✅
**Easy local testing**: Run with polling mode locally ✅ **Production ready**: Deploy webhooks to
Vercel ✅ **Independent bots**: Each bot is isolated, crash in one doesn't affect others ✅ **Shared
infrastructure**: One repository, one deployment, multiple bots
