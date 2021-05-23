const rp = require('request-promise');
const $ = require('cheerio');
const article = require('./article')
const url = 'https://www.cermati.com/artikel';
const fs = require('fs')

rp(url)
    .then((html) => {
        const articleUrls = [];
        for (let i = 0; i < 12; i++) {
            articleUrls.push($('.article-list-item a', html)[i].attribs.href)
        }
        return Promise.all(
            articleUrls.map((url) => {
                return article('https://www.cermati.com' + url);
            })
        )
    })
    .then((allArticles) => {
        fs.writeFile('./solution.json', JSON.stringify(allArticles), err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    })
    .catch((err) => console.log(err))