const { MessageEmbed } = require("discord.js")
const { readdirSync } = require("fs")
const ms = require("ms")

module.exports.run = (bot, message, args) => {

	const embed = new MessageEmbed()
		.setColor("#2C2F33")
		.setAuthor(`${bot.user.username} Help`, bot.user.displayAvatarURL)
		.setFooter(`Requested by ${message.author.tag} at`, message.author.displayAvatarURL)
		.setTimestamp()
	if (args[0]) {
		let command = args[0]
		let cmd
		if (bot.commands.has(command)) {
			cmd = bot.commands.get(command)
		}
		else if (bot.aliases.has(command)) {
			cmd = bot.commands.get(bot.aliases.get(command))
		}
		if(!cmd) return message.channel.send(embed.setTitle("Invalid Command.").setDescription(`Do \`${bot.config.prefix}help\` for the list of the commands.`))
		command = cmd.info
		try{
			cooldown = ms(ms(command.cooldown), {long:true})
		}catch(error){cooldown = "No Cooldown"}
		embed.setTitle(`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)} command help`)
		embed.setDescription([
			`❯ **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`,
			`❯ **Description:** ${command.description || "No Description provided."}`,
			`❯ **Usage:** ${command.usage ? `\`${bot.config.prefix}${command.name} ${command.usage}\`` : "No Usage"} `,
			`❯ **Aliases:** ${command.aliases ? command.aliases.join(", ") : "None"}`,
            `❯ **Category:** ${command.category}`,
			`❯ **Cooldown:** ${cooldown}`
		].join("\n"))

		return message.channel.send(embed)
	}
	const categories = readdirSync("./commands/")
	embed.setDescription([
		`Available commands for ${bot.user.username}.`,
		`The bot prefix is **${bot.config.prefix}**`,
		"`<>`means needed and `()` it is optional but don't include those",
	].join("\n"))
	categories.forEach(category => {
		const dir = bot.commands.filter(c => c.info.category.toLowerCase() === category.toLowerCase())
		const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)

		try {
			if (dir.size === 0) return
			else if (category !== "Developer") embed.addField(`❯ ${capitalise}`, dir.map(c => `\`${c.info.name}\``).join(", "))
		}
		catch (e) {
			console.log(e)
		}
	})
	return message.channel.send(embed)
}

module.exports.info = {
	name: "help",
	aliases: ["h"],
	description: "Help command to show the commands",
	usgae: "help (command name)",
	category: "About",
}