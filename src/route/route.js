const router = require("./root/rootRouter")

exports.appRouter = (app) => {
    app.use('/', router)
}