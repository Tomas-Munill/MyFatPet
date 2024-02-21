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

  // buscar mascota para guardar la nueva comida en su array de comidas
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

  // guardar la nueva comida el array de comidas de la mascota
  pet.meals = pet.meals.concat(meal._id);
  await pet.save();

  response.status(201).json(savedMeal);
});

mealsRouter.delete('/:id', async (request, response) => {
  const tokenUser = request.user;
  const id = request.params.id;
  if (id.length !== 24) {
    return response.status(400).json({ error: 'malformed id' });
  }
  const meal = await Meal.findById(id);
  if (!meal) {
    return response.status(404).json({ error: 'meal not found' });
  }
  if (meal.user.toString() !== tokenUser.id) {
    return response.status(401).json({ error: 'cannot delete a resource created by another user' });
  }

  // eliminar la comida en el array de comidas de la mascota
  await Pet.updateOne(
    { _id: meal.pet },
    { $pull: { meals: meal._id } }
  );

  await meal.deleteOne();
  response.status(204).end();  
});

module.exports = mealsRouter;
