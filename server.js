const express = require('express');
const app = express();
const { dbSync } = require('./db');
const port = process.env.PORT || 3000;
const cors = require('cors');
const { User } = require('./db');
const io = require('socket.io');

//find logged in user and attach user to req.body
app.use((req, res, next) => {
  if (!req.headers.authorization) {
    return next();
  }
  User.exchangeTokenForUser(req.headers.authorization)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
});

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    const error = new Error('not logged in');
    error.status = 401;
    return next(error);
  }
  next();
};

app.use(cors());

//body-parsing

app.use(express.json());

//api
app.use('/api', require('./api'));

// Handle 404s
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//error handling
app.use((err, req, res, next) => {
  console.log('ERROR HANDLER');
  res.status(err.status || 500);
  res.send(err.message || 'Internal server error');
});

// start server
const server = dbSync().then(() => {
  app.listen(port, () => console.log(`listening on port ${port}`));
});

// const server = app.listen(port, () => console.log(`listening on port ${port}`));

// dbSync().then(() => {
//   app.listen(port, () => console.log(`listening on port ${port}`));
// });

const socketServer = io(server);

module.exports = { app, socketServer };
