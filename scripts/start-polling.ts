import TelegramBot from 'node-telegram-bot-api'
import {resolve} from 'path'
import {getBotTokenEnvVar} from '../lib/utils.js'

/**
 * Generic polling bot starter
 * Usage: tsx --env-file=.env scripts/start-polling.ts <bot-name>
 * Example: tsx --env-file=.env scripts/start-polling.ts motumbito
 */

const botName = process.argv[2]

if (!botName) {
    console.error('Error: Please provide bot name as argument')
    console.error('Usage: tsx --env-file=.env scripts/start-polling.ts <bot-name>')
    console.error('Example: tsx --env-file=.env scripts/start-polling.ts motumbito')
    process.exit(1)
}

const envVarName = getBotTokenEnvVar(botName)
const token = process.env[envVarName]

if (!token) {
    console.error(`Error: ${envVarName} environment variable not set`)
    console.error(`Make sure you have ${envVarName} in your .env file`)
    process.exit(1)
}

// Dynamically import the bot logic
const logicPath = resolve(process.cwd(), `bots/${botName}.js`)

;(async () => {
    try {
        const {processMessage} = await import(logicPath)

        // Create bot with polling enabled
        const bot = new TelegramBot(token, {
            polling: true,
        })

        // Listen for all messages
        bot.on('message', async (msg) => {
            try {
                await processMessage(bot, msg)
            } catch (error) {
                console.error('Error processing message:', error)
            }
        })

        console.log(`🤖 ${botName} bot is running in polling mode (local dev)...`)
        console.log(`📍 Logic file: bots/${botName}.ts`)
        console.log(`🔑 Token env var: ${envVarName}`)
    } catch (error) {
        console.error(`Failed to load bot logic from: ${logicPath}`)
        console.error('Make sure the file exists and exports processMessage()')
        console.error(error)
        process.exit(1)
    }
})()
