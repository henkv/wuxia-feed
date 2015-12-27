var express = require("express");
var Database = require("./Database.js");
var rss = require("./rss.js");

var app = express();

app.get('/rss/:id', (req, res) =>
{
    Database.getFeed(req.params.id)
    .then(feed =>
    {
        if (feed !== null)
        {
            return feed.update()
            .then(feed => feed.getItems({order: [["date", "DESC"]]}))
            .then(items =>
            {
                res.set('Content-Type', 'application/rss+xml');
                res.send(rss(feed, items));
            });
        }
        else
        {
            res.sendStatus(404);
        }
    })
    .catch(err =>
    {
        throw err;
    });
});

app.use(express.static("client"));
app.use("*", express.static("client/index.html"));

Database.init().then(() =>
{
    app.listen(process.env.PORT || 8080);
    console.log("Server running on", process.env.PORT || 8080);
});