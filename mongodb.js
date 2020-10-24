const MongoClient = require('mongodb').MongoClient

class Connection {
    static async connectToMongo() {
        if (this.db) return this.db
        const client = new MongoClient(this.url, this.options);
        client.connect(err => {
            this.db = client.db("bot")
        })
        return this.db
    }
}

Connection.db = null
Connection.url = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority"
Connection.options = {
    bufferMaxEntries:   0,
    useUnifiedTopology: true,
}

module.exports = { Connection }
