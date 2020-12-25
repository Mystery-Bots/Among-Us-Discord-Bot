const Discord = require("eris-additions")(require("eris"))
const { readdirSync } = require("fs");
const { sep } = require("path");
let config = require("./config");
const ms = require("ms");
const moment = require("moment");
const MongoClient = require('mongodb').MongoClient

const client = new MongoClient("mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority", {useUnifiedTopology: true});
client.connect().then(connection => {
	database = connection.db("bot")
	bot.database = database
})


const bot = new Discord.Client(config.discord.token, {
	//intents: 4739,
	intents:4737,
	compress: true,
	maxShards:"auto",
	guildSubscriptions:false,
	messageLimit:0,
	largeThreshold: 0,
	cacheGuilds: false,
	disableEvents: {
		"CHANNEL_CREATE":true,
		"CHANNEL_DELETE":true,
		"CHANNEL_UPDATE":true,
		"GUILD_BAN_ADD":true,
		"GUILD_BAN_REMOVE":true,
		"GUILD_MEMBER_ADD":true,
		"GUILD_MEMBER_REMOVE":true,
		"GUILD_MEMBER_UPDATE":true,
		'GUILD_ROLE_CREATE':true,
		'GUILD_ROLE_DELETE':true,
		'GUILD_ROLE_UPDATE':true,
		'GUILD_UPDATE':true,
		'MESSAGE_DELETE':true,
		'MESSAGE_DELETE_BULK':true,
		'MESSAGE_UPDATE':true,
		'PRESENCE_UPDATE':true,
		'TYPING_START':true,
		'USER_UPDATE':true
	},
});

bot.config = config.discord;

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
				if (pull.info.disabled){}
				// get more info about command for help command
				else{bot.commands.set(pull.info.name, pull);}
				//console.log(`Loaded command ${pull.info.name}.`);
			} else {
				console.log(
					`Error loading command in ${dirs}/${file} you have a missing info.name or info.name is not a string. or you have a missing info.category or info.category is not a string`
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
	.on("error",console.error)
	.on("warn", console.warn)
	.on("ready", () => {		
		require("./discordEvents/ready").Run(bot);
	})
	.on("disconnect", () => {
		console.warn(`${moment(Date.now()).format("hh/mm A, DD/MM/YYYY")}: Disconnected!`);
	})
	.on("reconnecting", () => {
		console.warn(
			`${moment(Date.now()).format("hh/mm A, DD/MM/YYYY")}: Reconnecting...`
		);
	})
	.on("messageCreate", (message) => {
		require('./discordEvents/message').Run(bot, message)
	})
	.on("guildCreate", async () => {
		let collection = bot.database.collection("info");
        let filter = { _id: "5f6c5183784bc0b5904a1b9d" };
        await collection.updateOne(filter, {$inc:{'servers':1}});
	})
	.on("guildDelete", async () => {
		let collection = bot.database.collection("info");
        let filter = { _id: "5f6c5183784bc0b5904a1b9d" };
        await collection.updateOne(filter, {$inc:{'servers':-1}});
	})


setTimeout(async() => {
	bot.connect()
	bot.editStatus("invisible");
	require('./services/prefixFetch').Run(bot)
}, 5*1000);
