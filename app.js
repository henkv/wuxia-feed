var express = require("express");
var cheerio = require("cheerio");
var request = require("request");
var fs = require("fs");

function getChapter(url)
{
    return new Promise((resolve, reject) =>
    {
        var chapter =
        {
            title: undefined,
            link: undefined,
            date: undefined,
            guid: undefined,
            next: undefined
        };

        request(url, (err, res, body) => {
            $ = cheerio.load(body);

            if ($('.entry-content').text().length > 0)
            {
                chapter.title = $(".entry-title").text().replace(/\W+/g, ' ');
                chapter.link = url;
                chapter.guid = chapter.title.replace(/\W/g, '');
                chapter.date = new Date();
                chapter.next = $('a:contains(Next Chapter)').attr("href");
                resolve(chapter);
            }
            else
            {
                reject("no content");
            }
        });
    });
}



function getChapterRecursive(url, chapters)
{
    return new Promise((resolve, reject) =>
    {
        getChapter(url).then(chapter =>
        {
            chapters.push(chapter);

            if (chapter.next)
            {
                getChapterRecursive(chapter.next, chapters).then(resolve);
            }
        }, err =>
        {
            if (chapters.length > 0)
            {
                resolve(chapters);
            }
            else
            {
                reject("no chapters");
            }
        });
    });
}

function feed (data)
{
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${data.title || ""}</title>
        <description>${data.description || ""}</description>
        <link>${data.link || ""}</link>
    ${data.items.map(item).join('\n')}
    </channel>
</rss>`;
}
function item (data)
{
    return `    <item>
        <title>${data.title || ""}</title>
        <link>${data.link || ""}</link>
        <description>${data.description || ""}</description>
        <guid isPermaLink="false">${data.guid}</guid>
    </item>`;
};

var app = express();

app.get("/:id", (req, res) =>
{
    fs.readFile(req.params.id + ".json", "utf8", (err, data) =>
    {
        if (err)
        {
            res.sendStatus(404);
        }
        else
        {
            data = JSON.parse(data);
            res.set('Content-Type', 'application/rss+xml');
            getChapterRecursive(data.next, data.items).then(
            (chapters) =>
            {
                data.next = chapters[chapters.length - 1].next;
                data.feed = feed(data);
                res.send(new Buffer(data.feed));

                // fs.writeFile(req.params.id + ".json", JSON.stringify(data), (err) =>
                // {
                //     if (err) throw err;
                // });
            },
            (err) =>
            {
                console.log(err, 0);
                res.send(new Buffer(data.feed || ""));
                res.end();
            });
        }
    });
});

app.listen(8008);