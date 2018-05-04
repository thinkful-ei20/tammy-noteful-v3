'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {MONGODB_URI} = require('../config');

const {Note} = require('../models/note');
const {Tag} = require('../models/tag');


module.exports = router;