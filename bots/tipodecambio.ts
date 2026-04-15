import TelegramBot, {Message} from 'node-telegram-bot-api'
import {isCommand} from '../lib/utils.js'

// API Response type for a single currency rate
interface CurrencyRate {
    code: string
    codein: string
    name: string
    high: string
    low: string
    varBid: string
    pctChange: string
    bid: string
    ask: string
    timestamp: string
    create_date: string
}

// API Response can have multiple currencies
interface ExchangeRateResponse {
    USDPEN?: CurrencyRate
    EURPEN?: CurrencyRate
}

// Simple in-memory cache
interface CacheEntry {
    data: ExchangeRateResponse
    timestamp: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 3 * 60 * 1000 // 3 minutes

const BOT_USERNAME = 'tipodecambio_bot'

// Type guard to validate API response
function isValidExchangeRateResponse(data: unknown): data is ExchangeRateResponse {
    if (typeof data !== 'object' || data === null) {
        return false
    }

    const response = data as Record<string, unknown>

    // Helper to check if a value is a valid CurrencyRate
    const isValidRate = (rate: unknown): rate is CurrencyRate => {
        if (typeof rate !== 'object' || rate === null) return false
        const r = rate as Record<string, unknown>
        return (
            typeof r.bid === 'string' &&
            typeof r.ask === 'string' &&
            typeof r.timestamp === 'string'
        )
    }

    // At least one of USD or EUR must be present and valid
    return (
        (response.USDPEN !== undefined && isValidRate(response.USDPEN)) ||
        (response.EURPEN !== undefined && isValidRate(response.EURPEN))
    )
}

// Helper to truncate to 3 decimals (no rounding)
function truncate3(value: number): string {
    return (Math.floor(value * 1000) / 1000).toFixed(3)
}

// Helper to format a single currency rate
function formatRate(rate: CurrencyRate, symbol: string, name: string, amount?: number): string {
    const bid = parseFloat(rate.bid)
    const ask = parseFloat(rate.ask)
    const prom = (bid + ask) / 2

    let message = `
${symbol} *${name} → PEN*

Compra: S/ ${truncate3(bid)}
Venta: S/ ${truncate3(ask)}
Promedio: S/ ${truncate3(prom)}`

    // Add conversion if amount is provided
    if (amount !== undefined && amount > 0) {
        const converted = amount * prom
        message += `

💰 *Conversión:*
${amount} ${name} = S/ ${truncate3(converted)}`
    }

    // Format date with multiple timezones for clarity
    const date = new Date(parseInt(rate.timestamp) * 1000)
    const peruvianTime = date.toLocaleString('es-PE', {
        timeZone: 'America/Lima',
    })

    message += `

📅 *Actualizado:*
🇵🇪 ${peruvianTime} (Perú)`

    return message.trim()
}

// Fetch exchange rate from API using native fetch
async function getExchangeRate(currencies: string[], amount?: number): Promise<string> {
    // Create cache key based only on currencies (not amount, since API call is the same)
    const cacheKey = currencies.join(',')

    // Check if we have a valid cached response
    const cachedEntry = cache.get(cacheKey)
    if (cachedEntry) {
        const age = Date.now() - cachedEntry.timestamp
        if (age < CACHE_TTL_MS) {
            console.log(`Cache hit for ${cacheKey} (age: ${Math.round(age / 1000)}s)`)
            // Use cached data and format with current amount
            const data = cachedEntry.data
            const messages: string[] = []

            if (data.USDPEN) {
                messages.push(formatRate(data.USDPEN, '💵', 'USD', amount))
            }
            if (data.EURPEN) {
                messages.push(formatRate(data.EURPEN, '💶', 'EUR', amount))
            }

            return messages.join('\n\n━━━━━━━━━━━━━━━━\n\n')
        } else {
            // Cache expired, remove it
            cache.delete(cacheKey)
        }
    }

    try {
        const response = await fetch(
            `https://economia.awesomeapi.com.br/json/last/${currencies.join(',')}?token=${process.env.AWESOMEAPI_KEY}`,
            {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    Accept: 'application/json, text/plain, */*',
                    'Accept-Language': 'es-PE,es;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    Referer: 'https://economia.awesomeapi.com.br/',
                    Origin: 'https://economia.awesomeapi.com.br',
                },
            },
        )

        if (!response.ok) {
            if (response.status === 429) {
                return '⏱️ Demasiadas solicitudes. Por favor espera un momento e intenta de nuevo.'
            }
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: unknown = await response.json()

        // Validate response structure
        if (!isValidExchangeRateResponse(data)) {
            throw new Error('Invalid API response structure')
        }

        const messages: string[] = []

        // Format USD if present
        if (data.USDPEN) {
            messages.push(formatRate(data.USDPEN, '💵', 'USD', amount))
        }

        // Format EUR if present
        if (data.EURPEN) {
            messages.push(formatRate(data.EURPEN, '💶', 'EUR', amount))
        }

        if (messages.length === 0) {
            return '❌ No se encontraron tasas de cambio.'
        }

        // Store raw API data in cache (before formatting)
        cache.set(cacheKey, {
            data: data,
            timestamp: Date.now(),
        })

        return messages.join('\n\n━━━━━━━━━━━━━━━━\n\n')
    } catch (error) {
        console.error('Error fetching exchange rate:', error)
        return '❌ Error al obtener el tipo de cambio. Intenta de nuevo más tarde.'
    }
}

export async function processMessage(bot: TelegramBot, msg: Message): Promise<void> {
    const text = msg.text || ''

    try {
        if (isCommand(text, '/start', BOT_USERNAME) || isCommand(text, '/help', BOT_USERNAME)) {
            await bot.sendMessage(
                msg.chat.id,
                '🏦 *Bot de Tipo de Cambio*\n\nComandos disponibles:\n\n/usd [cantidad] - USD → PEN\n/eur [cantidad] - EUR → PEN\n/all [cantidad] - USD y EUR → PEN\n\n*Ejemplos:*\n/usd - Ver tipo de cambio\n/usd 5 - Convertir 5 USD a PEN',
                {parse_mode: 'Markdown'},
            )
        } else if (text.startsWith('/usd')) {
            // Extract amount if provided: /usd 5 or /usd@botname 5
            const match = text.match(/^\/usd(?:@\w+)?\s+(\d+(?:\.\d+)?)/)
            const amount = match ? parseFloat(match[1]) : undefined

            const rateMessage = await getExchangeRate(['USD-PEN'], amount)
            await bot.sendMessage(msg.chat.id, rateMessage, {
                parse_mode: 'Markdown',
            })
        } else if (text.startsWith('/eur')) {
            // Extract amount if provided
            const match = text.match(/^\/eur(?:@\w+)?\s+(\d+(?:\.\d+)?)/)
            const amount = match ? parseFloat(match[1]) : undefined

            const rateMessage = await getExchangeRate(['EUR-PEN'], amount)
            await bot.sendMessage(msg.chat.id, rateMessage, {
                parse_mode: 'Markdown',
            })
        } else if (text.startsWith('/all')) {
            // Extract amount if provided
            const match = text.match(/^\/all(?:@\w+)?\s+(\d+(?:\.\d+)?)/)
            const amount = match ? parseFloat(match[1]) : undefined

            const rateMessage = await getExchangeRate(['USD-PEN', 'EUR-PEN'], amount)
            await bot.sendMessage(msg.chat.id, rateMessage, {
                parse_mode: 'Markdown',
            })
        }
    } catch (error) {
        // Try to send error message to user
        try {
            await bot.sendMessage(
                msg.chat.id,
                '❌ Ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo.',
            )
        } catch (sendError) {
            console.error('Could not send error message:', sendError)
        }
    }
}
