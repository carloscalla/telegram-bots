import TelegramBot from "node-telegram-bot-api";

const bendiciones = [
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

function t(s, d) {
  for (let p in d) {
    s = s.replace(new RegExp("{" + p + "}", "g"), d[p]);
  }
  return s;
}

function getRnd(max) {
  return Math.floor(Math.random() * max);
}

const bot = new TelegramBot(process.env.MOTUMBITO_BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, function onStartText(msg) {
  bot.sendMessage(
    msg.chat.id,
    "Este es el bot del tio Motumbito, su único comando es /bendiceme",
  );
});

bot.onText(/\/help/, function onHelpText(msg) {
  bot.sendMessage(
    msg.chat.id,
    "Este es el bot del tio Motumbito, su único comando es /bendiceme",
  );
});

bot.onText(/\/commands/, function onCommandsText(msg) {
  bot.sendMessage(
    msg.chat.id,
    "Solo hay un comando:\n\n/bendiceme - si tienes suerte, recibirás la bendición del tio Motumbito.",
  );
});

bot.onText(/\/bendiceme/, function onBendicemeText(msg) {
  // console.log(
  //   "bendiceme: " +
  //     msg +
  //     "\n" +
  //     "sender: " +
  //     msg.from.first_name +
  //     "\n" +
  //     "id: " +
  //     msg.from.id,
  // );

  // if (msg.from.id === 270338121) {
  //   bot.sendMessage(msg.chat.id, "Ocs man");
  // } else {
  bot.sendMessage(
    msg.chat.id,
    t(bendiciones[getRnd(bendiciones.length)], { user: msg.from.first_name }),
  );
  // }

  if (msg.from.id === 151854604) {
    bot.sendMessage(msg.chat.id, "Papirrin");
  }
  // if (msg.from.id === 302305136) {
  //   bot.sendMessage(
  //     msg.chat.id,
  //     "Y por si acaso, sí tienes dejo campeón ( ͡° ͜ʖ ͡°)",
  //   );
  // }
});
