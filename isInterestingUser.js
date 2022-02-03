const { TwitterApi } = require('twitter-api-v2');
const prompt = require("prompt-sync")({ sigint: true });
const {
    histogramToPercentage,
    isInterestingUserBasedOnPercentHistogramOfTweets,
    countUserTweets
} = require('./helpers')

require('dotenv').config()


const client = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
})

async function main() {
    const usernameToLook = prompt("Username to look? (indie_rok)").trim() || "indie_rok";

    const userTimeline = await client.v1.userTimelineByUsername(usernameToLook);

    const TWEET_COUNT = userTimeline.tweets.length;

    const histogram = countUserTweets(userTimeline);

    const histogramInPercentage = histogramToPercentage(TWEET_COUNT, histogram);

    console.log('histogram: ', histogramInPercentage);

    const isInterestingUser = isInterestingUserBasedOnPercentHistogramOfTweets(histogramInPercentage);

    console.log('is interesting user: ',isInterestingUser);

}

main()