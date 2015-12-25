var Feed = require("./Feed.js");
var Chapter = require("./Chapter.js");

var express = require("express");
var app = express();

app.get('/feed/:id', (req, res) =>
{
    var feed = new Feed("feeds/" + req.params.id + ".json");

    feed.load()
        .then((self) => self.update())
        .then((self) =>
        {
            res.set('Content-Type', 'application/rss+xml');
            res.send(new Buffer(self.xml()));
            res.end();
            return self.save();
        });
});

app.use(express.static("client"));

app.listen(process.env.PORT || 8080);