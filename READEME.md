# CAPSTONE

- create .env file and define DATABASE_URL
- npm i
- npm run seed:dev
- npm run start:dev
- npm test

#USING SOCKETS

- On client side, when you initialize your socket connection, include the following in your options:

extraHeaders: { authorization: token }

- You will need to get the token from AsyncStorage
- import { AsyncStorage } from 'react-native;
- AsyncStorage.getItem('token')
- It will return a promise in which the resonse is your user's auth token
