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

router.post('/', (req, res, next) => {
  const name = req.body.name;

  if (!name) {
    const err = new Error ('Please include a name');
    err.status = 400;
    return next(err);
  }

  return Tag
    .create(name)
    .then (tag => {
      res.location(`${req.originalUrl}/${tag.id}`).status(201).json(tag);
    })
    .catch (err => {
      if (err.code === 11000) {
        err = new Error('The tag already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const tagId = req.params.id;
  const name = req.body.name;

  if (!mongoose.Types.ObjectId.isValid(tagId)) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }

  if (!name) {
    const err = new Error('Please include a name');
    err.status = 400;
    return next(err);
  }

  Tag.findByIdAndUpdate(tagId, name, {new: true})
    .then(updatedTag => {
      res.json(updatedTag);
    })
    .catch (err => {
      if( err.code === 11000) {
        err = new Error('The tag alreay exists');
        err.status = 400;
      }
      next(err);
    });

});

router.delete('/:id', (req, res, next)=> {
  const tagId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(tagId)){
    const err = new Error ('Tag does not exist');
    err.status = 400;
    return next(err);
  }

  Tag.findByIdAndRemove(tagId)
    .then(() => {
      return Note.updateMany({'tags': tagId}, {$pull:{'tags': tagId}});
    })
    .then(() => {
      res.status(204).end();
    });


});

module.exports = router;