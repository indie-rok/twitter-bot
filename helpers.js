const moment = require('moment');
moment.suppressDeprecationWarnings = true;


function countUserTweets(timeline) {
    let histogramByUser = { createdInThisMonth: 0, langEn: 0, retweetCount: 0, favoriteCount: 0 }

    timeline.tweets.forEach(({ created_at, lang, retweeted, favorite_count }) => {
        if (moment(created_at).diff(moment(), 'months') >= -1) {
            histogramByUser.createdInThisMonth += 1
        }

        if (lang === "en") {
            histogramByUser.langEn += 1
        }

        if (retweeted) {
            histogramByUser.retweetCount += 1
        }

        if (favorite_count > 0) {
            histogramByUser.favoriteCount += 1
        }
    })

    return histogramByUser
}

function isInterestingUserBasedOnPercentHistogramOfTweets(histogram) {
    const TARGET_CREATED_THIS_MONTH = 80;
    const TARGET_LANG_ENG = 80;
    const TARGET_RETWEETED = 10; // less than
    const TARGET_FAVORITE = 15;

    if (
        histogram.createdInThisMonth >= TARGET_CREATED_THIS_MONTH &&
        histogram.langEn >= TARGET_LANG_ENG &&
        histogram.retweetCount <= TARGET_RETWEETED &&
        histogram.favoriteCount >= TARGET_FAVORITE
    ) {
        return true
    }
    return false
}

function histogramToPercentage(tweetCount, histogram) {
    Object.keys(histogram).forEach((key) => { histogram[key] = (histogram[key] / tweetCount) * 100 })

    return histogram;
}

module.exports = {
    histogramToPercentage,
    isInterestingUserBasedOnPercentHistogramOfTweets,
    countUserTweets
}