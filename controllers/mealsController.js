const mealsRouter = require('express').Router();
require('express-async-errors'); // permite eliminar los try-catch
const Meal = require('../models/meal');
const Pet = require('../models/pet');

mealsRouter.get('/', async (request, response) => {
  const meals = await Meal.find({})
    .populate('pet', { name: 1 })
    .populate('user', { username: 1, name: 1 });
  response.json(meals);
});

mealsRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.pet === undefined) {
    return response.status(400).json({ error: 'pet missing' });
  }
  if (body.user === undefined) {
    return response.status(400).json({ error: 'user missing' });
  }
  if (body.portionUnit === undefined) {
    return response.status(400).json({ error: 'portionUnit missing' });
  }
  if (body.portionQuantity === undefined) {
    return response.status(400).json({ error: 'portionQuantity missing' });
  }

  // find pet to save the new food in its food array
  const pet = await Pet.findById(body.pet);
  if (!pet) {
    return response.status(400).json({ error: 'pet not found' });
  }

  const meal = new Meal({
    pet: body.pet,
    dateTime: new Date(),
    user: body.user,
    portionUnit: body.portionUnit,
    portionQuantity: body.portionQuantity
  });

  const savedMeal = await meal.save();
  pet.meals = pet.meals.concat(meal._id);
  await pet.save();
  response.status(201).json(savedMeal);
});

module.exports = mealsRouter;
