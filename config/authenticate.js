
const jwt = require('jsonwebtoken');
const jwtKey = require('../_secrets/keys').jwtKey;

module.exports = (req, res, next) => {
  // removed session add other protection here
  // const token = req.headers.authorization;
  const token = req.get('Authorization');
  // need to add token to Postman (token is shown in login)
  // Headers
    //Key = Authorization
    //Value = token without quotes, e.g.: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXI1Iiwicm9sZXMiOlsic2FsZXMiLCJtYXJrZXRpbmciXSwiaWF0IjoxNTQzNDI4NjM4LCJleHAiOjE1NDM0MzIyMzh9.eESKAp60t5YjlqKwx7vxusx-YYrz-z_DFXIzuIEycMk
  if (token) {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        res.status(401).json( { message: 'invalid token', err } );
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    res.status(401).json({ message: 'token not provided' });
  }
}