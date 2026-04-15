// Converts a bot name to its token env variable name
// e.g. "motumbito" -> "MOTUMBITO_BOT_TOKEN", "my-bot" -> "MY_BOT_BOT_TOKEN"
export function getBotTokenEnvVar(botName: string): string {
    return `${botName.toUpperCase().replace(/-/g, '_')}_BOT_TOKEN`
}
