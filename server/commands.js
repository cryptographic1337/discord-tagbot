const Sentry = require("@sentry/node");

const database = require('./database');

function handle_error(err, msg, report=true) {
	Sentry.captureException(err);
	console.error(err);
	if (report) msg.reply('there was an unknown error. Sorry about that!')
}

exports.add = function (msg, args) {
	if (args.length === 0) return msg.reply('you must include the keyword you want me to monitor.');

	let count = 0;
	let added_keywords = [];
	let subscribed_keywords = [];
	let failed_keywords = [];

	args.forEach(keyword => {
		database.addKeyword(msg.author.id, keyword, function (err) {
			if (err) {
				if (err === "ERR_USER_ALREADY_SUBSCRIBED") {
					subscribed_keywords.push(keyword);
				} else {
					failed_keywords.push(keyword);
				}
			} else {
				added_keywords.push(keyword);
			}

			add_callback();
		})
	})

	function add_callback() {
		count++;

		if (count === args.length) {
			let message = "";

			if (added_keywords.length > 0) {
				message += "the following keywords have been added:\n";

				added_keywords.forEach(result => {
					message += result + "\n";
				})
			} else {
				message += "no keywords were added.\n";
			}

			message += "\n"


			if (subscribed_keywords.length > 0) {
				message += "You are already subscribed to the following keywords:\n";

				subscribed_keywords.forEach(result => {
					message += result + "\n";
				})

				message += "\n";
			}

			if (failed_keywords.length > 0) {
				message += "The following keywords failed to add:\n";

				failed_keywords.forEach(result => {
					message += result + "\n";
				})
			}

			msg.reply(message);
		}
	}
}

exports.remove = function (msg, args) {
	if (args.length === 0) return msg.reply('you must include the keyword you want me to remove.');

	database.removeKeyword(msg.author.id, args[0], function (err) {
		if (err) {
			if (err === "ERR_USER_NOT_SUBSCRIBED") return msg.reply('you are not subscribed to this keyword.');

			return handle_error(err, msg);
		}

		msg.reply('keyword successfully removed.');
	})
}

exports.list = function (msg) {
	database.getUserKeywords(msg.author.id, function (err, keywords) {
		if (err) return handle_error(err, msg);

		let message = "";

		if (keywords.length > 0) {
			message += "you are subscribed to the following keywords:";
			message += "\n";

			keywords.forEach((result, index) => {
				message += `${index + 1}.) ${result}\n`;
			})
		} else {
			message += "you are not subscribed to any keywords.";
		}

		msg.reply(message);
	})
}

exports.ping = function (msg) {
	const timeTaken = Date.now() - msg.createdTimestamp;
	msg.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
}

exports.handleMessage = function (msg, pingChannel) {
	if (msg.embeds.length === 0) return;

	let titles = [];
	msg.embeds.forEach(result => {
		if (result.title) titles.push(result.title?.toLowerCase());
		if (result.description) titles.push(result.description?.toLowerCase());
	})

	database.getAllKeywords(function (err, keywords) {
		if (err) return handle_error(err, msg);

		keywords.forEach(keyword => {
			console.log(keyword.keyword);
			for (let i = 0; i < titles.length; i++) {
				if (titles[i].includes(keyword.keyword?.toLowerCase()))
					notify_users(keyword.keyword, keyword.users)
			}
		})
	})

	function notify_users(keyword, users) {
		let message = "";
		users.forEach(user => {
			message += '<@' + user + '>\n';
		})

		message += "\n";
		message += `Keyword \`${keyword}\` has been found. Use the link below to jump to the message.\n`;
		message += "\n";
		message += msg.url;

		pingChannel.send(message);
	}
}