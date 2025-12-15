import TelegramBot from "node-telegram-bot-api";
import { processMessage } from "./logic.js";

// Create bot with polling enabled
const bot = new TelegramBot(process.env.MOTUMBITO_BOT_TOKEN!, {
  polling: true,
});

// Listen for all messages
bot.on("message", async (msg) => {
  await processMessage(bot, msg);
});

console.log("🤖 Motumbito bot is running in polling mode (local dev)...");
