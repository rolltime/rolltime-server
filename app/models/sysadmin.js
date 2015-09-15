var mongoose = require('mongoose')

var SysadminSchema = mongoose.Schema({
  sysadmin: {
    user: [],
    privileges: [],
    superuser: Boolean
  }
})

module.exports = mongoose.model('Sysadmin', SysadminSchema)
