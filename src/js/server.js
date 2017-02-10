var http = require('http');

var server = http.createServer((req, rsp) => {
  rsp.end('foo');
});

var port = 3333;

server.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('server started on port ' + port);
  }
});
