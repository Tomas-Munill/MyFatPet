const petsRouter = require('express').Router();
require('express-async-errors');
const Pet = require('../models/pet');

petsRouter.get('/', async (request, response) => {
  const pets = await Pet.find({}).populate('meals', {
    dateTime: 1,
    portionUnit: 1,
    portionQuantity: 1,
  });
  response.json(pets);
});

petsRouter.get('/todays-meals', async (request, response) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const pets = await Pet.find({})
    .populate({
      path: 'meals',
      match: {
        dateTime: { $gte: startOfDay, $lte: endOfDay },
      },
      select: 'dateTime portionUnit portionQuantity user',
      populate: {
        path: 'user',
        select: 'username name'
      }
    });

  response.json(pets);
});

petsRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' });
  }

  const pet = new Pet({
    name: body.name,
    meals: [],
  });

  const savedPet = await pet.save();
  response.status(201).json(savedPet);
});

module.exports = petsRouter;
