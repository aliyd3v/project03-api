const { connect } = require("mongoose");
const { mongodbUrl } = require("../config/config");

exports.connectMongodb = () => {
    return connect(mongodbUrl).then(() => {
        console.log('Mongodb connected')
    }).catch((error) => {
        console.log(error)
    })
}