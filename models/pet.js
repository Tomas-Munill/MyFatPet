const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  meals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
    },
  ],
});

petSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Pet', petSchema);
