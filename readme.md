# format-data-handler

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