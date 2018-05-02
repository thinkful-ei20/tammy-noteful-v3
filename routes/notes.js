'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {MONGODB_URI} = require('../config');

const {Note} = require('../models/note');


/* ========== GET/READ ALL ITEM ========== */
router.get('/', (req, res, next) => {
  const searchTerm = req.query;
  const filter = {};
  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.title = { $regex: re };
  }

  return Note.find(filter)
    .sort('created')
    .then(results => {
      res.json(results);
    })
    .catch(console.error);
});
// .then(() => {
//   return mongoose.disconnect()
//     .then(() => {
//       console.info('Disconnected');
//     });
// })
// .catch(err => {
//   console.error(`ERROR: ${err.message}`);
//   console.error(err);
// });
  


/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  
  return Note
    .find({_id: id})
    .then(results => { 
      res.json(results);
    })
    .catch(console.error);
});
// .then (() => {
// return mongoose.disconnect()
//   .then(()=> {
//     console.log('Disconnected');
//   });
// })
// .catch(err => {
// console.error(`ERROR: ${err.message}`);
// console.error(err);
// });

// });

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title, content} = req.body;
  Note.create(
    {title,
      content})
    .then(note => {
      res.json(note);
    })
    .catch(console.error);
  

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const {title, content} = req.body;

  if (!title){
    const err = 'Please include a title';
    err.status = 400;
    console.error(err);
  }

  Note.findByIdAndUpdate(id, {title,content}, {new: true, upsert: false})
    .then((note) => {
      res.location(`${req.originalUrl}/${note.id}`).status(201).json(note);
    })
    .catch(err => next (err));
});


/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Note .findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();    
    })
    .catch(console.error('Soemthing went wrong'));
});

module.exports = router;