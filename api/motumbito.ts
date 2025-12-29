import TelegramBot from "node-telegram-bot-api";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { processMessage } from "../bots/motumbito.js";

// Create bot instance WITHOUT polling (for webhook mode)
const bot = new TelegramBot(process.env.MOTUMBITO_BOT_TOKEN!);

// Vercel serverless function handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method === "POST") {
    try {
      const update = req.body;

      // Process the message if it exists
      if (update.message) {
        await processMessage(bot, update.message);
      }

      // Respond to Telegram that we received the update
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Error processing update:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Handle GET requests (for testing)
    res.status(200).json({ status: "Motumbito bot is running!" });
  }
}
