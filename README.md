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

## Project Structure

```
telegram-bots/
├── api/                      # Vercel serverless functions (webhooks)
│   └── motumbito.ts
├── bots/                     # Bot logic
│   └── motumbito/
│       ├── logic.ts          # Shared bot logic
│       └── polling.ts        # Local development (polling mode)
├── scripts/
│   └── setup-webhook.ts      # Webhook setup utility
└── package.json
```

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

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
npm run type-check                 # Check TypeScript types
npm run deploy                     # Deploy to Vercel (CLI)
```

## Adding a New Bot

See [BOT_SETUP.md](BOT_SETUP.md) for detailed instructions.

Quick overview:

1. Create `bots/your-bot/logic.ts` (shared logic)
2. Create `bots/your-bot/polling.ts` (local dev)
3. Create `api/your-bot.ts` (webhook)
4. Add scripts to `package.json`
5. Add `YOUR_BOT_BOT_TOKEN` to environment variables

## License

ISC
