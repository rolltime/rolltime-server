var http = require('http')
var moment = require('moment')
var querystring = require('querystring')

module.exports = function (app, passport) {
  var StationObject = require('./models/station')

  //
  // Memory objects.
  //
  var station = {}
  var service

  app.get('/', function (req, res) {
    res.render('index.ejs')
  })

  app.param('id', function (req, res, next, data) {
    station.id = data
    next()
  })

  app.param('service', function (req, res, next, data) {
    service = data
    next()
  })

  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', {
      user: req.user
    })
  })

  app.get('/logout', isLoggedIn, function (req, res) {
    req.logout()
    res.redirect('/')
  })

  //
  // Authenticate first login.
  //
  app.get('/login', isLoggedOut, function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') })
  })

  app.get('/map', isLoggedIn, function (req, res) {
    res.render('map.ejs')
  })

  //
  // Process login form passsing data to passport.
  //
  app.post('/login', isLoggedOut, passport.authenticate('local-login', {
    successRedirect: '/map',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.get('/signup', isLoggedOut, function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  })

  //
  // Process sign-up form.
  //
  app.post('/signup', isLoggedOut, passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  //
  // Connect to Facebook, Twitter, and Google
  // for authentication.
  //
  app.get('/auth/twitter', isLoggedOut, passport.authenticate('twitter', { scope: 'email' }))
  app.get('/auth/facebook', isLoggedOut, passport.authenticate('facebook', { scope: 'email' }))
  app.get('/auth/google', isLoggedOut, passport.authenticate('google', { scope: ['profile', 'email'] }))

  //
  // Handle the callbacks.
  //
  app.get('/auth/facebook/callback',
    isLoggedOut,
    passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  )

  app.get('/auth/twitter/callback',
    isLoggedOut,
    passport.authenticate('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  )

  app.get('/auth/google/callback',
    isLoggedOut,
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  )

  //
  // If an user already has an account registered
  // with one of the methods above, this section
  // will provide that user with the ability to connect
  // his accounts.
  //
  app.get('/connect/local', isLoggedIn, function (req, res) {
    res.render('connect-local.ejs', { message: req.flash('loginMessage') })
  })

  app.post('/connect/local', isLoggedIn, passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/connect/local',
    failureFlash: true
  }))

  app.get('/connect/twitter', isLoggedIn, passport.authorize('twitter', { scope: 'email' }))
  app.get('/connect/facebook', isLoggedIn, passport.authorize('facebook', { scope: 'email' }))
  app.get('/connect/google', isLoggedIn, passport.authorize('google', { scope: ['profile', 'email'] }))

  app.get('/connect/facebook/callback',
    isLoggedIn,
    passport.authorize('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  )

  app.get('/connect/twitter/callback',
    isLoggedIn,
    passport.authorize('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  )

  app.get('/connect/google/callback',
    isLoggedIn,
    passport.authorize('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  )

  //
  // Here we provide methods for unlinking
  // accounts.
  //

  // Local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user
    user.local.name = undefined
    user.local.email = undefined
    user.local.password = undefined
    user.save(function (err) {
      res.redirect('/profile')
    })
  })

  // Facebook -------------------------------
  app.get('/unlink/facebook', isLoggedIn, function (req, res) {
    var user = req.user
    user.facebook.token = undefined
    user.save(function (err) {
      res.redirect('/profile')
    })
  })

  // Twitter --------------------------------
  app.get('/unlink/twitter', isLoggedIn, function (req, res) {
    var user = req.user
    user.twitter.token = undefined
    user.save(function (err) {
      res.redirect('/profile')
    })
  })

  // Google ---------------------------------
  app.get('/unlink/google', isLoggedIn, function (req, res) {
    var user = req.user
    user.google.token = undefined
    user.save(function (err) {
      res.redirect('/profile')
    })
  })

  //
  // REST endpoints for watching stations.
  //
  app.get('/watch', function (req, res) {})

  app.post('/watch', function (req, res) {
    console.log('Query: ' + req.body)
    if (_check_id(req)['status']) {
      //
      // Creates new station object.
      //
      var station = new StationObject({
        'type': req.body.type || null,
        'priority': req.body.priority || null,
        'station': {
          'id': req.body.id,
          'time': {
            'start': req.body.start || moment().format(),
            'end': req.body.end || null
          }
        }
      })

      //
      // Saves station object in database.
      //
      station.save(function (err, data) {
        if (err) {
          console.log(err)
          var payload = {
            'success': false,
            'message': 'Database error. Failed to store data.',
          }
          res.send(payload)
        } else {
          var payload = {
            'success': true,
            'message': 'Stored record in database successfully.',
            'record': data,
          }
          res.send(payload)
        }
      })
    } else {
      res.send(_check_id(req))
    }
  })

  app.delete('/watch', function (req, res) {})

  //
  // Interacting with the historic API.
  //
  app.all('/api/:service*', function (req, res) {
    //
    // Services available.
    //
    console.log('This is my queried service: ' + service)
    var services = {
      'historic': {
        'host': process.env.HISTORIC_PORT_2000_TCP_ADDR,
        'port': process.env.HISTORIC_PORT_2000_TCP_PORT
      }
    }

    //
    // Getting a query service base url
    // but also pass extra parameters.
    //
    // var query_service = services[service].host
    var pass_request = req.originalUrl.replace('/api/' + service, '')
    var keepAliveAgent = new http.Agent({ keepAlive: true })
    var options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      host: services[service].host,
      port: services[service].port,
      path: pass_request,
      method: req.method,
      agent: keepAliveAgent
    }

    //
    // Make request to service using
    // the options that came via the UI.
    //
    console.log(options)
    var request = http.request(options, function (response) {
      response.setEncoding('utf8')
      var body = ''
      response.on('data', function (chunk) {
        body += chunk
      })
      response.on('close', function () {
        res.send(body)
      })
      response.on('end', function () {
        res.send(body)
      })
    })

    //
    // Inform the user if the
    // service is not available.
    //
    request.on('error', function (error) {
      var payload = {
        'succes': false,
        'message': 'Service not available.',
        'service': service
      }
      res.send(payload)
    })

    // request.write(querystring.stringify(req.body))
    request.end()
  })

}

//
// Middleware to ensure user is
// logged-in.
//
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated())
    return next()

  res.redirect('/login')
}

function _check_id (req) {
  if (typeof req.body['id'] === undefined) {
    var payload = {
      'success': false,
      'message': 'Parameters are missing. Please provide an station id.',
    }
    return payload
  }
}

//
// Middleware to ensure user is
// logged-out.
//
function isLoggedOut (req, res, next) {
  if (req.isUnauthenticated()) {
    return next()
  }

  res.redirect('/')
}
