var request = require("request");
var cheerio = require("cheerio");
var Sequelize = require("sequelize");

var henkDb = "postgres://eziyrhvoarrive:pDapG7ngaevqZm60CHduunN58K@ec2-54-195-252-202.eu-west-1.compute.amazonaws.com:5432/d5bm3f4pu9i6ns";
var debugDb = "sqlite://:@db.sqlite";
var sequelize = new Sequelize(debugDb, {define: { timestamps: false }});

var Feed = sequelize.define('feed',
{
    id:    { type: Sequelize.STRING, primaryKey: true },
    title: { type: Sequelize.STRING },
    desc:  { type: Sequelize.STRING },
    link:  { type: Sequelize.STRING, validate: { isUrl: true }},
    next:  { type: Sequelize.STRING, validate: { isUrl: true }}
},
{
    instanceMethods:
    {
        getNext()
        {
            return new Promise((resolve, reject) =>
            {
                var link = this.getDataValue("next");
                request(link, (err, res, body) =>
                {
                    if (err) return reject(err);
                    var $ = cheerio.load(body);

                    if ($('.entry-content').text().length > 100)
                    {
                        this.set("next", $('a:contains(Next Chapter)').attr("href"));
                        this.createItem(
                        {
                            link: link,
                            title: $(".entry-title").text().trim(),
                            desc: $('.entry-content').text()
                                .substr(33).match(/^(.*)\n?/)[1],
                            date: new Date(),
                        })
                        .then(() => this.save())
                        .then(resolve)
                        .catch(err => { throw err; });
                    }
                    else
                    {
                        reject(new Error("empty chapter"));
                    }
                });
            });
        },
        update()
        {
            return new Promise((resolve, reject) =>
            {
                this.getNext()
                .then(() => this.update(), () => resolve(this))
                .then(() => resolve(this));
            });
        }
    }
});

var Item = sequelize.define('item',
{
    link:  { type: Sequelize.STRING, primaryKey: true, validate: { isUrl: true }},
    title: { type: Sequelize.STRING, allowNull: false },
    desc:  { type: Sequelize.STRING, defaultValue: '' },
    date:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

Feed.hasMany(Item);

function getFeeds()
{
    return Feed.findAll();
}

function getFeed(id)
{
    return Feed.findById(id);
}

function newFeed(id, title, desc, link, next)
{
    return Feed.create({ id, title, desc, link, next });
}

function init()
{
    return Promise.all(
    [
        Feed.sync({force: true}),
        Item.sync({force: true})
    ])
    .then(() =>
    {
        return Feed.create(
        {
            id: 'tdg',
            title: 'Tales of Demons and Gods',
            desc: 'Wuxiaworld Novel',
            link: 'http://www.wuxiaworld.com/tdg-index/',
            next: 'http://www.wuxiaworld.com/tdg-index/tdg-chapter-181'
        })
        .then(() => Feed.create(
        {
            id: 'mga',
            title: 'Martial God Asura',
            desc: 'Wuxiaworld Novel',
            link: 'http://www.wuxiaworld.com/mga-index/',
            next: 'http://www.wuxiaworld.com/mga-index/mga-chapter-589/'
        }));
    });
}

module.exports = {init, getFeeds, getFeed, newFeed};