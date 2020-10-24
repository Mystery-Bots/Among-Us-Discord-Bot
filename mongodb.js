const MongoClient = require('mongodb').MongoClient
const credentials  = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority";

class MDBConnect {
    static connect (db, collection) {
        return MongoClient.connect(credentials,{ useUnifiedTopology: true })
            .then( client => {
                return client.db(db).collection(collection);
            })
            .catch( err => { console.log(err)});
    }
    static findOne(db, collection, query) {
        return MDBConnect.connect(db,collection)
            .then(c => {
                return c.findOne(query)
                            .then(result => {
                                return result;
                            });
            })
    }
    static updateOne(db, collection, query, updateDoc) {
        return MDBConnect.connect(db,collection)
            .then(c => {
                return c.updateOne(query, updateDoc, {upsert:true})
                            .then(result => {
                                return result;
                            });
            })
    }
    static deleteOne(db, collection, query) {
        return MDBConnect.connect(db,collection)
            .then(c => {
                return c.deleteOne(query)
                            .then(result => {
                                return result;
                            });
            })
    }
}
module.exports = MDBConnect;
