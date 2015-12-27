var request = require("request");
var cheerio = require("cheerio");

function getChapter(url) {
    return new Promise((resolve, reject) =>
    {
        var chapter =
        {
            title: null,
            link: null,
            desc: null,
            date: null,
            next: null
        };

        request(url, (err, res, body) =>
        {
            if (err) return reject(err);
            var $ = cheerio.load(body);

            if ($('.entry-content').text().length > 100)
            {
                chapter.title = $(".entry-title").text().trim();
                chapter.link = url;
                chapter.desc = $('.entry-content').text().substr(33, 100);
                chapter.date = new Date();
                chapter.next = $('a:contains(Next Chapter)').attr("href");

                resolve(chapter);
            }
            else
            {
                reject(new Error("empty chapter"));
            }
        });
    });
}

function getNewChapters(url, chapters)
{
    chapters = chapters || [];

    return new Promise((resolve, reject) =>
    {
        getChapter(url).then(chapter =>
        {
            console.log("found chapter ", chapter.title);
            chapters.push(chapter);
            getNewChapters(chapter.next, chapters)
            .then(resolve, reject);
        },
        err =>
        {
            console.log(err);
            if (chapters.length > 0)
            {
                resolve(chapters);
            }
            else
            {
                reject(new Error("no chapters"));
            }
        });
    });
}

module.exports = getNewChapters;