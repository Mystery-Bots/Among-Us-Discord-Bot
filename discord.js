const Discord = require("eris-additions")(require("eris"));
const Base = require("eris-sharder").Base;
const { readdirSync } = require("fs");
const { sep } = require("path");
let config = require("./config");
const ms = require("ms");
const moment = require("moment");
const MongoClient = require("mongodb").MongoClient;

class Class extends Base {
	constructor(bot) {
		
		super(bot);

		const client = new MongoClient(
			"mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority", // Invalid
			{ useUnifiedTopology: true }
		);
		client.connect().then((connection) => {
			let database = connection.db("bot");
			this.bot.database = database;
			require("./discordEvents/ready").Run(this.bot);
			this.bot.editStatus("invisible");
		});
	
	}
	launch() {

		this.bot.config = config.discord;

		// Creating command and aliases collection.
		["commands", "aliases"].forEach((x) => (this.bot[x] = new Discord.Collection()));

		const load = (dir = "./commands/") => {
			readdirSync(dir).forEach((dirs) => {
				// sub folder check
				const commands = readdirSync(
					`${dir}${sep}${dirs}${sep}`
				).filter((files) => files.endsWith(".js"));
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
						if (this.bot.commands.get(pull.info.name))
							return console.warn(
								`Two or more commands have the same name ${pull.info.name}.`
							);
						if (pull.info.disabled) {
						}
						// get more info about command for help command
						else {
							this.bot.commands.set(pull.info.name, pull);
						}
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
							if (this.bot.aliases.get(alias))
								return console.warn(
									`Two commands or more commands have the same aliases ${alias}`
								);
							this.bot.aliases.set(alias, pull.info.name);
						});
					}
				}
			});
		};
		load();

		this.bot.on("error", console.error)
		this.bot.on("warn", console.warn)
		this.bot.on("disconnect", () => {
				console.warn(
					`${moment(Date.now()).format("hh/mm A, DD/MM/YYYY")}: Disconnected!`
				);
			})
		this.bot.on("reconnecting", () => {
				console.warn(
					`${moment(Date.now()).format("hh/mm A, DD/MM/YYYY")}: Reconnecting...`
				);
			})
		this.bot.on("messageCreate", (message) => {
				require("./discordEvents/message").Run(this.bot, message);
			})
		this.bot.on("guildCreate", async () => {
				let collection = this.bot.database.collection("info");
				let filter = { _id: "5f6c5183784bc0b5904a1b9d" };
				await collection.updateOne(filter, { $inc: { servers: 1 } });
			})
		this.bot.on("guildDelete", async () => {
				let collection = this.bot.database.collection("info");
				let filter = { _id: "5f6c5183784bc0b5904a1b9d" };
				await collection.updateOne(filter, { $inc: { servers: -1 } });
			});

		setTimeout(async () => {
			require("./services/prefixFetch").Run(this.bot);
		}, 5 * 1000);

	}
}

module.exports = Class;
