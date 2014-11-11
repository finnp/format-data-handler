var qs = require('querystring')
var url = require('url')
var formatData = require('format-data')
var negotiator = require('negotiator')

module.exports = function (source) {
  return function (req, res) {
    if(req.method === 'GET') {
      var opts = qs.parse(url.parse(req.url).query)
      var format = opts.format
      if(!format) format = parseFormat(req)
      
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
  'application/json': 'json',
  'text/csv': 'csv',
  'application/x-ndjson': 'ndjson',
  'text/event-stream': 'sse'
}

function parseFormat(req) {
  var mimetype = negotiator(req).mediaType(Object.keys(mimeMap))
  return mimeMap[mimetype]
}