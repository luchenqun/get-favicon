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

app.get('/', function (req, res) {
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

    downloadFile("http://www.google.com/s2/favicons?domain=" + url, path.join(faviconPath, fileName), function () {
        res.setHeader("Cache-Control", "public,max-age=2592000"); // 缓存一个月
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