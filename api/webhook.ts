import TelegramBot, { Message } from "node-telegram-bot-api";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const bendiciones: string[] = [
  "Te bendigo {user}, en el nombre del tío Motumbito.",
  "Motumbito no está de humor para bendecirte ahora {user}, tendrás que esperar.",
  "{user}, no eres digno de la bendición de Motumbito.",
  "En el nombre de Motumbito, te bendigo y hasta te bautizo sobrino {user}.",
  "Ahorita no joven {user} :v",
  "Ya dejese de joder {user}, ya bendije mucho.",
  "Primero sube tus copas oe pepelucho, luego te bendigo.",
  "No te bendigo {user} porque hueles a pepian pasado.",
  "{user} no me pidas que te bendiga man, yo no te pido que me bendigas.",
  "Bendecido sobrino ¯\\_(ツ)_/¯",
  "Oie zy ( ͡° ͜ʖ ͡°)",
  "Realmente eres el papu de papus mijo.",
  "Primero la reputamadrequeterepario.\nSegundo te bendigo.",
  "{user}, hijo de puta te detesto",
  "Ño cheñol.",
  "Asu mano si así pides bendición cómo pedirás pinga.",
  "Un pichulapo te doy si quieres manito.",
  "Por estas huevadas no cachas, gil.",
  "Pichulaso en la frente por huevon.",
  "( ͡° ͜ʖ ͡°)",
  "Una más y me cacho a tu vieja mano ya estas avisado.",
];

function t(s: string, d: Record<string, string>): string {
  for (let p in d) {
    s = s.replace(new RegExp("{" + p + "}", "g"), d[p]);
  }
  return s;
}

function getRnd(max: number): number {
  return Math.floor(Math.random() * max);
}

// Create bot instance WITHOUT polling
const bot = new TelegramBot(process.env.MOTUMBITO_BOT_TOKEN!);

// Process different commands
async function processMessage(msg: Message): Promise<void> {
  const text = msg.text || "";

  if (text === "/start" || text === "/help") {
    await bot.sendMessage(
      msg.chat.id,
      "Este es el bot del tio Motumbito, su único comando es /bendiceme",
    );
  } else if (text === "/commands") {
    await bot.sendMessage(
      msg.chat.id,
      "Solo hay un comando:\n\n/bendiceme - si tienes suerte, recibirás la bendición del tio Motumbito.",
    );
  } else if (text === "/bendiceme") {
    await bot.sendMessage(
      msg.chat.id,
      t(bendiciones[getRnd(bendiciones.length)], {
        user: msg.from?.first_name || "amigo",
      }),
    );

    if (msg.from?.id === 151854604) {
      await bot.sendMessage(msg.chat.id, "Papirrin");
    }
  }
}

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
        await processMessage(update.message);
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
