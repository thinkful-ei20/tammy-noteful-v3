'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../server');

const {TEST_MONGODB_URI} = require('../config');

const {Folder} = require('../models/folder');
const seedFolders= require('../db/seed/folders');

const expect = chai.expect;
chai.use(chaiHttp);

describe('FOLDER API', function() {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => console.log('test data connected'));
  });

  beforeEach(function () {
    return Folder.insertMany(seedFolders)
      .then(() => Folder.createIndexes())
      .then((results) => console.log(results +'folders created'));
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase()
      .then(() => console.log('database dropped'));
  });

  after(function () {
    return mongoose.disconnect()
      .then (() => console.log('mongo disconnected'));
  });

  describe.only('DELETE /api/folders/:id', function() {
    it('should delete a note and return 204 status', function () {
      const id = '111111111111111111111103';
      return chai.request(app)
        .delete(`/api/folders/${id}`)
        .then(res => {
          expect(res).to.have.status(204);
          return Folder.findById(id);
        })
        .then((dataBase)=> {
          expect(dataBase).not.to.exist;
        });
    });
  });

  describe('POST /api/folders', function () {
    it('should create and return a new folder when provided valid data', function () {
      const newFolder = {
        'name': 'This is a new folder',
      };

      let res;

      return Folder.create(newFolder)
        .then (() => {
          return chai.request(app)
            .post('/api/folders')
            .send(newFolder)
            .then(result => {
              res = result;
              expect(res).to.have.status(201);
              expect(res).to.have.header('location');
              expect(res).to.be.json;
              expect(res.body).to.be.a('object');
            });
        });
    });
  });
});