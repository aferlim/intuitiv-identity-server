const mongoose = require('mongoose')

module.exports = (config) => {
    mongoose.Promise = require('bluebird')

    mongoose.connect(config.MONGO_CONNECTION_STRING, {}, err => {
        var e = err
        if (e) { console.log('ERR on conect') }
    })

    mongoose.connection.on('connected', () => {
        console.log(`mongoose conected on: ${config.MONGO_CONNECTION_STRING}`)
    })

    mongoose.connection.on('error', function (err) {
        console.log('Mongoose default connection error: ' + err)
    })

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected')
    })

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination')
            process.exit(0)
        })
    })

    // process.on('unhandledRejection', up => {

    //     //let e = up;
    //     //Promise.reject();
    //     //throw up;

    // })
}
