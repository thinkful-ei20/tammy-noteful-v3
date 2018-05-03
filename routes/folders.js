'use strict';

const express = require('express');
const router = express.router;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {MONGODB_URI} = require('../config');
const {Folder} = require('../models/folder');



module.exports = router;