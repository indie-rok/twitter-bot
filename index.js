const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config()

const client = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
});

client.v2.singleTweet('1486357893385531397', {
    'tweet.fields': [
        'organic_metrics',
     ],
  }).then((val) => {
    console.log(val)
}).catch((err) => {
    console.log(err)
})
