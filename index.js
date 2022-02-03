const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs')
const json2html = require('node-json2html');
const prompt = require("prompt-sync")({ sigint: true });
const open = require('open');
const moment = require('moment');

// config for libraries
moment.suppressDeprecationWarnings = true;
require('dotenv').config()

const client = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
});

function unixToJsDate(unixTimeStamp) {
    return unixTimeStamp * 1000
}

function createHTML(username, users) {
    let template = {
        '<>': 'li', 'html': [
            { '<>': 'a', "href": 'http://twitter.com/${screen_name}', "target": "_blank", 'html': '${screen_name} (${followers_count})' }
        ]
    };

    let html = json2html.render(users, template);

    const fileRoute = `./reports/report-${username}.html`

    fs.writeFile(fileRoute, html, async () => {
        console.log('HTML CREATED');
        await open(fileRoute)
    })

}


async function main() {

    try {
        const usernameToLook = prompt("Username to look? (indie_rok)").trim() || "indie_rok";

        const user = await client.v1.user({ screen_name: usernameToLook })

        console.log('---parsing---', user.name);

        const following = await client.v2.following(user.id, { asPaginator: true })

        while (!following.done) {
            await following.fetchNext();
        }

        let interestingUsers = []

        let ids = following.users.map(({ id }) => id);

        for (id of ids) {
            console.log('parsing user id...', id);
            const user = await client.v1.user({ user_id: id })
            if (
                user.followers_count >= 300 && 
                user.followers_count <= 2000 && 
                moment(user?.status?.created_at).diff(moment(), 'months') >= -1 
                && user?.status?.lang === "en"
            ) {
                interestingUsers.push({ screen_name: user.screen_name, followers_count: user.followers_count })
            }
        }

        createHTML(usernameToLook, interestingUsers)
    }
    catch (err) {
        switch (err.code) {
            case 429:
                console.log("Request limit done, next batch available", new Date(unixToJsDate(err.rateLimit.reset)).toGMTString())
                break;

            default:
                console.log(err);
                break;
        }
    }
}


main()

