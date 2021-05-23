const rp = require('request-promise');
const $ = require('cheerio');

const getRelatedArticleDetails = (url) => {
    return new Promise(resolve => rp(url)
        .then((html) => {
            let relatedArticleUrls = [];
            for (let i = 0; i < 5; i++) {
                relatedArticleUrls.push($('.panel-items-list a', html)[i].attribs.href)
            };

            let relatedArticleTitles = [];
            let arr = $('.item-title', html).toArray().map((x) => { return $(x).text()});
            for (let i = 0; i < 5; i++) {
                relatedArticleTitles.push(arr[i])
            }
            
            let [keys, values] = [
                relatedArticleUrls,
                relatedArticleTitles
            ]

            let mappedRelatedArticleDetails = keys.map((k, i) => ({ url: k, title: values[i]}));
            
            resolve(mappedRelatedArticleDetails)
        })
        .catch((err) => {
            console.log(err)
        }))
        
}

const article = async (url) => {

    const mappedRelatedArticleDetails = await getRelatedArticleDetails(url)

    return rp(url)
        .then((html) => {
            return {
                articles: [{
                    url: url,
                    title: $('.post-title', html).text().replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,""),
                    author: $('.author-name', html).text().replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"").replace('\n',""),
                    postingDate: $('.post-date', html).text().replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"").replace('\n',""),
                    relatedArticles: mappedRelatedArticleDetails
                }]
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

module.exports = article