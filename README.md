# Telegram Bots

Multi-bot Telegram bot repository deployed on Vercel using webhooks.

## Features

- ✅ TypeScript
- ✅ Multiple bots in one repository
- ✅ Shared logic between local dev (polling) and production (webhooks)
- ✅ Zero-config Vercel deployment
- ✅ Easy webhook setup

## Bots

- **Motumbito Bot** - A fun blessing bot
- **Tipodecambio Bot** - USD and EUR to PEN exchange rates

## Project Structure

```
telegram-bots/
├── api/                      # Vercel serverless functions (webhooks)
│   └── {bot-name}.ts
├── bots/                     # Bot logic
│   └── {bot-name}.ts         # Shared bot logic (used by both polling & webhook)
├── scripts/
│   ├── start-polling.ts      # Generic polling script (works for all bots)
│   ├── setup-webhook.ts      # Webhook setup utility
│   ├── setup-commands.ts     # Telegram command menu registration
│   └── utils.ts              # Shared script utilities
└── package.json
```

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and fill in your bot tokens

# Run bot locally (polling mode)
npm run dev:motumbito
```

### Deploy to Vercel

1. Connect your GitHub repo to Vercel
2. Add environment variable in Vercel Dashboard:
    - `MOTUMBITO_BOT_TOKEN` = your bot token
3. Deploy (automatic on git push)
4. Set up webhook:
    ```bash
    npm run setup-webhook:motumbito https://your-app.vercel.app/api/motumbito
    ```

## Documentation

- **[BOT_SETUP.md](BOT_SETUP.md)** - How to add new bots
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment guide

## Scripts

```bash
npm run dev:motumbito              # Run Motumbito bot locally
npm run setup-webhook:motumbito    # Setup Motumbito webhook
npm run setup-commands:motumbito   # Register Motumbito commands in Telegram UI
npm run type-check                 # Check TypeScript types
npm run deploy                     # Deploy to Vercel (CLI)
```

## Adding a New Bot

See [BOT_SETUP.md](BOT_SETUP.md) for detailed instructions.

Quick overview:

1. Create `bots/your-bot.ts` (shared logic)
2. Create `api/your-bot.ts` (webhook)
3. Add scripts to `package.json`
4. Add `YOUR_BOT_TOKEN` to environment variables
5. Register commands via `npm run setup-commands:your-bot`

## License

ISC
