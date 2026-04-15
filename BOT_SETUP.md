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
import TelegramBot, { Message } from "node-telegram-bot-api";

export async function processMessage(
  bot: TelegramBot,
  msg: Message,
): Promise<void> {
  const text = msg.text || "";

  if (text === "/start") {
    await bot.sendMessage(msg.chat.id, "Hello!");
  }
  // ... your bot logic
}
```

### 2. Create `api/your-bot-name.ts`

```typescript
import TelegramBot from "node-telegram-bot-api";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { processMessage } from "../bots/your-bot-name.js";

const bot = new TelegramBot(process.env.YOUR_BOT_NAME_BOT_TOKEN!);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method === "POST") {
    try {
      const update = req.body;
      if (update.message) {
        await processMessage(bot, update.message);
      }
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Error processing update:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(200).json({ status: "Your Bot is running!" });
  }
}
```

### 5. Add environment variables

**Local (.env file):**

```bash
YOUR_BOT_NAME_BOT_TOKEN=your_token_here
```

**Vercel Dashboard:**

- Go to Settings → Environment Variables
- Add `YOUR_BOT_NAME_BOT_TOKEN` with your bot token

### 6. Add npm scripts to package.json

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

### 6b. Register bot commands in the Telegram app

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

This makes commands appear in the Telegram command menu (the `/` suggestions UI). Only needs to be re-run if commands change.

### 7. Test and deploy

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

✅ **Single source of truth**: Logic in `logic.ts` is used by both polling and webhook
✅ **Easy local testing**: Run with polling mode locally
✅ **Production ready**: Deploy webhooks to Vercel
✅ **Independent bots**: Each bot is isolated, crash in one doesn't affect others
✅ **Shared infrastructure**: One repository, one deployment, multiple bots
