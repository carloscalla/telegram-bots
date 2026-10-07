import type TelegramBot from 'node-telegram-bot-api'

// Checks if a message text matches a given command.
// Handles both "/cmd" and "/cmd@botusername" formats (for group chats).
export function isCommand(text: string, command: string, botUsername: string): boolean {
    return text === command || text === `${command}@${botUsername}`
}

// Caches each bot's @username (from getMe()) for the lifetime of its
// TelegramBot instance, so repeated calls - e.g. one per request on a warm
// serverless instance - don't re-hit the Telegram API. A failed lookup is
// evicted from the cache so the next call can retry.
const usernameCache = new WeakMap<TelegramBot, Promise<string>>()

export function getBotUsername(bot: TelegramBot): Promise<string> {
    let cached = usernameCache.get(bot)
    if (!cached) {
        cached = bot.getMe().then((me) => {
            if (!me.username) {
                throw new Error('Bot has no username configured on its Telegram account')
            }
            return me.username
        })
        cached.catch(() => usernameCache.delete(bot))
        usernameCache.set(bot, cached)
    }
    return cached
}
