import { Schema, model } from 'mongoose';
import { Recipe } from '../entities/recipe.js';

const userSchema = new Schema<Recipe>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    unique: true,
  },

  ingredients: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const RecipeModel = model('Recipe', userSchema, 'recipies');
