// require('dotenv').config(); // need
const express = require('express'); 
const cors = require('cors');
const knex = require('knex');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

const axios = require('axios');

const server = express();

const { authenticate } = require('./middlewares');

// const protected = require('../middleware/protected.js');
// const checkRole = require('../middleware/checkRole.js');
// protectedSession for sessions configuration

server.use(express.json());
server.use(cors());



module.exports = server => {
  server.get('/', testApi);
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  server.post('/api/register', (req, res) => {
    const creds = req.body;
    console.log(creds)
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;
    return db('users')
      .insert(creds)
      .then(ids => {
        res.status(201).json({ id: ids[0] })
      })
      .catch(err => {
        return res.status(500).json({ message: 'Error inserting', err })
      })
    })
}

function login(req, res) {
  // implement user login
  server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
      const hash = bcrypt.hashSync(password, 14);
      db('users').insert({ username, hash, clearance})
        .where('username', username).first()
        .then(user => {
          if (user && bcrypt.compareSync(creds.hash, user.hash))
          res.status(201).json({ username, id: ids[0] })
        })
        .catch(err => {
          return res.status(500).json({ message: 'registration failed' })
        })
    } else {
      return res.status(400).json({ message: 'include all fields'})
    }
  })
}

function getJokes(req, res) {
  axios
    .get(
      'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten'
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

function testApi (req, res) {
  return server.get('/', (req, res) => {
    res.json({ api: 'ah-Auth up' });
  });
}
