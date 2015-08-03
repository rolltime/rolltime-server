// expose our config directly to our application using module.exports
module.exports = {
  'facebookAuth': {
    'clientID': process.env.FACEBOOK_CLIENT_ID,
    'clientSecret': process.env.FACEBOOK_CLIENT_SECRET,
    'callbackURL': process.env.CALLBACK_URL + '/auth/facebook/callback'
  },

  'twitterAuth': {
    'consumerKey': process.env.TWITTER_CONSUMER_KEY,
    'consumerSecret': process.env.TWITTER_CONSUMER_SECRET,
    'callbackURL': process.env.CALLBACK_URL + '/auth/twitter/callback'
  },

  'googleAuth': {
    'clientID': process.env.GOOGLE_CLIENT_ID,
    'clientSecret': process.env.GOOGLE_CLIENT_SECRET,
    'callbackURL': process.env.CALLBACK_URL + '/auth/google/callback'
  }

}
