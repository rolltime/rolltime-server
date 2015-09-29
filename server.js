//
// Dependencies.
//
var morgan = require('morgan')
var express = require('express')
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')

//
// Configuration variables.
//
var app = express()
var port = process.env.PORT || 8080
var DB = require('./config/database')

//
// Only start the application
// if the database is ready.
//
mongoose.connection.on('connected', function (ref) {
  //
  // Log, parse request, and alike.
  //
  app.use(morgan('dev'))
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.set('view engine', 'ejs')
  app.use(express.static('public'))
  app.use(bodyParser.urlencoded({ extended: false }))

  //
  // Start sessions with
  // a password.
  //
  require('./app/auth/passport')(passport) // pass passport for configuration
  app.use(session({
    secret: process.env.SESSION_KEY || 'rolltimekey',
    saveUninitialized: false,
    resave: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use(flash())

  //
  // Routes (with passport).
  //
  require('./app/routes.js')(app, passport)

  //
  // Start server.
  //
  app.listen(port)
  console.log('Rolltime Server running on port ' + port)

})

mongoose.connection.on('error', function (err) {
  console.log('Could not connect to MongoDB.')
  throw err
})

//
// Attempt connection with MongoDB.
//
console.log('Attempting connection to: ' + DB.url)
mongoose.connect(DB.url)
