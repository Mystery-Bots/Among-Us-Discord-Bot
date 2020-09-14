const ms = require("ms")
const Discord = require("discord.js")

const cooldowns = new Discord.Collection()

module.exports.Run = async function(bot,message){
	var prefix = bot.config.prefix
	const args = message.content.slice(prefix.length).trim().split(/ +/g)
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
	if (info.GuildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!').then(msg => msg.delete({timeout:5000}))
	}

	//Check if args are required.
	if (info.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`

		if (info.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${info.name} ${info.usage}\``
		}
		message.delete({timeout:2000})
		return message.channel.send(reply).then(msg => msg.delete({timeout:5000}))
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
			message.delete({timeout:2000})
			return message.reply(`please wait ${ms(timeLeft, {long:true})} before reusing the \`${info.name}\` command.`).then(msg => msg.delete({timeout:5000}))
		}
	}

	timestamps.set(message.author.id, now)
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

	try {
		//Run command.
		await command.run(bot, message, args)
		
	} catch (error) {
		//Get errors and log them and tell the user.
		message.delete({timeout:2000})		
		var embed = new Discord.MessageEmbed()
			.setTitle("ERROR")
			.setDescription(`${error.name}\n${error.message}`)
			.setColor("#ff0000")
			.setTimestamp()
		message.channel.send(embed)
		console.error(error)    
	}
}