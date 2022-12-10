const {getUserCollection} = require('../db/db-config');
const common = require('../util/common');
const {ObjectId} = require("mongodb");
const {STATE_ACTIVE} = require("../util/constants");
const {convertIdBeforeSendingObject} = require("../util/common");
const {uploadImage} = require("./external/external");

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.saveUser = async (options) => {
  try {
    const userCollection = await getUserCollection();
    const imageSource = options.body.imageSource;
    const uploadedImageUrl = (imageSource != null && imageSource) ?
        await uploadImage(imageSource) : options.body.user.imageUrl;

    let countDocuments = await userCollection.countDocuments(
        {googleId: options.body.user.googleId},
        {limit: 1});

    const user = {
      ...options.body.user,
      imageUrl: uploadedImageUrl,
      status: STATE_ACTIVE
    };

    if (countDocuments > 0) {
      return await editUserByGoogleId(user);
    }

    const response = await userCollection.insertOne(
        common.getPreProcessedDataBeforeSave(user));
    const insertedUser = await this.getUser({userId: response.insertedId})
    return {
      status: 201,
      data: insertedUser.data
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
 * @param {String} options.googleId google id
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getUserByGoogleId = async (options) => {
  try {
    const userCollection = await getUserCollection();
    const user = await userCollection.findOne(
        {googleId: options.googleId, 'status': STATE_ACTIVE});
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
  //todo not using ... will use in the future
  // try {
  //   const userCollection = await getUserCollection();
  //   let body = options.body;
  //   const filter = {_id: new ObjectId(body.id)};
  //   const updatingDoc = {
  //     $set: common.getPreProcessedDataBeforeUpdate({
  //       "name": body.name,
  //       "imageUrl": body.imageUrl
  //     })
  //   }
  //   let updateResult = await userCollection.findOneAndUpdate(filter,
  //       updatingDoc, {returnDocument: "after"});
  //   return {
  //     status: 201,
  //     data: convertIdBeforeSendingObject(updateResult.value)
  //   };
  // } catch (e) {
  //   return common.getErrorResponse(500, e);
  // }
};

/**
 * Do not expose this to external parties...
 * @param {Object} user
 * @throws {Error}
 * @return {Promise}
 */
editUserByGoogleId = async (user) => {
  try {
    const userCollection = await getUserCollection();
    const filter = {googleId: user.googleId};
    const updatingDoc = {
      $set: common.getPreProcessedDataBeforeUpdate({
        "name": user.name,
        "imageUrl": user.imageUrl
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
