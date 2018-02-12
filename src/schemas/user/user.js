import mongoose from 'mongoose'

// import bcrypt from 'bcrypt-nodejs'

import { isEmail } from 'validator'

import extend from 'extend'

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
    }

})

extend(userSchema.statics, require('./user-statics'))

extend(userSchema.methods, require('./user-methods'))

// Execute before each user.save() call
userSchema.pre('save', function(callback) {
    // Break out if the password hasn't changed
    this.presave(this, callback)
})

module.exports = mongoose.model('user', userSchema, 'user')
