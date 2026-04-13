const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    let filePath = '.' + req.url;
    // Strip query parameters
    filePath = filePath.split('?')[0];

    if (filePath == './') filePath = './index.html';
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = { 
        '.html': 'text/html', 
        '.js': 'text/javascript', 
        '.css': 'text/css', 
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.json': 'application/json'
    };
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end("File not found");
            } else {
                res.writeHead(500);
                res.end("Server error: " + error.code);
            }
        } else {
            // Force NO CACHING
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            });
            res.end(content, 'utf-8');
        }
    });
}).listen(3001, () => {
    console.log("No-cache server running at http://localhost:3001/");
});
