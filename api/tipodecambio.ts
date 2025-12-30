import { VercelRequest, VercelResponse } from "@vercel/node";
import TelegramBot from "node-telegram-bot-api";
import { processMessage } from "../bots/tipodecambio.js";

const bot = new TelegramBot(process.env.TIPODECAMBIO_BOT_TOKEN!);

// Vercel serverless function handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method === "POST") {
    try {
      const update: TelegramBot.Update = req.body;

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
    res.status(200).json({ status: "Tipodecambio bot is running!" });
  }
}
