var testserver = require('./testserver.js')
var split = require('split2')
var request = require('request')

// run on port 5000
var port = 5000
var server = testserver()
server.listen(port)
var sUrl = 'http://localhost:' + port

var test = require('tape')
var http = require('http')

test('default to json array', function (t) {
  t.plan(1)
  request(sUrl)
    .pipe(testFirstRow(t, '[{"a":1,"b":2},{"a":2,"b":3}]', 'json'))
})

test('simple request via query string', function (t) {
  t.plan(4)
  var testRow = testFirstRow.bind(null, t)
  
  request(sUrl + '?format=csv')
    .pipe(testRow('a,b', 'csv'))

  request(sUrl + '?format=ndjson')
    .pipe(testRow('{"a":1,"b":2}', 'ndjson'))
    
  request(sUrl + '?format=sse')
    .pipe(testRow('event: data', 'sse'))
    
  request(sUrl + '?format=json&style=object')
    .pipe(testRow('{"rows":[{"a":1,"b":2},{"a":2,"b":3}]}', 'json + ?style=object'))

})

test('accept headers', function (t) {
  var testRow = testFirstRow.bind(null, t)

  t.plan(4)

  request({
    url: sUrl,
    headers: {
      accept: 'text/csv'
    }
  })
  .pipe(testRow('a,b', 'text/csv'))
  
  request({
    url: sUrl,
    headers: {
      accept: 'application/json'
    }
  })
  .pipe(testRow('[{"a":1,"b":2},{"a":2,"b":3}]', 'application/json'))
  
  request({
    url: sUrl + '?style=object',
    headers: {
      accept: 'application/json'
    }
  })
  .pipe(testRow('{"rows":[{"a":1,"b":2},{"a":2,"b":3}]}', 'application/json + ?style=object'))
  
  request({
    url: sUrl,
    headers: {
      accept: 'test/html,application/*;'
    }
  })
  .pipe(testRow('[{"a":1,"b":2},{"a":2,"b":3}]', 'application/json + match'))
  

})


test('end server', function (t) {
  server.close()
  t.end()
})

function testFirstRow(t, compareWith, msg) {
  var input = split()
  
  input
  .once('data', function (data) {
    t.equals(compareWith, data, msg)
  })
  
  return input
}

// 
// test('querystring select ',function (t) {
//   
// })