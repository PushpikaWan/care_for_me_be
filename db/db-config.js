const {STATE_ACTIVE} = require("../util/constants");
const MongoClient = require("mongodb").MongoClient;

const connectionString = process.env.MONGODB_URI;
const dbName = 'CARE_FOR_ME_DEV';
let mongoClient = null;

getDB = async () => {
  try {
    if (mongoClient != null) {
      return mongoClient.db(dbName);
    }
    mongoClient = await MongoClient.connect(connectionString);
    console.log('Connected to Database');
    return mongoClient.db(dbName);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

module.exports.getUserCollection = async () => {
  let db = await getDB();
  return db.collection('UserData');
}

module.exports.getPostCollection = async () => {
  let db = await getDB();
  return db.collection('Post');
}

module.exports.getPostCursor = async () => {
  let db = await getDB();
  return db.collection('Post').find({'status': STATE_ACTIVE});
}