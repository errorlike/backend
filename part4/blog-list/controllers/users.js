const bcrypt = require('bcrypt');
const User = require('../models/user');
const usersRouter = require('express').Router();


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.json(users);
});

usersRouter.post('/', async (request, response) => {

  const { username, name, password } = request.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response
      .status(400)
      .json({ error: 'usrname must be unqiue' });
  }
  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);


  const user = new User({
    username,
    name,
    passwordHash
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
