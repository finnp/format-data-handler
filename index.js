var qs = require('querystring')
var url = require('url')
var formatData = require('format-data')

module.exports = function (source) {
  return function (req, res) {
    if(req.method === 'GET') {
      var opts = qs.parse(url.parse(req.url).query)
      var format = opts.format
      if(!format) format = parseFormat(req.headers)
      
      return source(opts)
        .pipe(formatData(format, opts))
        .pipe(res)
    } else {
      // method not supported
      res.end(405)
    }
      
  }
}

// naive mapping
var mimeMap = {
  'text/csv': 'csv',
  'application/x-ndjson': 'ndjson',
  'application/json': 'json',
  'text/event-stream': 'sse'
}

function parseFormat(headers) {
  if(!('accept' in headers)) return
    
  var types = headers.accept.split(',')
    .map(function (type) {
      // remove stuff like `;q=0.8` this should be properly parsed though
      return type.split(';').shift()
    })
  
  var format = types
    .filter(function (mimetype) {
        return mimetype in mimeMap
    })
    .map(function (mimetype) {
      return mimeMap[mimetype]
    })
    .pop()

  return format
}