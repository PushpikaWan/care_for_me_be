const express = require('express');
const posts = require('../services/posts');
const {authenticateJWT} = require("../authorization/auth-helper");

const router = new express.Router();

/**
 *
 */
//only keep this without authorization to access from public services - todo only allow within localhost
router.get('/', async (req, res, next) => {
  const options = {
    pageSize: req.query['pageSize'],
    page: req.query['page']
  };

  try {
    const result = await posts.getAllPosts(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.post('/', authenticateJWT, async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await posts.savePost(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
//only keep this without authorization to access from public services - todo only allow within localhost
router.get('/:postId', async (req, res, next) => {
  const options = {
    postId: req.params['postId']
  };

  try {
    const result = await posts.getPost(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.put('/:postId', authenticateJWT, async (req, res, next) => {
  const options = {
    body: req.body,
    postId: req.params['postId']
  };

  try {
    const result = await posts.updatePost(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.delete('/:postId', authenticateJWT, async (req, res, next) => {
  const options = {
    postId: req.params['postId']
  };

  try {
    const result = await posts.deletePost(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.post('/:postId/comment', authenticateJWT, async (req, res, next) => {
  const options = {
    body: req.body,
    postId: req.params['postId']
  };

  try {
    const result = await posts.addComment(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.delete('/:postId/comment/:commentId', authenticateJWT, async (req, res, next) => {
  const options = {
    postId: req.params['postId'],
    commentId: req.params['commentId']
  };

  try {
    const result = await posts.deleteComment(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.post('/:postId/report', authenticateJWT, async (req, res, next) => {
  const options = {
    body: req.body,
    postId: req.params['postId']
  };

  try {
    const result = await posts.reportPost(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.post('/:postId/comment/:commentId/report', authenticateJWT, async (req, res, next) => {
  const options = {
    body: req.body,
    postId: req.params['postId'],
    commentId: req.params['commentId']
  };

  try {
    const result = await posts.reportComment(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.get('/user/:userId', authenticateJWT, async (req, res, next) => {
  const options = {
    userId: req.params['userId'],
    includeInteraction: req.query['includeInteraction'],
    pageSize: req.query['pageSize'],
    page: req.query['page']
  };

  try {
    const result = await posts.getPostsByUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
