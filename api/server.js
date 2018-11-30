require('dotenv').config();
const express = require('express');
const cors = require('cors');
const knex = require('knex');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

const jwtKey = require('../_secrets/keys').jwtKey;
const server = express();

// const authenticate = require('../config/middlewares.js');
const authenticate = require('../config/authenticate.js');
// protectedSession for sessions configuration

server.use(express.json());
server.use(cors());

// TOKENS doesn't require state; session does require state (so the user has to use the same server)

// more middleware
// function checkRole(role) {
//   return function(req, res, next) {
//     if (req.decodedToken && req.decodedToken.roles.includes(role)) {
//       next();
//     } else {
//       req.status(403).json({ message: "you don't have permission to access to this resource based on your role" })
//     }
//   }
// }

// e.g., checkRole('sales');


// TABLE SCHEMA


// endpoints here

server.post('/api/register', (req, res) => {
  // 1. grab username and password from body
  // 2. generate the hash from the user's password
  // 3. override the user.password with the hash
  // 4. save the user to the database
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14)
  creds.password = hash;
  db('users')
    .insert(creds)
    .then(ids => {
      res.status(200).json({ id: ids[0]});
    })
    .catch(err => {
      res.status(500).json({ message: 'Error inserting', err })
    })
})

function generateToken(user) {

  const payload = {
    userId: user.userId,
    username: user.username,
  }
  // const secret = 'anySecret($&*#$%#%#$%#$)';
  // const secret = process.env.JWT_SECRET; // added to .env file
  const secret = jwtKey
  const options = {
    expiresIn: '1hr',
  }
  return jwt.sign(payload, secret, options); // take 3 arguments
}


server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password) ) {
        // user exists and password match
        const token = generateToken(user)
        res.status(200).json({ message: 'Logged in', user: user.username, token})
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
})

// server.get('/api/protected', protected, (req, res) => {
//     db('users')
//     .select('id', 'username', 'password')
//     .first()
//     .then(user => {
//         res.status(200).json({ message: 'Logged into protected area', user: user.username})
//     })
//     .catch(err => res.send(err));
// })

// server.get('/api/users', (req, res) => {
server.get('/api/users', authenticate, (req, res) => {

  db('users')
    .select('id', 'username', 'password')
    // .select('username') to see just users
    .then(users => {
      res.status(200).json({ users })
    })
    .catch(err => res.send(err));
});


server.get('/', (req, res) => {
  res.json({ api: 'sprint auth up' });
});

module.exports = server;