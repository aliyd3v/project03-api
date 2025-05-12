const { scrypt } = require('crypto')
const util = require('util')
const { salt } = require('../config/config')

exports.scryptHash = async (string, salt) => {
    const hashBuffer = await util.promisify(scrypt)(string, salt, 32)
    return `${hashBuffer.toString('hex')}`
}

exports.scryptVerify = async (string, hash) => {
    return await this.scryptHash(string, salt) === hash
}