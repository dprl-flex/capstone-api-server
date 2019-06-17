const express = require('express');
const app = express();
const { dbSync } = require('./db');
const port = process.env.PORT || 3000;
const cors = require('cors');
const { User } = require('./db');
const io = require('socket.io');

let room;
let conUser;

//find logged in user and attach user to req.body
app.use((req, res, next) => {
  if (!req.headers.authorization) {
    return next();
  }
  User.exchangeTokenForUser(req.headers.authorization)
    .then(user => {
      req.user = user;
      conUser = req.user.id;
      if (req.user.familyId) {
        room = req.user.familyId;
      }
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

const server = app.listen(port, () => console.log(`listening on port ${port}`));

const socketServer = io(server);

socketServer.on('connect', socket => {
  console.log('SOCKET INFO', socket.id, conUser);
  socket.join(conUser);
  socket.to(conUser).emit(`hello`, { message: 'Hi!' });
  if (room) {
    socket.join(room);
  }
  //When a new event is created, send a message to all other users to trigger a fetch events
  socket.on('new_event', () => socket.to(room).broadcast.emit('new_event'));
  //location request with a users object { target: [target user's id], requester: [requester's user id] }
  socket.on('request_loc', users => {
    socket.to(users.target).emit('request_loc', users.requester);
    console.log('LOCATION REQUEST SOCKET EVENT', users.target, users.requester);
  });
  //location respond with the id of the user who requested it, and the coordinates in an object
  socket.on('response_location', response => {
    socket.to(response.requester).emit('response_location', response.coords);
    console.log(
      'LOCATION RESPONSE SOCKET EVENT',
      response.requester,
      response.coords
    );
  });
  //when a new alert is created use this event to trigger client to fetch alerts
  socket.on('new_alert', () => {
    socket.to(room).broadcast.emit('new_alert');
    console.log('NEW ALERT SOCKET EVENT');
  });
  //new poll
  socket.on('new_poll', () => {
    socket.to(room).broadcast.emit('new_poll');
    console.log('NEW POLL SOCKET EVENT');
  });
  //new vote
  socket.on('new_vote', () => {
    socket.to(room).broadcast.emit('new_vote');
    console.log('NEW VOTE SCKET EVENT');
  });
  //poll ended
  socket.on('poll_ended', () => socket.to(room).broadcast.emit('poll_ended'));
  //new family member
  socket.on('new_family_member', () => {
    socket.to(room).broadcast.emit('new_family_member');
    console.log('NEW FAMILY MEMBER SOCKET EVENT');
  });
});

module.exports = { socketServer, app };
