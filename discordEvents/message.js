const ms = require("ms")
const Discord = require("eris")

const cooldowns = new Discord.Collection()

messageCount = 0

module.exports.Run = async function(bot,message){
	var prefix = bot.config.prefix
	var args = message.content.slice(prefix.length).trim().split(/ +/g)
	const cmd = args.shift().toLowerCase()
	let command
	if (!message.content.startsWith(prefix) || message.author.bot) return

	if (cmd.length === 0) return
	if (bot.commands.has(cmd)) command = bot.commands.get(cmd)
	else if (bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd))
	
	//Check if a command is being run.
	if (!command) return

	//For command info like command description.
	info = command.info

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
		setTimeout(message.delete(),2000)
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
			setTimeout(message.delete(),2000)
			return message.channel.createMessage(`please wait ${ms(timeLeft, {long:true})} before reusing the \`${info.name}\` command.`).then(msg => setTimeout(msg.delete(),5000))
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
					name:"Guild",
					value:guild.name,
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