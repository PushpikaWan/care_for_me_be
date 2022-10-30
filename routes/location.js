const express = require('express');
const location = require('../services/location');
const {authenticateJWT} = require("../authorization/auth-helper");

const router = new express.Router();


/**
 * 
 */
router.get('/post', async (req, res, next) => {
  const options = {
    district: req.query['district'],
    daysBack: req.query['daysBack']
  };

  try {
    const result = await location.getPostLocationData(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
