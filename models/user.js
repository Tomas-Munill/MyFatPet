const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  }
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject, options) => {
    if (options && options.populate) {
      // Incluir _id solo si es una operación de población
      returnedObject._id = document._id.toString();
    } else {
      // Excluir _id en otras operaciones
      delete returnedObject._id;
    }
    // Agregar id en todas las operaciones
    returnedObject.id = document._id.toString();
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model('User', userSchema);