'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// const {MONGODB_URI} = require('../config');
const {Folder} = require('../models/folder');

//get all folders and search
router.get('/', (req, res, next) => {
  return Folder.find()
    .sort({name: 1})
    .then ((result) => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;



  // if (id.length !== 24) {
  //   const err = new Error('Not found');
  //   err.status = 404;
  //   return next(err);
  // }

  return Folder
    .findById(id)
    .then((result) => {
      res.json(result).status(200);
    })
    .catch(err => {
      err = new Error ('Not found');
      err.status = 404;
      return next(err);
    });
});

module.exports = router;