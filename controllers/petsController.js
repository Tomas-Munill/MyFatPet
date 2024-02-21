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
