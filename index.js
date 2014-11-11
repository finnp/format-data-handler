var qs = require('querystring')
var url = require('url')
var formatData = require('format-data')
var negotiator = require('negotiator')


var formats = [
  {mime: 'application/json', format: 'json'},
  {mime: 'text/csv', format: 'csv'},
  {mime: 'application/x-ndjson', format: 'ndjson'},
  {mime:  'text/event-stream', format: 'sse'}
]


module.exports = function (source) {
  return function (req, res) {
    if(req.method === 'GET') {
      var opts = qs.parse(url.parse(req.url).query)
      var format = opts.format
      var mimetype
      if(format) {
        mimetype = getMimeType(format)
      } else {
        mimetype = parseFormat(req) || 'application/json'
        format = getFormat(mimetype)
      }

      res.setHeader('Content-Type', mimetype)
      return source(opts)
        .pipe(formatData(format, opts))
        .pipe(res)
    } else {
      // method not supported
      res.end(405)
    }
      
  }
}

function getMimeType(format) {
  return formats.filter(function (f) {
    return f.format === format
  }).pop().mime
}

function getFormat(mimetype) {
  return formats.filter(function (f) {
    return f.mime === mimetype
  }).pop().format
}

function parseFormat(req) {
  var mimes = formats.map(function (format) {
    return format.mime
  })
  var mimetype = negotiator(req).mediaType(mimes)
  return mimetype
}