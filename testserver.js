// testserver


var PassThrough = require('stream').PassThrough

function testserver(port) {
  var http = require('http')
  var formatDataHandler = require('./')

  var handler = formatDataHandler(function (opts) {
    return createTestStream()
  })

  return http.createServer(function (req, res) {
    handler(req, res)
  })
  
  function createTestStream() {
    var pass = new PassThrough({objectMode: true})
    pass.write({a:1 , b: 2})
    setTimeout(function () {
      pass.write({a:2, b: 3})
      pass.end()  
    }, 10)
    return pass
  }
}


module.exports = testserver

