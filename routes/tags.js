'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {MONGODB_URI} = require('../config');

const {Note} = require('../models/note');
const {Tag} = require('../models/tag');

// GET/READ a single item
router.get('/', (req, res, next) => {
  return Tag
    .find()
    .sort({name: 1})
    .then(results => {
      res.json(results);
    })
    .catch (err => next (err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error ('Invalid Id');
    err.status = 400;
    return next(err);
  }

  return Tag
    .findById(id)
    .then(result => {
      res.json(result);
    })
    .catch(err => next (err));
});

module.exports = router;