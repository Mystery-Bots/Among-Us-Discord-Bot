const Discord = require("eris");
const { readdirSync } = require("fs");
const { sep } = require("path");
let config = require("./config");
const ms = require("ms");
const moment = require("moment");
const MongoClient = require('mongodb').MongoClient

/* const client = new MongoClient("mongodb+srv://among-us-bot:password@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority", {useUnifiedTopology: true});
client.connect().then(connection => {
	database = connection.db("bot")
	bot.connection = connection
}) */


const bot = new Discord.Client(config.discord.token, {
	//intents: 4739,
	intents:4737,
	compress: true,
	maxShards:"auto",
	guildSubscriptions:false,
	messageLimit:0,
	largeThreshold: 0,
	disableEvents: [
		"CHANNEL_CREATE",
		"CHANNEL_DELETE",
		"CHANNEL_UPDATE",
		"GUILD_BAN_ADD",
		"GUILD_BAN_REMOVE",
		"GUILD_CREATE",
		"GUILD_MEMBER_ADD",
		"GUILD_MEMBER_REMOVE",
		"GUILD_MEMBER_UPDATE",
		'GUILD_ROLE_CREATE',
		'GUILD_ROLE_DELETE',
		'GUILD_ROLE_UPDATE',
		'GUILD_UPDATE',
		'MESSAGE_DELETE',
		'MESSAGE_DELETE_BULK',
		'MESSAGE_UPDATE',
		'PRESENCE_UPDATE',
		'TYPING_START',
		'USER_UPDATE'
	],
});

bot.config = config.discord;
//bot.database = config.database;

// Message stuff
const cooldowns = new Discord.Collection()

let Servers = {
    "755128953202671628":"?",
    "760667508167409714":"~",
    "570900369102602240":"."
}

async function getPrefix(guild){
	prefixes = Servers
	if (!guild) return null
	guildID = guild.id
	if (!prefixes){
		return null
	}
	if (!prefixes[guildID]){
		return null
	}else{
		return prefixes[guildID]
	}
}

// Message Event Function
async function onMessage(bot, message){
	var prefixes = bot.config.prefix
	prefixes.push(await getPrefix(message.channel.guild))
	let prefix = false;
	for(const thisPrefix of prefixes) {
		if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
	}
	if(!prefix) return;
	var args = message.content.slice(prefix.length).trim().split(/ +/g)
	const cmd = args.shift().toLowerCase()
	let command

	//Check if starts with prefix
	if (!message.content.startsWith(prefix) || message.author == bot.user) return

	if (cmd.length === 0) return
	if (bot.commands.has(cmd)) command = bot.commands.get(cmd)
	else if (bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd))
	
	//Check if a command is being run.
	if (!command) return

	//Check to see if bot is offline and if owner not running command
	if (bot.presence.status == "invisible" && !bot.config.devs.includes(message.author.id)) return

	//Check dev mode and if owner not running command
	if (bot.presence.status == "dnd" && !bot.config.devs.includes(message.author.id)) return

	//For command info like command description.
	info = command.info

	//Check to see if command is disabled
	if(info.disabled){
		return message.channel.createMessage('This command is disabled currently. Join the support server for more info')
	}

	//Check if command is webhook only
	if (info.WebhookOnly && !message.webhookID) {
		return message.channel.createMessage('This is a command for webhooks only')
	}
	
	if (!info.WebhookOnly && message.author.bot) return

	//Check if command is GuildOnly.
	if (info.GuildOnly && !message.channel.guild) {
		return message.channel.createMessage('I can\'t execute that command inside DMs!')
	}

	//Check if args are required.
	if (info.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`

		if (info.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${info.name} ${info.usage}\``
		}
		return message.channel.createMessage(reply)
	}
	//Command cooldowns
	if (!cooldowns.has(info.name)) {
		cooldowns.set(info.name, new Discord.Collection())
	}

	const now = Date.now()
	const timestamps = cooldowns.get(info.name)
	const cooldownAmount = ms(info.cooldown || 0) //info.cooldown * 1000

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now)
			return message.channel.createMessage(`please wait ${ms(timeLeft, {long:true})} before reusing the \`${info.name}\` command.`)
		}
	}

	timestamps.set(message.author.id, now)
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

	try {
		//Run command.
		await command.run(bot, message, args)
		
	} catch (error) {
		//Get errors and log them and tell the user.
		channel = await bot.getChannel("755883889876140062")
		if(args.length < 1) args = ["None"]
		guild = message.channel.guild
		timestring = new Date
		var embedObject = {embed: {
			title:"ERROR",
			description:`${error.name}\n${error.message}`,
			color:0xff0000,
			timestamp: timestring.toISOString(),
			fields:[
				{
					name:"Guild/DM",
					value:guild.name ? guild.name : `${message.author.username}'s DMS`,
					inline:true
				},
				{
					name:"Runner",
					value:message.author.username,
					inline:true
				},
				{
					name:"Command",
					value:info.name,
					inline:true
				},
				{
					name:"Arguments",
					value:args.join(" "),
					inline:true
				}
			]
		}}
		console.log(error)
		channel.createMessage(embedObject)
		message.channel.createMessage("There was an error. A message has been sent to the TheMystery to alert them of this problem.\nIf this continues to happen please join the Support Server")   
	}
}


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
	.on("error",console.error)
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
	.on("messageCreate", (message) => {
		onMessage(bot, message)
	})

setTimeout(() => {
	bot.connect()
	//require('./services/prefixFetch').Run(database)
}, 5*1000);
