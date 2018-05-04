'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {MONGODB_URI} = require('../config');

const {Note} = require('../models/note');
const {Folder} = require('../models/folder');



/* ========== GET/READ ALL ITEM ========== */
router.get('/', (req, res, next) => {
  const {searchTerm, folderId, tagId} = req.query;
  const filter = {};

  console.log(searchTerm);

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    console.log(re);
    filter.title = { $regex: re };
    console.log({ $regex: re });
  }

  if (folderId) {
    filter.folderId = folderId;
  }

  if (tagId) {
    filter.tags = tagId;
  }

  return Note.find(filter)
    .populate('tags')
    .sort('created')
    .then(results => {
      res.json(results);
    })
    .catch(console.error);
});

  


//* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  
  if (id.length !== 24) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }


  return Note
    .findById(id)
    .then(results => { 
      res.json(results);
    })
    .catch(console.error);
});


/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title, content, folderId} = req.body;

  if (!title){
    const err = 'Please include a title';
    err.status = 400;
    console.error(err);
  }

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('Folder does not exist');
    err.status = 400;
    return next(err);
  }

  Note.create(
    {title,
      content,
      folderId})
    .then(note => {
      res.location(`${res.originalUrl}/${note.id}`).status(201).json(note);
    })
    .catch(console.log('something happened in post API'));
  

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const {title, content,folderId} = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Folder does not exist');
    err.status = 400;
    return next(err);
  }

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('Folder does not exist');
    err.status = 400;
    return next(err);
  }

  Note.findByIdAndUpdate(id, {title,content,folderId}, {new: true, upsert: false})
    .then((note) => {
      res.location(`${req.originalUrl}/${note.id}`).status(201).json(note);
    })
    .catch(err => next (err));
});


/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }

  Note .findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();    
    })
    .catch(console.error('Soemthing went wrong'));
});

module.exports = router;