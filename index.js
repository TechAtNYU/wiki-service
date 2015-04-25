var request = require('request-promise');
var sys = require('sys')
var exec = require('child_process').exec;

request({
  url: 'https://api.tnyu.org/v2/people',
  rejectUnauthorized: false,
  headers: {
    'x-api-key': process.env.AdminApiKey,
    'accept': 'application/vnd.api+json'
  }
}).then(function(peopleBody) {
  var people = JSON.parse(peopleBody).data;
  people.forEach(generatePassword);
});

var generatePassword = function(user) {
  if (user && user.roles && user.roles.length != 0) {
    var userName = user.name.replace(/\s/g, '');
    var userPass = sha1(sha1(sha1(user.id), sha1(user.facebookId)), sha1(user.created));
    console.log(userName, userPass);
    var commandToDo = "php /var/www/html/maintenance/changePassword.php --user=" + userName + " --password=" + userPass
    exec(commandToDo, puts);
  }
};

function puts(error, stdout, stderr) { sys.puts(stdout) }