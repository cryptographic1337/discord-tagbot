require('dotenv').config();

const Discord = require("discord.js");
const Sentry = require("@sentry/node");

const commands = require('./commands');

const client = new Discord.Client();

if (process.env.NODE_ENV === "production") Sentry.init({dsn: process.env.SENTRY_DSN});

client.on('ready', () => {
	console.log("Discord bot ready");

	client.user.setPresence({
		status: "online",
		game: {
			name: "Developed by cryptographic#1337",
			type: "PLAYING"
		}
	})
})


client.on("message", function (msg) {
	if (!msg.content.startsWith(process.env.PREFIX)) {
		commands.handleMessage(msg, (user) => client.users.fetch(user));
	} else {
		const commandBody = msg.content.slice(process.env.PREFIX.length).replace(' ', '');
		const args = commandBody.split(' ');
		const command = args.shift().toLowerCase();

		if (command === "add") return commands.add(msg, args);
		if (command === "remove") return commands.remove(msg, args);
		if (command === "list") return commands.list(msg);
		if (command === "ping") return commands.ping(msg);
	}
})

client.login(process.env.TOKEN);