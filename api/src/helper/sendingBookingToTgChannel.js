const telegramBot = require('node-telegram-bot-api');
const { botToken, telegramChannelEn, telegramChannelRu } = require('../config/config');
const bot = new telegramBot(botToken)

exports.sendingBookingToTgChannel = (message) => {
    // Formatting to english.
    let formatMessageEN = (msg) => {
        let result = `Booking id: ${msg.id},
Customer name: ${msg.customer_name},
Email: ${msg.email},
Phone: ${msg.phone},
Status: ${msg.status},
Created at: ${msg.createdAt.toLocaleDateString() + ' ' + msg.createdAt.toLocaleTimeString()}

Stol:
    Number: ${message.stol.number},
    Date: ${message.stol.date}`

        return result
    }

    // Formatting to russian.
    const formatMessageRU = (msg) => {
        let result = `Id бронирования: ${msg.id},
Имя клиента: ${msg.customer_name},
Электронная почта: ${msg.email},
Телефон: ${msg.phone},
Статус: ${msg.status},
Создано в: ${msg.createdAt.toLocaleDateString() + ' ' + msg.createdAt.toLocaleTimeString()}

Стол:
    Номер: ${msg.stol.number},
    Дата: ${msg.stol.date}`

        return result
    }
    const formattedMessageEN = formatMessageEN(message)
    const formattedMessageRU = formatMessageRU(message)

    // English version.
    bot.sendMessage(telegramChannelEn, formattedMessageEN)
        .then(() => {
            console.log(
                `Booking sended to EN Telegram channel at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
            )
        })
        .catch((error) => {
            console.error('Error sending message:', error)
        })

    // Russian version.
    bot.sendMessage(telegramChannelRu, formattedMessageRU)
        .then(() => {
            console.log(
                `Booking sended to RU Telegram channel at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
            )
        })
        .catch((error) => {
            console.error('Error sending message:', error)
        })
}