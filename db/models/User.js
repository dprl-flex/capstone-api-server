const db = require('../db');
const { Sequelize } = db;
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

const User = db.define(
  'user',
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'User must have a first name.',
        },
        lettersOnly(firstName) {
          const regexp = /^[A-Za-z]+$/;
          if (!regexp.test(firstName)) {
            throw new Error('First name must consist only of letters.');
          }
        },
      },
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'User must have a last name.',
        },
        lettersOnly(lastName) {
          const regexp = /^[A-Za-z]+$/;
          if (!regexp.test(lastName)) {
            throw new Error('Last name must consist only of letters.');
          }
        },
      },
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: 'Age must be an integer.',
        },
        notEmpty: {
          args: true,
          msg: 'User must have an age.',
        },
        min: {
          args: [0],
          msg: 'Age must be a positive integer.',
        },
        max: {
          args: 120,
          msg: 'User age should be less than 120 years.',
        },
      },
    },
    imgUrl: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'User must have a profile image URL.',
        },
        isUrl: {
          args: true,
          msg: 'Please enter a valid image URL.',
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'User must have an email address.',
        },
        isEmail: {
          args: true,
          msg: 'Please enter valid email address.',
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        requirements(password) {
          if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
              password
            )
          ) {
            console.log('ERROR THROWN ON PASSWORD');
            throw new Error(
              'Passwords must be at least 8 characters long, and contain a mix of lowercase/uppercase letters, numbers and special characters.'
            );
          }
        },
      },
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
    scopes: {
      login: {},
    },
    hooks: {
      beforeSave: function(user) {
        return bcrypt.hash(user.password, 5).then(hash => {
          user.password = hash;
          user.email = user.email.toLowerCase();
          return user;
        });
      },
      afterCreate: function(user) {
        return db.model('mood').create({ userId: user.id, value: 0.5 });
      },
    },
  }
);

User.authenticate = function(email, password) {
  email = email.toLowerCase();
  let _user;
  return this.scope('login')
    .findOne({ where: { email } })
    .then(user => {
      if (!user) {
        const error = new Error('user not found');
        error.status = 404;
        throw error;
      }
      _user = user;
      return bcrypt.compare(password, user.password);
    })
    .then(authenticated => {
      if (authenticated) {
        return jwt.encode(_user.id, process.env.SECRET);
      }
      const error = new Error('bad credentials');
      error.status = 401;
      throw error;
    });
};

User.exchangeTokenForUser = function(token) {
  const userId = jwt.decode(token, process.env.SECRET);
  return User.findByPk(userId).then(user => {
    if (!user) {
      const err = new Error('Bad Token');
      err.status = 401;
      throw err;
    } else {
      return user;
    }
  });
};

User.prototype.createRelationships = function() {
  return User.findAll({
    where: { familyId: this.familyId, id: { [Op.not]: this.id } },
  }).then(members => {
    if (members.length) {
      return Promise.all(
        members.map(member => {
          return Promise.all([
            db.model('relationship').create({
              userId: this.id,
              RelationshipId: member.id,
              type: 'relative',
              status: 0.5,
            }),
            db.model('relationship').create({
              userId: member.id,
              RelationshipId: this.id,
              type: 'relative',
              status: 0.5,
            }),
          ]);
        })
      );
    }
  });
};

User.signUp = async function(userData) {
  try {
    const newUser = await User.create(userData);
    if (userData.familyCode) {
      const family = await db
        .model('family')
        .findOne({ where: { code: userData.familyCode } });
      await newUser.update({ familyId: family.id });
    } else if (userData.family) {
      const family = await db.model('family').create(userData.family);
      await newUser.update({ familyId: family.id });
    }
    await newUser.createRelationships();
    return jwt.encode(newUser.id, process.env.SECRET);
  } catch (e) {
    throw e;
  }
};

module.exports = User;
