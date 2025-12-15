import TelegramBot, { Message } from "node-telegram-bot-api";

// Bot data
export const bendiciones: string[] = [
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

// Helper functions
function t(s: string, d: Record<string, string>): string {
  for (let p in d) {
    s = s.replace(new RegExp("{" + p + "}", "g"), d[p]);
  }
  return s;
}

function getRnd(max: number): number {
  return Math.floor(Math.random() * max);
}

// Main bot logic - works for both polling and webhook modes
export async function processMessage(
  bot: TelegramBot,
  msg: Message
): Promise<void> {
  const text = msg.text || "";

  if (text === "/start" || text === "/help") {
    await bot.sendMessage(
      msg.chat.id,
      "Este es el bot del tio Motumbito, su único comando es /bendiceme"
    );
  } else if (text === "/commands") {
    await bot.sendMessage(
      msg.chat.id,
      "Solo hay un comando:\n\n/bendiceme - si tienes suerte, recibirás la bendición del tio Motumbito."
    );
  } else if (text === "/bendiceme") {
    await bot.sendMessage(
      msg.chat.id,
      t(bendiciones[getRnd(bendiciones.length)], {
        user: msg.from?.first_name || "amigo",
      })
    );

    if (msg.from?.id === 151854604) {
      await bot.sendMessage(msg.chat.id, "Papirrin");
    }
  }
}
