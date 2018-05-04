'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// const {MONGODB_URI} = require('../config');
const {Folder} = require('../models/folder');
const {Note} = require('../models/note');

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
  let folderId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }
  //^^need to find a way to loop through values of object Ids
  return Folder
    .findById(folderId)
    .then((result) => {
      res.json(result).status(200);
    })
    .catch(err => {
      err = new Error ('Not found');
      err.status = 404;
      return next(err);
    });
});

router.post('/', (req,res,next) => {
  let name = req.body;

  if (!name){
    const err = new Error('Missing name');
    err.status = 400;
    return next (err);
  }

  Folder.create(name)
    .then(folder => {
      res.location(`${res.originalUrl}/${folder.id}`).status(201).json(folder);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/:id', (req, res , next) => {
  let folderId = req.params.id;
  let name = req.body;
  // console.log(folderId);
  // //checks for valid id
  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }


  //checks for name exisits
  if (!name) {
    const err = new Error('Missing name');
    err.status = 400;
    return next(err);
  }

  Folder.findByIdAndUpdate(folderId, name, {new: true, upsert: false})
    .then(updatedFolder => {

      if (updatedFolder === null) {
        const err = new Error('Bad Request');
        err.status = 400;
        return next(err);
      } else 
        res.json(updatedFolder);
    })
    .catch(err => {
      if (err.code === 11000){
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });

});


router.delete('/:id', (req, res, next)=> {
  let deleteId = req.params.id;
  console.log(deleteId);

  if (!mongoose.Types.ObjectId.isValid(deleteId)) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }


  return Folder.findByIdAndRemove({_id: deleteId})
    .then(() => {
      console.log(deleteId);
      console.log('then is going');
      return Note.deleteMany({'folderId': deleteId});

    })
    .then(() => {
      console.log('related notes deleted');
      res.status(204).end();
    })
    .catch (err => next(err));
});


module.exports = router;