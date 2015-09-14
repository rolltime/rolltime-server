// expose our config directly to our application using module.exports
module.exports = {
  'facebookAuth': {
    'clientID': process.env.FACEBOOK_CLIENT_ID || 'test',
    'clientSecret': process.env.FACEBOOK_CLIENT_SECRET || 'test',
    'callbackURL': process.env.CALLBACK_URL + '/auth/facebook/callback' || 'test'
  },

  'twitterAuth': {
    'consumerKey': process.env.TWITTER_CONSUMER_KEY || 'test',
    'consumerSecret': process.env.TWITTER_CONSUMER_SECRET || 'test',
    'callbackURL': process.env.CALLBACK_URL + '/auth/twitter/callback' || 'test'
  },

  'googleAuth': {
    'clientID': process.env.GOOGLE_CLIENT_ID || 'test',
    'clientSecret': process.env.GOOGLE_CLIENT_SECRET || 'test',
    'callbackURL': process.env.CALLBACK_URL + '/auth/google/callback' || 'test'
  }
}
