const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.username === undefined) {
    return response.status(400).json({ error: 'username missing' });
  }
  if (body.password === undefined) {
    return response.status(400).json({ error: 'password missing' });
  }

  const user = await User.findOne({ username: body.username });
  if (!user) {
    return response.status(401).json({ error: 'invalid username' });
  }

  const passwordCorrect = await bcryptjs.compare(
    body.password,
    user.passwordHash
  );
  if (!passwordCorrect) {
    return response.status(401).json({ error: 'invalid password' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
