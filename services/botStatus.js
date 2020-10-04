const mariadb  = require("mariadb")
botStatus = require("../status.json").status

currentStatus = 0;

async function fetchStatus(bot){
	let connection = await mariadb.createConnection(bot.database)
	
	status = await connection.query(`SELECT status FROM botInfo`).then( async (rows) => {
		return rows[0]
	})
	await connection.destroy();
	return status[0]
}

module.exports.Run = async function (bot) {
	console.log("Bot Ready");
	bot.editStatus(await fetchStatus(bot), {name:`${bot.config.prefix}help | ${bot.guilds.size} Servers!`, type: 0 });
	setInterval(async function () {
		let statuses = [
			`${bot.config.prefix}help | ${bot.guilds.size} Servers!`,
			`${bot.config.prefix}help | aub.TheMystery.me`,
		];
		currentStatus = currentStatus + 1 < statuses.length ? currentStatus + 1 : 0;
		let status = statuses[currentStatus];
		bot.editStatus(await fetchStatus(bot),{name: status, type: 0});
	}, 60 * 1000);
};
