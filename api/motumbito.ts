import {createWebhookHandler} from '../lib/webhook.js'
import {processMessage} from '../bots/motumbito.js'

export default createWebhookHandler('motumbito', processMessage)
