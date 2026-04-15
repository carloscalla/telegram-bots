// Checks if a message text matches a given command.
// Handles both "/cmd" and "/cmd@botusername" formats (for group chats).
export function isCommand(
  text: string,
  command: string,
  botUsername: string,
): boolean {
  return text === command || text === `${command}@${botUsername}`;
}
