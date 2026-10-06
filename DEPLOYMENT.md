# Deploying Telegram Bots to Vercel

This guide will help you deploy your TypeScript Telegram bots to Vercel using webhooks.

**Note:** This repository supports multiple bots. See `BOT_SETUP.md` for details on adding new bots.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed: `npm install -g vercel`
3. Your Telegram bot token (from BotFather)
4. Node.js 18+ installed

## Deployment Steps

### 1. Install Dependencies

First, install all project dependencies:

```bash
npm install
```

### 2. Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 3. Login to Vercel

```bash
vercel login
```

### 4. Deploy to Vercel

From your project directory, run:

```bash
vercel
```

Follow the prompts:

- Set up and deploy? **Yes**
- Which scope? Choose your account
- Link to existing project? **No**
- What's your project's name? **telegram-bots** (or your preferred name)
- In which directory is your code located? **./** (press Enter)

This will create a preview deployment. You'll get a URL like: `https://telegram-bots-xxx.vercel.app`

**Note:** Vercel automatically detects and compiles TypeScript files. No build configuration needed!

### 5. Add Environment Variable to Vercel

Add each bot's token as an environment variable. Each bot needs its own token, named
`<NAME>_BOT_TOKEN` (see the naming rule in `BOT_SETUP.md`). For example:

```bash
vercel env add MOTUMBITO_BOT_TOKEN
```

When prompted:

- Enter the value: paste your bot token
- Select environments: Choose **Production**, **Preview**, and **Development** (use space to select,
  enter to confirm)

Environment variables only apply to deployments created after they are set, so add them all before
the next step.

### 6. Deploy to Production

```bash
vercel --prod
```

You'll get your production URL, something like: `https://telegram-bots.vercel.app`

### 7. Set Up the Webhook(s)

For each bot, run the setup script with your production URL:

**Motumbito bot:**

```bash
npm run setup-webhook:motumbito https://your-app.vercel.app/api/motumbito
```

**Generic format for any bot:**

```bash
npm run setup-webhook <bot-name> https://your-app.vercel.app/api/<bot-name>
```

Replace `https://your-app.vercel.app` with your actual Vercel URL.

You should see:

```
✅ Webhook set successfully!
```

### 8. Test Your Bot

**Motumbito bot:** Open Telegram and send `/bendiceme` to your bot. It should respond!

## Verifying Deployment

### Test the endpoint directly

Visit your bot's endpoint in a browser:

- Motumbito: `https://your-app.vercel.app/api/motumbito`

You should see:

```json
{"status": "Motumbito bot is running!"}
```

### Check webhook status

```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

## Troubleshooting

### Bot not responding?

1. **Check webhook is set correctly:**

    ```bash
    npm run setup-webhook:motumbito https://your-app.vercel.app/api/motumbito
    ```

2. **Check Vercel logs:**

    ```bash
    vercel logs
    ```

3. **Verify environment variables are set:**
    - Go to https://vercel.com/dashboard
    - Select your project
    - Go to Settings → Environment Variables
    - Ensure all bot tokens are set (e.g., `MOTUMBITO_BOT_TOKEN`)

### Need to update the bot code?

Just deploy again:

```bash
vercel --prod
```

No need to set up the webhook again unless your URL changes.

## Alternative: Deploy via GitHub

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add `<NAME>_BOT_TOKEN` for each bot (e.g. `MOTUMBITO_BOT_TOKEN`) in project settings
5. Deploy
6. Run the webhook setup script with your Vercel URL

## Development

For local development with TypeScript:

```bash
# Run specific bot with hot reload (polling mode)
npm run dev:motumbito

# Type check
npm run type-check
```

See `BOT_SETUP.md` for adding new bots.

## Important Notes

- **Multi-bot support:** This repo can host multiple bots (see `BOT_SETUP.md`)
- **TypeScript Benefits:** Type safety, better IDE support, fewer runtime errors
- **Keep bot tokens secret!** Never commit them to git
- The `.env` file is in `.gitignore` for this reason
- Vercel's free tier is generous and perfect for these bots
- Webhooks are more efficient than polling for production
- Vercel automatically compiles TypeScript on deployment (zero-config)
