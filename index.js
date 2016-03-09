var github    = require('octonode');
var express   = require('express');
var app       = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
}));

var slackToken = process.env.SLACK_TOKEN;
var githubToken = process.env.GITHUB_TOKEN;
var githubRepository = process.env.GITHUB_REPO;

var port = process.env.PORT || 80;

app.post('/', function(req, res) {
  console.log(req);
  if (req.body.token !== slackToken) {
    return res.status(403).end();
  } else {
    var client = github.client(githubToken);
    client.repo(githubRepository).issue({
      title: req.body.text,
      body: "Added by " + req.body.user_name,
      labels: ['slack']
    }, function(err, data, headers) {
      if (err) {
        console.log(err, data);
        return res.status(500).end();
      } else {
        return res.status(200).json({
          text: "Oehoe! Goed idee, " + req.body.user_name + ", we gaan het voor je fixen!"
        });
      }
    });
  }
});

app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});
