var SlackBot = require('slackbots');

var botName = process.env.BOT_NAME;
var slackToken = process.env.BOT_TOKEN;

var bot = new SlackBot({
  token : slackToken,
  name  : botName
});

bot.on('message', function(data) {
  console.log(data);
})
