'use strict';

const mongoose = require('mongoose');

const folderSchema = mongoose.Schema({ 
  name:  {type: String, required: true}
}, {timestamps: true});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = {Folder};