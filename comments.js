// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var port = 8000;
var comments = [];
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), uri);
    console.log('Loading ' + uri);
    var stats;

    try {
        stats = fs.lstatSync(filename);
    } catch (e) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;
    }

    if (stats.isFile()) {
        var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
        res.writeHead(200, {'Content-Type': mimeType});

        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('500 Internal server error\n');
        res.end();
    }
});

server.listen(port);
console.log('Server listening on port ' + port);