
require('dotenv').config()
// import * as crypto from 'crypto';

const token = process.env.BOT_TOKEN
const TelegramBot = require('node-telegram-bot-api');

export interface ExchangeProperties {
    sendToken: number
    sendCurrency: string
    receiveToken: number
    receiveCurrency: string
    wallet?: string
  }

const {
    InlineKeyboard,
    ReplyKeyboard,
    ForceReply,
    Row,
    KeyboardButton,
    InlineKeyboardButton
} = require('node-telegram-keyboard-wrapper')


// export const varifyTelegramWebAppData = (telegramInitData: string): boolean => {
//     // The data is a query string, which is composed of a series of field-value pairs.
//     const encoded = decodeURIComponent(telegramInitData);

//     // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
//     const secret = crypto
//         .createHmac('sha256', 'WebAppData')
//         .update(token);

//     // Data-check-string is a chain of all received fields'.
//     const arr = encoded.split('&');
//     const hashIndex = arr.findIndex(str => str.startsWith('hash='));
//     const hash = arr.splice(hashIndex)[0].split('=')[1];
//     // sorted alphabetically
//     arr.sort((a, b) => a.localeCompare(b));
//     // in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
//     // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
//     const dataCheckString = arr.join('\n');

//     // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
//     const _hash = crypto
//         .createHmac('sha256', secret.digest())
//         .update(dataCheckString)
//         .digest('hex');

//     // if hash are equal the data may be used on your server.
//     // Complex data types are represented as JSON-serialized objects.
//     return _hash === hash;
// };

const bot = new TelegramBot(token, {
    polling: true
});


const splitTextByLength = (str, len) => {
    var res = [];
    while (str.length) {
        res.push(str.substring(0, len));
        str = str.substring(len);
    }
    return res;
}

const sendMessage = async (chatId: number, text: string, bot?, options?) => {
    if (text.length > 4000) {
        const sepparatedText = splitTextByLength(text, 4000);
        for (let i = 0; i < sepparatedText.length; i++) {
            const chunk = sepparatedText[i];
            await sendMessage(chatId, chunk)
        }

        if (options)
            await sendMessage(chatId, 'Choose option', options)

    }
    else await bot.sendMessage(chatId, text, options)
}

/**
 * Any object to query string 
 */
const objectToQueryString = (obj) => {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

const generateLink = async (chatId, data: ExchangeProperties) => {
    const link = `${process.env.FRONT_URL}swap?${objectToQueryString(data)}`
    const options = {
        "reply_markup": {
            "one_time_keyboard": true,
            "resize_keyboard": true,
            "inline_keyboard": [[{
                "text": "Confirm swap 👌",
                "url": link
            }]]
        }
    }
    await bot.sendMessage(chatId, `You swap ${data.sendToken} ${data.sendCurrency} -> ${data.receiveToken} ${data.receiveCurrency}` , options);
}

bot.onText(/\/start/i, async (msg) => {
    const options = {
        "reply_markup": {
            "one_time_keyboard": true,
            "resize_keyboard": true,
            "keyboard": [[{
                "text": "Swap",
                "web_app": {
                    "url": process.env.FRONT_URL
                }
            }]]
        }
    }
    await sendMessage(msg.from.id, "Welcome", bot, options)
});


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (msg['web_app_data']) {
        const data = JSON.parse(msg['web_app_data'].data)
        await generateLink(chatId, data)
    }
});

module.exports = {
    generateLink
}