'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const {Note} = require('../models/note');

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};

//     if (searchTerm) {
//       const re = new RegExp(searchTerm, 'i');
//       filter.title = { $regex: re };
//     }

//     return Note.find(filter)
//       .sort('created')
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const id =  '000000000000000000000005';
    
//     return Note
//       .find({_id: id})
//       .then(results => { console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then (() => {
//     return mongoose.disconnect()
//       .then(()=> {
//         console.log('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     return Note.create({
//       title: 'More on Cats',
//       content: 'Everything I learned about cats is new.'
//     });
//   })
//   .then(note => {
//     console.log(note);
//   })
//   .then (()=> {
//     return mongoose.disconnect()
//       .then(() => {
//         console.log('Disconnected');
//       });
//   })

//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

mongoose.connect(MONGODB_URI)
  .then (()=>{
    const id = '5ae8c1735b995f21802dadee';
    const updateNote = {title: 'News on Dogs', content: 'This has nothing to do with cats'};
    const validateFields = ['title', 'content'];

    // validateFields.forEach(field => {
    //   if (!(field in updateNote.keys)) {
    //     const message = 'Please include a title and content';
    //     console.error(message);
    //   };

    return Note.findByIdAndUpdate(id, updateNote, {new: true, upsert: false})
      .then((note) => {
        console.log(note);
      })
      .catch(console.error);
  })

  .then(() => {
    return mongoose.disconnect()
      .then(() => {
        console.info('Disconnected');
      });
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });