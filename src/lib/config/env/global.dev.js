module.exports = {
    PORT: process.env.port || 3000,
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/intuitiv',

    facebookAuth: {
        clientID: '223489421012374', // your App ID
        clientSecret: '00a8b0367fcf6c5d19dde2fdcc67be79', // your App Secret
        callbackURL: 'http://localhost:3000/oauth/facebook/callback',
        profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        profileFields: ['id', 'email', 'name'] // For requesting permissions from Facebook API
    }
}
