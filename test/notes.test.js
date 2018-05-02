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

  describe('GET /api/notes/:id', function () {
    it ('should return all notes', function() {
      let note;
      return Note.findOne()
        .then(result => {
          note = result;

          return chai.request(app)
            .get(`/api/notes/${note.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id','title','content', 'createdAt', 'updatedAt');

          expect(res.body.id).to.equal(note.id);
          expect(res.body.title).to.equal(note.title);
          expect(res.body.content).to.equal(note.content);
        });
    });
    it('should return status error 400', function() {
      let id = 123435;
      return chai.request(app)
        .get(`/api/notes/${id}`)
        .then((res) => {
          expect(res).to.have.status(400);
        });
    });
  });

  //API PUT
  describe('PUT /api/notes/:id', function() {
    it('should update and item and return it', function () {
      let updateNote = {id: '000000000000000000000001', title: 'New Title', content: 'New Content'};
      let res;
      return chai.request(app)
        .put(`/api/notes/${updateNote.id}`)
        .send(updateNote)
        .then(function(result) {
          res = result;
          expect(res).to.have.status(201);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id','title','content', 'createdAt', 'updatedAt');

          expect(res.body.id).to.equal(updateNote.id);
          expect(res.body.title).to.equal(updateNote.title);
          expect(res.body.content).to.equal(updateNote.content);

          return Note.findByIdAndUpdate(res.body.id);
        })
        .then (dataBase => {
          expect(res.body.title).to.equal(dataBase.title);
          expect(res.body.content).to.equal(dataBase.content);
        });
    });
    it('should return status error 400', function() {
      let id = 123435;
      return chai.request(app)
        .get(`/api/notes/${id}`)
        .then((res) => {
          expect(res).to.have.status(400);
        });
    });
  });
  describe('DELETE /api/notes/:id', function() {
    it('should delete a note and return 204 status', function () {
      const id = '000000000000000000000001';
      return chai.request(app)
        .delete(`/api/notes/${id}`)
        .then(res => {
          expect(res).to.have.status(204);
          return Note.findById(id);
        })
        .then((dataBase)=> {
          expect(dataBase).not.to.exist;
        });
    });
  });
});