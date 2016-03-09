var Slack     = require('slack-api').promisify();
var Botkit    = require('botkit');
var github    = require('octonode');

var botName = process.env.BOT_NAME;
var slackToken = process.env.BOT_TOKEN;
var githubToken = process.env.GITHUB_TOKEN;
var githubRepository = process.env.GITHUB_REPO;

var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: slackToken
});

bot.startRTM(function(err, bot, payload) {
  if (err) {
    throw new Error("Error connecting to slack!");
  }
});

controller.hears(["keyword","^.+$"], ["direct_mention", "mention"], function(bot, message) {
  console.log("Bot was mentioned!");

  // Get the info from the user who mentioned
  Slack.users.info({
    "token": slackToken,
    "user": message.user
  }).then(function(data) {
    if (data.ok != true) {
      console.log(err);
      bot.reply(message, "Who the hell are you?!");
      return;
    }
    user = data.user.name;
    return user;
  }).then(function(user) {
    // Convert additional mentions to usernames
    // This sucks because it is sent asynchronously and returns too late. Should fix

    // var regex = new RegExp('<@([A-Z0-9]+)>', 'g');
    // var text = message.text.replace(regex, function(m,c) {
    //   Slack.users.info({
    //     "token": slackToken,
    //     "user": c
    //   }, function(err,data) {
    //     if (err || data.ok != true) {
    //       return "unknown user";
    //     }
    //     return (data.user.name !== botName) ? data.user.name : "";
    //   });
    // });

    var regex = new RegExp('<@([A-Z0-9]+)>', 'g');
    var text = message.text.replace(regex, "");

    // Create Github issue!
    var client = github.client(githubToken);

    client.repo(githubRepository).issue({
      title: text,
      body: "Toegevoegd door " + user,
      labels: ['slack']
    }, function(err, data, headers) {
      if (err) {
        console.log(err, data);
        bot.reply(message, "Er is iets misgegaan bij Github, wat stom.");
      } else {
        bot.reply(message, "Oehoe! Goed idee, " + user + ", we gaan het voor je fixen!");
      }
    });
  }).catch(function(e) {
    console.log("An error occured: " + e);
  });
});
