import TelegramBot from "node-telegram-bot-api";

// This script sets up the webhook URL with Telegram
// Run it once after deploying to Vercel

const token = process.env.MOTUMBITO_BOT_TOKEN;
const webhookUrl = process.argv[2];

if (!token) {
  console.error("Error: MOTUMBITO_BOT_TOKEN environment variable not set");
  process.exit(1);
}

if (!webhookUrl) {
  console.error("Error: Please provide webhook URL as argument");
  console.error("Usage: npm run setup-webhook https://your-app.vercel.app/api/webhook");
  process.exit(1);
}

const bot = new TelegramBot(token);

console.log(`Setting webhook to: ${webhookUrl}`);

bot.setWebHook(webhookUrl)
  .then(() => {
    console.log("✅ Webhook set successfully!");
    return bot.getWebHookInfo();
  })
  .then((info) => {
    console.log("\nWebhook Info:");
    console.log(JSON.stringify(info, null, 2));
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error("❌ Error setting webhook:", error.message);
    process.exit(1);
  });
