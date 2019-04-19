let express = require("express");
let app = express();
let request = require("request");
let fs = require("fs");
let Url = require("url");
let path = require("path");

const faviconPath = path.join(__dirname, "favicon");

function downloadFile(uri, filename, callback) {
    try {
        let stats = fs.statSync(filename);
        // size 为 492 的是 Google 获取失败的默认favicon, 不喜欢，还是用我自己默认的
        if (stats.size > 0 && stats.size !== 492) {
            callback(null);
        } else {
            callback(new Error("empty ico file"));
        }
    } catch (err) {
        let stream = fs.createWriteStream(filename);
        let error = null;
        request(uri, {
            timeout: 3000
        })
            .on("error", function (err) {
                stream.close();
                error = err;
            })
            .pipe(stream)
            .on("close", function () {
                if (stream && stream.bytesWritten === 492) {
                    callback(new Error("google defalut ico file"));
                } else {
                    callback(error);
                }
            });
    }
}

app.get("/", function (req, res) {
    let url = req.query.url;
    let options = {
        root: faviconPath,
        dotfiles: "deny",
        headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
        }
    };

    let urlObj = Url.parse(url);
    let fileName = (urlObj.hostname || "default") + ".ico";

    console.log(url, fileName);
    let google = "http://www.google.com/s2/favicons?domain=";

    downloadFile(google + url, path.join(faviconPath, fileName), function (err) {
        console.log("err", err);
        if (err) {
            fs.unlink(path.join(faviconPath, fileName), function () { });
            fileName = "default.ico";
        }
        res.setHeader("Cache-Control", "public,max-age=2592000"); // 缓存一个月
        res.sendFile(fileName, options, function (err) {
            let status = 200;
            if (err) {
                console.log("sendFile err", err);
                status = err.status || 404
            }
            res.status(status).end();
        });
    });
});

app.listen(3000, function () { });
