require('dotenv').config()

// PORT.
exports.port = process.env.PORT || 3030

// JWT config.
exports.jwtSecretKey = process.env.JWT_SECRET_KEY

// MongoDB config.
exports.mongodbUrl = process.env.MONGODB_URL

// Supabase config.
exports.supabaseUrl = process.env.SUPABASE_URL
exports.supabaseKey = process.env.SUPABASE_ACCESS_KEY
exports.supabaseBucketName = process.env.SUPABASE_BUCKET_NAME

// Email for nodemailer.
exports.MyTestEmail = process.env.MY_EMAIL
exports.MyTestEmailPassword = process.env.MY_EMAIL_PASSWORD

// Project status.
exports.projectStatus = process.env.NODE_ENV

// API server domain.
exports.domain = process.env.DOMAIN

// Telegram bot API token.
exports.botToken = process.env.BOT_TOKEN

// English telegram channel username.
exports.telegramChannelEn = process.env.TG_CHANNEL_EN

// Russian telegram channel username.
exports.telegramChannelRu = process.env.TG_CHANNEL_RU