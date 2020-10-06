const moment = require("moment")
const mariadb  = require("mariadb")

const embedColor = [
    0x3e474e, //Black 0
    0xf6f656, //Yellow 1
    0xd8e1f2, //White 2
    0xc51110, //Red 3
    0x6c2fbb, //Purple 4
    0xef54bc, //Pink 5
    0xf17d0e, //Orange 6
    0x50f038, //Lime 7
    0x10802c, //Green 8
    0x38e3dd, //Cyan 9
    0x70491e, //Brown 10
    0x132ed3, //Blue 11
    0x7289DA //Blurple 12 (Official Servers Only)
]

const guildIcons = {
    "official": "<:aub:756022955414126602>",
    "partner": "<:crewmates:756043466886086676>",
    "innersloth":"<:innersloth:760986640616521758>",
    "colors":[
        "<:crewmate_black:756037185576108083>", //0
        "<:crewmate_yellow:756036948535017542>", //1
        "<:crewmate_white:756037159672348792>", //2
        "<:crewmate_red:756036857006915665>", //3
        "<:crewmate_purple:756037126709182485>", //4
        "<:crewmate_pink:756037448810889226>", //5
        "<:crewmate_orange:756036915404210277>", //6
        "<:crewmate_limegreen:756036983280631839>", //7
        "<:crewmate_green:756037021092413471>", //8
        "<:crewmate_cyan:756037049940967495>", //9
        "<:crewmate_brown:756037630696751126>", //10
        "<:crewmate_blue:756037090143109130>" //11
    ]
}

async function getChannels(guild) {
    let text = 0
    let voice = 0
    for ([channelID, channel] of guild.channels){
        if (channel.type == 0) text ++
        if (channel.type == 2) voice ++
    }
    return [text, voice]
}

async function getMembers(guild) {
    let users = 0
    let bots = 0
    members = await guild.fetchMembers()
    for (member of members){
        if (!member.user.bot) users ++
        if (member.user.bot) bots ++
    }
    delete members
    return [users, bots]
    
}

async function getGuildStatus(bot, guild) {
    let connection = await mariadb.createConnection(bot.database)
    let result = await connection.query(`SELECT guilds FROM botInfo`).then( async (rows) => {
        servers = JSON.parse(rows[0])
        if (servers[guild.id]){
            await connection.destroy()
            return servers[guild.id]
        }
        else{
            await connection.destroy()
            return null
        }
    }).catch(async (error) => {
        console.log(error)
        await connection.destroy()
        return null
    })
    return result
}


module.exports.run = async (bot, message, args) => {
    let guild = message.channel.guild
    let channels = await getChannels(guild)
    let members = await getMembers(guild)
    let owner = await guild.fetchMembers({userIDs: [guild.ownerID]})
    let guildStatus = await getGuildStatus(bot, guild)
    let embedObject = {embed: {
        title: `${guild.name} Info`,
        thumbnail: {
            url: guild.iconURL
        },
        fields: [  
            {
                name: "Owner",
                value: owner[0].username+"#"+owner[0].discriminator+"\n ID: "+guild.ownerID,
                inline: true
            },
            {
                name: "Server ID",
                value: guild.id,
                inline: true
            },
            {
                name: "Created",
                value: moment(guild.createdAt).format("DD/MM/YY hh:mm a"),
                inline: true
            },
            {
                name: "Member Count",
                value: `Users: ${members[0]}\nBots: ${members[1]}\n**Total:** ${members[0]+members[1]}`,
                inline: true
            },
            {
                name: "Channels",
                value: `Text: ${channels[0]}\nVoice: ${channels[1]}\n**Total:** ${channels[0]+channels[1]}`,
                inline: true
            },
            {
                name: "Roles",
                value: guild.roles.size,
                inline: true
            },
            {
                name: "Boosts",
                value: guild.premiumSubscriptionCount,
                inline: true
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: true
            },
            {
                name: "Boosts Level",
                value: "Level "+guild.premiumTier,
                inline: true
            },
            {
                name: "Features",
                value: `\`${guild.features.join('` `') ? guild.features.join('` `') : "None"}\``,
                inline: true
            },
        ]
    }}
    if (!guildStatus || !guildStatus.type){
        embedObject.embed.description = `Want a Crewmate and colorful embed. Feel free to get premium to get these perks and more.`
    }
    else if (guildStatus.type == "official") {
        embedObject.embed.description = `${guildIcons[guildStatus.type]} Official Server`
        embedObject.embed.color = embedColor[guildStatus.color]
    }
    else if (guildStatus.type == "partner") {
        embedObject.embed.description = `${guildIcons[guildStatus.type]} Partnered Server`
        embedObject.embed.color = embedColor[guildStatus.color]
    }
    else if (guildStatus.type == "innersloth") {
        embedObject.embed.description = `${guildIcons[guildStatus.type]} InnerSloth Official Server`
        embedObject.embed.color = embedColor[guildStatus.color]
    }
    else if (guildStatus.type == "premium") {
        embedObject.embed.description = `${guildIcons.colors[guildStatus.color]} Premium Server`
        embedObject.embed.color = embedColor[guildStatus.color]
    }
    message.channel.createMessage(embedObject).catch((error) => {
		if (error.message == "Missing Permissions"){
			message.channel.createMessage("I need `Embed Links` permissions to be able to send this message.")
		}
	})
}

module.exports.info = {
    name: "serverinfo",
    description: "Display information about the server",
    category: "About",
    aliases: ["si","server"],
    GuildOnly: true
}