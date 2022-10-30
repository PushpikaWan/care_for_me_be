const {getPostCollection} = require("../db/db-config");
const {STATE_ACTIVE} = require("../util/constants");
const common = require("../util/common");
/**
 * @param {Object} options
 * @param {String} options.district district to search
 * @param {int} options.daysBack How many days back to calculate
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getPostLocationData = async (options) => {
  try {
    let postCollection = await getPostCollection();
    let daysBefore = new Date();
    daysBefore.setDate(new Date().getDate() - options.daysBack);
    let posts = await postCollection.find(
        {
          'status': STATE_ACTIVE,
          createdAt: {$gte: daysBefore}
        }).toArray();

    if (options.district != null && options.district.toLowerCase() !== 'all') {
      posts = await postCollection.find(
          {
            district: options.district,
            'status': STATE_ACTIVE,
            createdAt: {$gte: daysBefore}
          }).toArray();
    }
    if (!posts || posts.length === 0) {
      return {
        status: 204,
        data: null
      };
    }
    return {
      status: 200,
      data: posts.map(post => convertToPostLocation(post))
    };
  } catch (e) {
    return common.getErrorResponse(500, e);
  }
};

function convertToPostLocation(post) {
  return {
    postId: post._id,
    animalNeed: post.animalNeed,
    animalType: post.animalType,
    postImageUrl: post.imageUrl,
    postDistrict: post.district,
    postAddress: post.addressText,
    Location: post.location
  }
}
