const axios = require('axios');
const FormData = require('form-data');
const {IMAGE_API_KEY} = require("../../util/env-variables");

module.exports.uploadImage = async (imageSrc) => {
  const imageAPIKey = IMAGE_API_KEY;
  const data = new FormData();
  data.append('image', imageSrc);
  try {
    const imageResponse = await axios.post(
        'https://api.imgbb.com/1/upload', data, {params: {'key': imageAPIKey}});
    return imageResponse.data.data.display_url;
  } catch (e) {
    console.log('image uploading error', e.response.data);
    throw e;
  }
}