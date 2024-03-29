module.exports.run = async (bot, message, args) => {

    embedObject = {embed: {
        title: "Premium",
        thumbnail: {
            url: "https://themystery.s-ul.eu/bot/Ih7eUxcH"
        },
        description: "If you would like to help to keep the bot running.\nFeel free to buy premium [here](https://aub.mysterybots.com/premium)",
        fields: [
            {
                name:"Perks",
                value:"-Colored Server Info Embed\n-Crewmate in your Server Info Embed\n-Role in [Support Server](https://discord.gg/AD2a24y)\n-Premium Support\n-Early previews of updates"
            }
        ],
        url: "https://aub.mysterybots.com/premium",
        color: 0x00ff00
    }}
    message.channel.createMessage(embedObject).catch((error) => {
		if (error.message == "Missing Permissions"){
			message.channel.createMessage("I need `Embed Links` permissions to be able to send this message.")
		}
	})
}

module.exports.info = {
    name: "premium",
    description: "Get a link to get premium",
    category: "Premium",
    aliases:["donate"]
}