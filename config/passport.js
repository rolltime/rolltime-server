//
// Authentication strategies.
//
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var TwitterStrategy = require('passport-twitter').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

//
// Database user model.
//
var User = require('../app/models/user')

//
// Login authentications.
//
var configAuth = require('./auth')

module.exports = function (passport) {
  //
  // Passport is used here to make sure
  // sessions as persistent and that users
  // have a continuous experience.
  //

  //
  // Serialize user by id.
  //
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  //
  // Deserialize user by id.
  //
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })

  //
  // Local login.
  //
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
    function (req, email, password, done) {
      process.nextTick(function () {
        User.findOne({ 'local.email': email }, function (err, user) {
          if (err) {
            return done(err)
          }

          //
          // If no user is found,
          // return error message.
          //
          if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user found.'))

          }

          if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Wrong password.'))
          }

          //
          // Finally, return an user
          // if all is well.
          //
          else {
            return done(null, user)
          }
        })
      })

    }))

  //
  // Local signup.
  //
  passport.use('local-signup', new LocalStrategy({// by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, email, password, done) {
      process.nextTick(function () {
        //
        //  Whether we're signing up or connecting an account, we'll need
        //  to know if the email address is in use.
        //
        User.findOne({'local.email': email}, function (err, existingUser) {
          if (err) {
            return done(err)
          }

          //
          // If an user exists with
          // that same email.
          //
          if (existingUser) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
          }

          //
          // If we're logged in,
          // we're connecting a new local account.
          //
          if (req.user) {
            var user = req.user
            user.local.email = email
            user.local.password = user.generateHash(password)
            user.save(function (err) {
              if (err) {
                throw err
              }
              return done(null, user)
            })
          } else {
            //
            // If user is not loggedin,
            // create a new user.
            //
            var newUser = new User()

            newUser.local.email = email
            newUser.local.password = newUser.generateHash(password)

            newUser.save(function (err) {
              if (err) {
                throw err
              }

              return done(null, newUser)
            })
          }

        })
      })

    }))

  //
  // Facebook.
  //
  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

  },
    function (req, token, refreshToken, profile, done) {
      process.nextTick(function () {
        if (!req.user) {
          User.findOne({ 'facebook.id': profile.id }, function (err, user) {
            if (err) {
              return done(err)
            }

            if (user) {
              //
              // If there is a user id already but no token
              // (user was linked at one point and then removed)
              //
              if (!user.facebook.token) {
                user.facebook.token = token
                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
                user.facebook.email = profile.emails[0].value

                user.save(function (err) {
                  if (err)
                    throw err
                  return done(null, user)
                })
              }

              return done(null, user)  // User found, return that user.
            } else {
              //
              // if there is no user, create them.
              //
              var newUser = new User()

              newUser.facebook.id = profile.id
              newUser.facebook.token = token
              newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
              newUser.facebook.email = profile.emails[0].value

              newUser.save(function (err) {
                if (err) {
                  throw err
                }
                return done(null, newUser)
              })
            }
          })

        } else {
          var user = req.user  // pull the user out of the session

          user.facebook.id = profile.id
          user.facebook.token = token
          user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
          user.facebook.email = profile.emails[0].value

          user.save(function (err) {
            if (err) {
              throw err
            }
            return done(null, user)
          })

        }
      })

    }))

  //
  // Twitter.
  //
  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
    passReqToCallback: true

  },
    function (req, token, tokenSecret, profile, done) {
      process.nextTick(function () {
        if (!req.user) {
          User.findOne({ 'twitter.id': profile.id }, function (err, user) {
            if (err) {
              return done(err)
            }

            if (user) {
              //
              // if there is a user id already but no token
              // (user was linked at one point and then removed)
              //
              if (!user.twitter.token) {
                user.twitter.token = token
                user.twitter.username = profile.username
                user.twitter.displayName = profile.displayName

                user.save(function (err) {
                  if (err) {
                    throw err
                  }
                  return done(null, user)
                })
              }

              return done(null, user)  // user found, return that user
            } else {
              //
              // If there is no user,
              // create them.
              //
              var newUser = new User()

              newUser.twitter.id = profile.id
              newUser.twitter.token = token
              newUser.twitter.username = profile.username
              newUser.twitter.displayName = profile.displayName

              newUser.save(function (err) {
                if (err) {
                  throw err
                }
                return done(null, newUser)
              })
            }
          })

        } else {
          //
          // User already exists and is logged in,
          // we have to link accounts.
          //
          var user = req.user  // Pull the user out of the session.

          user.twitter.id = profile.id
          user.twitter.token = token
          user.twitter.username = profile.username
          user.twitter.displayName = profile.displayName

          user.save(function (err) {
            if (err) {
              throw err
            }
            return done(null, user)
          })
        }

      })

    }))

  //
  // Google.
  //
  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback: true

  },
    function (req, token, refreshToken, profile, done) {
      process.nextTick(function () {
        if (!req.user) {
          User.findOne({ 'google.id': profile.id }, function (err, user) {
            if (err) {
              return done(err)
            }

            if (user) {
              //
              // If there is a user id already but no token
              // (user was linked at one point and then removed)
              //
              if (!user.google.token) {
                user.google.token = token
                user.google.name = profile.displayName
                user.google.email = profile.emails[0].value  // pull the first email

                user.save(function (err) {
                  if (err) {
                    throw err
                  }
                  return done(null, user)
                })
              }

              return done(null, user)
            } else {
              var newUser = new User()

              newUser.google.id = profile.id
              newUser.google.token = token
              newUser.google.name = profile.displayName
              newUser.google.email = profile.emails[0].value // pull the first email

              newUser.save(function (err) {
                if (err) {
                  throw err
                }
                return done(null, newUser)
              })
            }
          })

        } else {
          //
          // User already exists and is logged in,
          // we have to link accounts.
          //
          var user = req.user  // pull the user out of the session

          user.google.id = profile.id
          user.google.token = token
          user.google.name = profile.displayName
          user.google.email = profile.emails[0].value  // pull the first email

          user.save(function (err) {
            if (err) {
              throw err
            }
            return done(null, user)
          })

        }

      })

    }))

}
