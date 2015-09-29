var mongoose = require('mongoose')

var StationSchema = mongoose.Schema({
  station: {
    user: String,
    type: String,  // Either 'active' or 'passive'.
    priority: Number,
    station: {
      id: Number,
      time: {
        start: String,
        end: String
      }
    }
  }
})

module.exports = mongoose.model('Station', StationSchema)
