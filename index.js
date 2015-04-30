'use strict';

var request = require('request-promise');
var sys = require('sys');
var exec = require('child_process').exec;

var puts = function(error, stdout, stderr) {
	if (stderr) {
		sys.puts(stderr);
		return;
	}
	sys.puts(stdout);
};

var shaGenerate = function(user) {
	return sha1(sha1(sha1(user.id), sha1(user.facebookId)), sha1(user.created));
};

var generatePassword = function(user) {
	if (user && user.roles && user.roles.length !== 0) {
		var userName = user.name.replace(/\s/g, '');
		var userPass = shaGenerate(user);
		var commandToDo = '--user=' + userName + ' --password=' + userPass;
		exec('php /var/www/html/maintenance/changePassword.php ' + commandToDo, puts);
	}
};

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
