const Discord = require("discord.js");
const { readdirSync } = require("fs");
const { sep } = require("path");
let config = require("./config");
const ms = require("ms");
const moment = require("moment");

const bot = new Discord.Client({
	messageCacheLifetime:ms('3m'),
	messageSweepInterval:ms('3m')
});

bot.config = config.discord;
bot.database = config.database;

// Creating command and aliases collection.
["commands", "aliases"].forEach((x) => (bot[x] = new Discord.Collection()));

const load = (dir = "./commands/") => {
	readdirSync(dir).forEach((dirs) => {
		// sub folder check
		const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter((files) =>
			files.endsWith(".js")
		);
		// get all files in sub folder
		for (const file of commands) {
			// put all commands in collection
			const pull = require(`${dir}/${dirs}/${file}`);
			// check to see if command exists
			if (
				pull.info &&
				typeof pull.info.name === "string" &&
				typeof pull.info.category === "string"
			) {
				if (bot.commands.get(pull.info.name))
					return console.warn(
						`Two or more commands have the same name ${pull.info.name}.`
					);
				// get more info about command for help command
				bot.commands.set(pull.info.name, pull);
			} else {
				console.log(
					`Error loading command in ${dir}${dirs}.${file} you have a missing info.name or info.name is not a string. or you have a missing info.category or info.category is not a string`
				);
				continue;
			}
			// command aliases
			if (pull.info.aliases && typeof pull.info.aliases === "object") {
				pull.info.aliases.forEach((alias) => {
					// check for conflict with other commands
					if (bot.aliases.get(alias))
						return console.warn(
							`Two commands or more commands have the same aliases ${alias}`
						);
					bot.aliases.set(alias, pull.info.name);
				});
			}
		}
	});
};
load();

bot
	.on("error", (error) => {
		require("./discordEvents/error").Run(bot, error);
	})
	.on("warn", console.warn)
	.on("ready", () => {
		require("./discordEvents/ready").Run(bot);
	})
	.on("disconnect", () => {
		console.warn("Disconnected!");
	})
	.on("reconnecting", () => {
		console.warn(
			`${moment(Date.now()).format("hh/mm A, DD/MM/YYYY")}: Reconnecting...`
		);
	})
	.on("message", (message) => {
		require("./discordEvents/message").Run(bot, message);
	});

bot.login(config.discord.token).catch(console.error());
