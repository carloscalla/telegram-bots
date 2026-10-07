import {createWebhookHandler} from '../lib/webhook.js'
import {processMessage} from '../bots/tipodecambio.js'

export default createWebhookHandler('tipodecambio', processMessage)
