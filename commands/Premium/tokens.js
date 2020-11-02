module.exports.run = async (bot, message, args, database) => {

    let tokenCollection = bot.database.collection("tokens")
    let tokens = await tokenCollection.find({"userID":message.author.id}).toArray()
    let embedObject = {embed:{
        title: `${message.author.username}'s Premium Tokens`,
        description: "Only tokens that have been claimed are shown to prevent theft.\nTo find tokens that are not listed, check your PayPal tractions for the Transaction ID.",
        fields: []
    }}
    for (token of tokens){
        embedObject.embed.fields.push({"name":token.token,"value":token.guildID ? `ServerID: ${token.guildID}` : "No server assigned.","inline":true})
    }
    if (embedObject.embed.fields.length < 1){
        embedObject.embed.fields.push({"name":"No tokens", "value":"Sorry but you have no tokens that have been claimed."})
    }
    message.channel.createMessage(embedObject)
}

module.exports.info = {
    name: "tokens",
    description: "Get a list of all tokens assigned to you",
    category: "Premium",
}