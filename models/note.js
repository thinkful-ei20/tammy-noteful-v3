'use strict';

const mongoose = require('mongoose');
//const {Folder} = require('./folder');

const noteSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String},
  folderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Folder'},
}, {timestamps: true});

noteSchema.set('toObject',  {
  transform: function (doc, ret){
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Note = mongoose.model('Note',noteSchema);

module.exports = {Note};