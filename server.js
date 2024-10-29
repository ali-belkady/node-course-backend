const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Generic response!');
});

server.listen(process.env.PORT || 3000);