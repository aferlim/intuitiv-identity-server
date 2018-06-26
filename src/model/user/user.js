const mongoose = require('mongoose')
const { isEmail } = require('validator')
const extend = require('extend')

const roleSchema = require('./role-schema')

const userSchema = mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [isEmail, 'Please fill a valid email address']
    },

    role: [roleSchema],

    created: { type: Date },

    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    },

    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },

    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

})

extend(userSchema, require('./user-statics'), require('./user-methods'))

// Execute before each user.save() call
userSchema.pre('save', function (callback) {
    // Break out if the password hasn't changed
    this.presave(this, callback)
})

module.exports = mongoose.model('user', userSchema, 'user')
