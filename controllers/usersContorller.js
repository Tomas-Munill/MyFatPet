const usersRouter = require('express').Router();
const bcryptjs = require('bcryptjs');
require('express-async-errors');

const User = require('../models/user');
const middleware = require('../utils/middleware');

usersRouter.post('/', async (request, response) => {
  const body = request.body;
  if (body.password === undefined) {
    return response.status(400).json({ error: 'password missing' });
  }
  if (body.password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password is less than 3 characters' });
  }

  const saltRounds = 10;
  const passwordHash = await bcryptjs.hash(request.body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.get('/', middleware.userExtractor, async (request, response) => {
  const users = await User.find({});
  response.status(200).json(users);
});

module.exports = usersRouter;
