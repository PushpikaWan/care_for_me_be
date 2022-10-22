const express = require('express');
const metadata = require('../services/metadata');
const {authenticateJWT} = require("../authorization/auth-helper");

const router = new express.Router();


/**
 * 
 */
router.get('/user/:userId/posts', authenticateJWT, async (req, res, next) => {
  const options = {
    userId: req.params['userId']
  };

  try {
    const result = await metadata.getUserPostMetaData(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.get('/application', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await metadata.getApplicationMetaData(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
