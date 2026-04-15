import TelegramBot from "node-telegram-bot-api";
import { getBotTokenEnvVar } from "./utils.js";

// This script registers the bot command list shown in the Telegram app
// Run it once per bot after adding or changing commands

const BOT_COMMANDS: Record<string, TelegramBot.BotCommand[]> = {
  motumbito: [
    { command: "start", description: "Iniciar el bot" },
    { command: "help", description: "Mostrar ayuda" },
    { command: "commands", description: "Ver comandos disponibles" },
    {
      command: "bendiceme",
      description: "Recibe la bendición del tio Motumbito",
    },
  ],
  tipodecambio: [
    { command: "start", description: "Iniciar el bot" },
    { command: "help", description: "Mostrar ayuda" },
    {
      command: "usd",
      description: "Ver tipo de cambio USD → PEN (ej: /usd 5)",
    },
    {
      command: "eur",
      description: "Ver tipo de cambio EUR → PEN (ej: /eur 5)",
    },
    { command: "all", description: "Ver USD y EUR → PEN (ej: /all 5)" },
  ],
};

const botName = process.argv[2];

if (!botName) {
  console.error("Error: Please provide bot name as first argument");
  console.error("Usage: npm run setup-commands <bot-name>");
  console.error("Example: npm run setup-commands motumbito");
  console.error(`Available bots: ${Object.keys(BOT_COMMANDS).join(", ")}`);
  process.exit(1);
}

const commands = BOT_COMMANDS[botName];

if (!commands) {
  console.error(`Error: Unknown bot "${botName}"`);
  console.error(`Available bots: ${Object.keys(BOT_COMMANDS).join(", ")}`);
  process.exit(1);
}

const envVarName = getBotTokenEnvVar(botName);
const token = process.env[envVarName];

if (!token) {
  console.error(`Error: ${envVarName} environment variable not set`);
  console.error(`Make sure you have ${envVarName} in your .env file`);
  process.exit(1);
}

const bot = new TelegramBot(token);

console.log(`Setting up commands for bot: ${botName}`);
console.log(`Using env variable: ${envVarName}`);
console.log(`Commands to register:`);
commands.forEach((cmd) =>
  console.log(`  /${cmd.command} - ${cmd.description}`),
);

bot
  .setMyCommands(commands)
  .then(() => {
    console.log("\n✅ Commands registered successfully!");
    return bot.getMyCommands();
  })
  .then((registered) => {
    console.log("\nRegistered commands:");
    registered.forEach((cmd) =>
      console.log(`  /${cmd.command} - ${cmd.description}`),
    );
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error("❌ Error registering commands:", error.message);
    process.exit(1);
  });
