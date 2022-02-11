const http = require('http');

const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/health':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end();
            break;
        default:
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                data: 'Hello from app 2!'
            }));
    }
});

server.listen(8000);
