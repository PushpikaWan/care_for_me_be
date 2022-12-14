const {STATE_ACTIVE} = require("../util/constants");
const {MONGODB_NAME, MONGODB_URI} = require("../util/env-variables");
const MongoClient = require("mongodb").MongoClient;

const connectionString = MONGODB_URI;
const dbName = MONGODB_NAME;
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