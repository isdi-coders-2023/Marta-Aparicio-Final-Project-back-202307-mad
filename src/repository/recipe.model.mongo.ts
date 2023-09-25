import { Schema, model } from 'mongoose';
import { Recipe } from '../entities/recipe.js';

const recipeSchema = new Schema<Recipe>({
  name: {
    type: String,
  },
  category: {
    type: String,
  },

  ingredients: {
    type: String,
  },
  mode: {
    type: String,
  },

  img: {
    type: {
      publicId: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
      url: { type: String },
    },
    required: true,
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

export const RecipeModel = model('Recipe', recipeSchema, 'recipes');
