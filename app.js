var express = require('express');
var app = express();
var request = require('request');
var fs = require('fs');
var Url = require('url');
var path = require('path');

const faviconPath = path.join(__dirname, 'favicon');

function downloadFile(uri, filename, callback) {
    try {
        let stats = fs.statSync(filename);
        if(stats.size > 0) {
            callback(null);
        } else {
            callback(new Error("empty ico file"));
        }
    } catch (error) {
        var stream = fs.createWriteStream(filename);
        var error = null;
        request(uri, {
                timeout: 3000
            })
            .on('error', function (err) {
                stream.close();
                error = err;
            })
            .pipe(stream).on('close', function () {
                callback(error);
            });
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

    // console.log(url, fileName);
    var google = "http://www.google.com/s2/favicons?domain=";
    var statvoo = "https://api.statvoo.com/favicon/?url="

    downloadFile(google + url, path.join(faviconPath, fileName), function (err) {
        console.log("err", err);
        if (err) {
            fs.unlink(path.join(faviconPath, fileName), function (err) {});
            fileName = "default.ico";
        }
        res.setHeader("Cache-Control", "public,max-age=2592000"); // 缓存一个月
        res.sendFile(fileName, options, function (err) {
            res.status(200).end();
        });
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App favicon get listening at http://%s:%s', host, port);
});