'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../server');

const {TEST_MONGODB_URI} = require('../config');

const {Note} = require('../models/note');
const seedData = require('../db/seed/notes');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Notes API', function() {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => console.log('test data connected'));
  });

  beforeEach(function () {
    return Note.insertMany(seedData)
      .then(() => Note.createIndexes())
      .then(() => console.log('notes created'));
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase()
      .then(() => console.log('dataabase dropped'));
  });

  after(function () {
    return mongoose.disconnect()
      .then (() => console.log('mongo disconnected'));
  });
  
  describe('POST /api/notes', function () {
    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...'
      };
  
      let res;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Note.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
        });
    });
  });

  describe('GET /api/notes', function () {
    it('should return all notes', function () {
      let notes;
      return Note.find()
        .then(results =>{
          notes = results;
      
          return chai.request(app)
            .get('/api/notes');
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');

          expect(res.body).to.have.length(notes.length);
        });
    });
  });

  
});


