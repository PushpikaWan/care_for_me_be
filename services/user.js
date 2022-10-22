const {getUserCollection} = require('../db/db-config');
const common = require('../util/common');
const {ObjectId} = require("mongodb");
const {STATE_ACTIVE} = require("../util/constants");
const {convertIdBeforeSendingObject} = require("../util/common");

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.saveUser = async (options) => {
  try {
    const userCollection = await getUserCollection();
    let countDocuments = await userCollection.countDocuments(
        {googleId: options.body.googleId},
        {limit: 1});

    if (countDocuments > 0) {
      return await editUserByGoogleId(options);
    }
    const user = {...options.body, status: STATE_ACTIVE};
    const response = await userCollection.insertOne(
        common.getPreProcessedDataBeforeSave(user));

    const insertedUser = await this.getUser({userId: response.insertedId})
    return {
      status: 201,
      data: convertIdBeforeSendingObject(insertedUser.data)
    };
  } catch (e) {
    return common.getErrorResponse(500, e);
  }
};

/**
 * @param {Object} options
 * @param {String} options.userId user id
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getUser = async (options) => {

  try {
    const userCollection = await getUserCollection();
    const user = await userCollection.findOne(
        {_id: new ObjectId(options.userId), 'status': STATE_ACTIVE});
    if (!user) {
      return {
        status: 204,
        data: null
      };
    }
    return {
      status: 200,
      data: convertIdBeforeSendingObject(user)
    };
  } catch (e) {
    return common.getErrorResponse(500, e);
  }
};

/**
 * @param {Object} options
 * @param {String} options.userId user id
 * @throws {Error}
 * @return {Promise}
 */
module.exports.editUser = async (options) => {
  try {
    const userCollection = await getUserCollection();
    let body = options.body;
    const filter = {_id: new ObjectId(body.id)};
    const updatingDoc = {
      $set: common.getPreProcessedDataBeforeUpdate({
        "name": body.name,
        "imageUrl": body.imageUrl
      })
    }
    let updateResult = await userCollection.findOneAndUpdate(filter,
        updatingDoc, {returnDocument: "after"});
    return {
      status: 201,
      data: convertIdBeforeSendingObject(updateResult.value)
    };
  } catch (e) {
    return common.getErrorResponse(500, e);
  }
};

/**
 * Do not expose this to external parties...
 * @param {Object} options
 * @param {String} options.userId user id
 * @throws {Error}
 * @return {Promise}
 */
editUserByGoogleId = async (options) => {
  try {
    const userCollection = await getUserCollection();
    let body = options.body;
    const filter = {googleId: body.googleId};
    const updatingDoc = {
      $set: common.getPreProcessedDataBeforeUpdate({
        "name": body.name,
        "imageUrl": body.imageUrl
      })
    }
    let updateResult = await userCollection.findOneAndUpdate(filter,
        updatingDoc, {returnDocument: "after"});
    return {
      status: 201,
      data: convertIdBeforeSendingObject(updateResult.value)
    };
  } catch (e) {
    return common.getErrorResponse(500, e);
  }
};
