var request = require("request");
var cheerio = require("cheerio");

var Chapter = function(url) {
    this.url_ = url;
    this.next_ = null;
    this.data_ = {
        title: null,
        link: null,
        date: null,
        guid: null
    };
};

Chapter.prototype.get = function() {
    console.log("Get chapter info");

    return new Promise((resolve, reject) =>
    {
        console.log("Chapter data requested");
        request(this.url_, (err, res, body) =>
        {
            if (err) return reject(err);
            console.log("Chapter data found");

            var $ = cheerio.load(body);

            if ($('.entry-content').text().length > 100)
            {
                console.log("Chapter has content", this.url_);

                this.data_.title = $(".entry-title").text().replace(/\W+/g, ' ');
                this.data_.link = this.url_;
                this.data_.guid = this.data_.title.replace(/\W/g, '');
                this.data_.date = new Date();
                this.next_ = $('a:contains(Next Chapter)').attr("href");
                resolve(this);
            }
            else
            {
                console.log("Chapter is empty");
                reject(this.url_);
            }
        });
    });
};

Chapter.prototype.xml = function() {
    return [
        `<item>`,
        `<title>${this.data_.title}</title>`,
        `<link>${this.data_.link}</link>`,
        `<description>${this.data_.description}</description>`,
        `<guid isPermaLink="false">${this.data_.guid}</guid>`,
        `</item>`
    ].join('\n');
};

module.exports = Chapter;