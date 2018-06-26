const env = process.env.NODE_ENV

var config = env ? require(`./env/global.${env}`) : require('./env/global.dev')

module.exports = config
