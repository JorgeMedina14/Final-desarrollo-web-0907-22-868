const session = require('express-session');

const sessionConfig = session({
  secret: 'mi-secreto-super-seguro-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
});

module.exports = sessionConfig;
