var connect = require('connect')
  , http = require('http')
  , serveStatic = require('serve-static');

var app = connect()
  .use(serveStatic(__dirname));

app.listen(3000);
