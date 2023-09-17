import { Schema, model } from 'mongoose';
import { Recipe } from '../entities/recipe.js';

const recipeSchema = new Schema<Recipe>({
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
    type: {
      publicId: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
      url: { type: String },
    },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

recipeSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const RecipeModel = model('Recipe', recipeSchema, 'recipies');
