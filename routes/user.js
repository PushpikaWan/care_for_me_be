const express = require('express');
const user = require('../services/user');
const {authenticateJWT} = require("../authorization/auth-helper");

const router = new express.Router();


/**
 *
 */
router.post('/', authenticateJWT, async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await user.saveUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.get('/:userId', authenticateJWT, async (req, res, next) => {
  const options = {
    userId: req.params['userId']
  };

  try {
    const result = await user.getUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.put('/:userId', authenticateJWT, async (req, res, next) => {
  const options = {
    body: req.body,
    userId: req.params['userId']
  };

  try {
    const result = await user.editUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
