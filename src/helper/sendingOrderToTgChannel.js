const telegramBot = require('node-telegram-bot-api');
const { botToken, telegramChannelEn, telegramChannelRu } = require('../config/config');
const bot = new telegramBot(botToken)

exports.sendingOrderToTgChannel = (message) => {
    // Formatting to english.
    let formatMessageEN = (msg) => {
        const meals = msg.meals
        let mealsText = ''
        for (let i = 0; i < meals.length; i++) {
            mealsText += `${i + 1}. 
   Meal name: ${meals[i].en_name},
   Amount: ${meals[i].amount},
   Price: $${meals[i].price}
`
        }
        let result = `Order id: ${msg.id},
Customer name: ${msg.customer_name},
Email: ${msg.email},
Phone: ${msg.phone},
Status: ${msg.status},
Created at: ${msg.createdAt.toLocaleDateString() + ' ' + msg.createdAt.toLocaleTimeString()}

Meals:
${mealsText}`

        return result
    }

    // Formatting to russian.
    const formatMessageRU = (msg) => {
        const meals = msg.meals
        let mealsText = ''
        for (let i = 0; i < meals.length; i++) {
            mealsText += `${i + 1}. 
   Название блюда: ${meals[i].ru_name},
   Количество: ${meals[i].amount},
   Цена: $${meals[i].price}
`
        }
        let result = `Id бронирования: ${msg.id},
Имя клиента: ${msg.customer_name},
Электронная почта: ${msg.email},
Телефон: ${msg.phone},
Статус: ${msg.status},
Создано в: ${msg.createdAt.toLocaleDateString() + ' ' + msg.createdAt.toLocaleTimeString()}

Блюди:
${mealsText}`

        return result
    }
    const formattedMessageEN = formatMessageEN(message)
    const formattedMessageRU = formatMessageRU(message)

    // English version.
    bot.sendMessage(telegramChannelEn, formattedMessageEN)
        .then(() => {
            console.log(
                `Order sent to EN Telegram channel at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
            )
        })
        .catch((error) => {
            console.error('Error sending message:', error)
        })

    // Russian version.
    bot.sendMessage(telegramChannelRu, formattedMessageRU)
        .then(() => {
            console.log(
                `Order sent to RU Telegram channel at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
            )
        })
        .catch((error) => {
            console.error('Error sending message:', error)
        })
}