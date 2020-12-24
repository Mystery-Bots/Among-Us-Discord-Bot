function tokenGen(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports.run = async (bot, message, args, database) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "addtoken"`)
    token = await tokenGen(16)
    user = args[0]

    let collection = bot.database.collection("tokens");
    
    let updateDoc = {
            "token":token,
            "userID":user
    };
    await collection.insertOne(updateDoc);
    message.channel.createMessage(`Added token: \`${token}\` to ${user}`)
}

module.exports.info = {
    name: "addtoken",
    description: "Gives a user a premium token",
    category: "Developer",
}