var express = require('express');
var app = express();
var request = require('request');
var fs = require('fs');
var Url = require('url');
var path = require('path');

const faviconPath = path.join(__dirname, 'favicon');

function downloadFile(uri, filename, callback) {
    if (fs.existsSync(filename)) {
        callback();
    } else {
        var stream = fs.createWriteStream(filename);
        request(uri).pipe(stream).on('close', callback);
    }
}

app.use(express.static(faviconPath, {
    maxAge: 1000 * 60 * 60 * 24 * 7
}));

app.get('/favicon', function (req, res) {
    var url = req.query.url;
    var options = {
        root: faviconPath,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var urlObj = Url.parse(url);
    fileName = (urlObj.hostname || "default") + ".ico";

    //console.log(url, fileName);

    downloadFile("http://www.google.com/s2/favicons?domain=" + url, faviconPath + fileName, function () {
        res.sendFile(fileName, options, function (err) {
            if (err) {
                res.status(err.status).end();
            } else {
                res.status(200).end();
            }
        });
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});