async function getPrefixs(bot){
    let collection = bot.database.collection("servers");
    let results = await collection.find();
    items = {}
    await results.forEach((item) => {
        if (!item){}
        else{
            id = item.guildID
            prefix = item.prefix
            items[id] = prefix
        }
    })
    return items
}

module.exports.prefixes = {}

module.exports.Run = async function (database) {
    setInterval(async function() {
        module.exports.prefixes = await getPrefixs(database)
    },1 * 1000)
}