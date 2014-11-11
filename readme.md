# format-data-handler

Windows | Mac/Linux
------- | ---------
[![Windows Build status](http://img.shields.io/appveyor/ci/finnp/format-data-handler.svg)](https://ci.appveyor.com/project/finnp/format-data-handler/branch/master) | [![Build Status](https://travis-ci.org/finnp/format-data-handler.svg?branch=master)](https://travis-ci.org/finnp/format-data-handler)

HTTPHandler wrapper for the `format-data` module, that formats an object streams
with a format specified through the querystring or the accept headers.

Install with `npm install format-data-handler`.


## Example usage

```js
var formatDataHandler = require('format-data-handler')

var serve = formatDataHandler(function (opts) {
  return database.createReadStream(opts)
})

http.createServer(serve)
```