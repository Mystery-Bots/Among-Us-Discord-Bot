const { ShardingManager } = require('discord.js');
const config = require('./config')
const manager = new ShardingManager('./discord.js', { token: config.discord.token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();