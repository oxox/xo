var connect = require('connect')
  , http = require('http');

var app = connect()
  .use(connect.static(__dirname))
  .use(connect.directory(__dirname));

http.createServer(app).listen(3000);