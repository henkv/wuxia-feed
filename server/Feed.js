var fs = require("fs");
var Chapter = require("./Chapter");

var Feed = function(filePath) {
    this.filePath_ = filePath;
    this.data_ = {
        title: "null",
        description: "null",
        link: "null",
        items: [],
        next: "null"
    };
    console.log("Feed constructed");
};

Feed.prototype.load = function() {
    console.log("Loading feed");

    return new Promise((resolve, reject) =>
    {
        console.log("Reading feed file");
        fs.readFile(this.filePath_, "utf8", (err, data) =>
        {
            console.log(err);
            if (err) return resolve(this);

            console.log("Parsing feed data");
            this.data_ = JSON.parse(data);
            resolve(this);
        });
    });
};

Feed.prototype.save = function()
{
    console.log("Saving feed");
    return new Promise((resolve, reject) =>
    {
        fs.writeFile(this.filePath_,
                     JSON.stringify(this.data_),
                     "utf8",
                     (err) =>
        {
            if (err) return reject(err);
            resolve(this);
        });
    });
}

Feed.prototype.addItem = function(item)
{
    this.data_.unshift(item);
};

Feed.prototype.xml = function()
{
    console.log("Exporting feed xml");

    return [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
        `<channel>`,
        `<title>${this.data_.title || ""}</title>`,
        `<description>${this.data_.description || ""}</description>`,
        `<link>${this.data_.link || ""}</link>`,
        `${this.data_.items.sort().join('')}`,
        `</channel>`,
        `</rss>`
    ].join('\n');
};

function getRecursive(url, items) {
    console.log("Recursive update feed");

    return new Promise((resolve, reject) =>
    {
        console.log("> Recursive update start");
        var chapter = new Chapter(url);
        chapter.get().then((self) =>
        {
            console.log("> Recursive update next");
            items.push(self.xml());

            getRecursive(self.next_, items)
            .then(resolve, console.log);
        },
        (next) =>
        {
            console.log("> Recursive update ended");
            resolve(next);
        });
    });
}

Feed.prototype.update = function() {
    console.log("Updating feed");

    return new Promise((resolve, reject) =>
    {
        var next = new Chapter(this.data_.next);

        next.get().then((self) =>
        {
            console.log("New chapter");
            getRecursive(self.next_, this.data_.items)
            .then((next) =>
            {
                this.data_.next = next;
                console.log(next);
                resolve(this);
            });
        },
        () =>
        {
            console.log("No chapter");
            resolve(this);
        });
    });
};

module.exports = Feed;