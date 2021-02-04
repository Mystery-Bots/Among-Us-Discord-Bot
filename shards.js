const Sharder = require("eris-sharder").Master;
let config = require("./config");
const sharder = new Sharder(config.discord.token, "/discord.js", {
	stats: true,
	debug: false,
	guildsPerShard: 2000,
	name: "Among Us Bot",
	clientOptions: {
		//intents: 4739,
		intents: 4737,
		compress: true,
		maxShards: "auto",
		guildSubscriptions: false,
		messageLimit: 0,
		largeThreshold: 0,
		disableEvents: {
			CHANNEL_DELETE: true,
			CHANNEL_UPDATE: true,
			GUILD_BAN_ADD: true,
			GUILD_BAN_REMOVE: true,
			GUILD_MEMBER_ADD: true,
			GUILD_MEMBER_REMOVE: true,
			GUILD_MEMBER_UPDATE: true,
			GUILD_ROLE_CREATE: true,
			GUILD_ROLE_DELETE: true,
			GUILD_ROLE_UPDATE: true,
			GUILD_UPDATE: true,
			MESSAGE_DELETE: true,
			MESSAGE_DELETE_BULK: true,
			MESSAGE_UPDATE: true,
			PRESENCE_UPDATE: true,
			TYPING_START: true,
			USER_UPDATE: true,
		},
	},
});

sharder.on("stats", (stats) => {
	console.log(stats);
});
