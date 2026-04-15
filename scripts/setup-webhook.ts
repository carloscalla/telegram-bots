import TelegramBot from 'node-telegram-bot-api'
import {getBotTokenEnvVar} from './utils.js'

// This script sets up the webhook URL with Telegram
// Run it once after deploying to Vercel

const botName = process.argv[2]
const webhookUrl = process.argv[3]

if (!botName) {
    console.error('Error: Please provide bot name as first argument')
    console.error('Usage: npm run setup-webhook <bot-name> <webhook-url>')
    console.error(
        'Example: npm run setup-webhook motumbito https://your-app.vercel.app/api/motumbito',
    )
    process.exit(1)
}

if (!webhookUrl) {
    console.error('Error: Please provide webhook URL as second argument')
    console.error('Usage: npm run setup-webhook <bot-name> <webhook-url>')
    console.error(
        'Example: npm run setup-webhook motumbito https://your-app.vercel.app/api/motumbito',
    )
    process.exit(1)
}

const envVarName = getBotTokenEnvVar(botName)
const token = process.env[envVarName]

if (!token) {
    console.error(`Error: ${envVarName} environment variable not set`)
    console.error(`Make sure you have ${envVarName} in your .env file`)
    process.exit(1)
}

const bot = new TelegramBot(token)

console.log(`Setting up webhook for bot: ${botName}`)
console.log(`Using env variable: ${envVarName}`)
console.log(`Webhook URL: ${webhookUrl}`)

bot.setWebHook(webhookUrl)
    .then(() => {
        console.log('✅ Webhook set successfully!')
        return bot.getWebHookInfo()
    })
    .then((info) => {
        console.log('\nWebhook Info:')
        console.log(JSON.stringify(info, null, 2))
        process.exit(0)
    })
    .catch((error: Error) => {
        console.error('❌ Error setting webhook:', error.message)
        process.exit(1)
    })
