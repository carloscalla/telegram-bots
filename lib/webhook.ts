import TelegramBot, {Message} from 'node-telegram-bot-api'
import type {VercelRequest, VercelResponse} from '@vercel/node'
import {getBotTokenEnvVar} from './utils.js'

type ProcessMessage = (bot: TelegramBot, msg: Message) => Promise<void>
type ProcessCallbackQuery = (bot: TelegramBot, query: TelegramBot.CallbackQuery) => Promise<void>

// Builds a Vercel serverless handler for a bot. The TelegramBot instance
// (and its token lookup) is created once, at module load time, and reused
// across invocations on the same warm serverless instance.
//
// processCallbackQuery is optional: a bot module only needs to export it
// (and pass it here) if it uses inline keyboards. Bots that don't are
// unaffected.
export function createWebhookHandler(
    botName: string,
    processMessage: ProcessMessage,
    processCallbackQuery?: ProcessCallbackQuery,
) {
    const envVarName = getBotTokenEnvVar(botName)
    const token = process.env[envVarName]

    if (!token) {
        throw new Error(`${envVarName} environment variable not set`)
    }

    const bot = new TelegramBot(token)
    const displayName = botName.charAt(0).toUpperCase() + botName.slice(1)

    return async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
        if (req.method === 'POST') {
            try {
                const update: TelegramBot.Update = req.body

                // Process the message if it exists
                if (update.message) {
                    await processMessage(bot, update.message)
                } else if (update.callback_query && processCallbackQuery) {
                    await processCallbackQuery(bot, update.callback_query)
                }

                // Respond to Telegram that we received the update
                res.status(200).json({ok: true})
            } catch (error) {
                console.error('Error processing update:', error)
                res.status(500).json({error: 'Internal server error'})
            }
        } else {
            // Handle GET requests (for testing)
            res.status(200).json({status: `${displayName} bot is running!`})
        }
    }
}
