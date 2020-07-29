const express = require('express');
const router = require('express').Router();
const Recipes = require('./recipes-model.js');
const Instructions = require('./instructions-model.js');
const Ingredients = require('./ingredients-model.js');

router.use(express.json());

const validateId = require('../middleware/validateRecipeById.js');

// GET - All recipes
router.get('/', (req, res) => {
  Recipes.find()
    .then((recipes) => {
      res.status(200).json({ data: recipes });
    })
    .catch((err) =>
      res.status(500).json({ message: 'Failed to get recipe list.' })
    );
});

// GET - A recipe by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  Recipes.findById(id).then((recipe) => {
    if (recipe) {
      res.status(200).json({ data: recipe });
    } else {
      res
        .status(404)
        .json({ message: 'Could not find a recipe with that id.' });
    }
  });
});

// GET - A recipe's ingredients by ID
router.get('/:id/ingredients', (req, res) => {
  const { id } = req.params;

  Ingredients.findByRecipe(id)
    .then((ingredients) => {
      res.status(200).json({ data: ingredients });
    })
    .catch((err) =>
      res.status(500).json({ message: 'unable to retrieve ingredients' })
    );
});

// GET - A recipe's instructions by ID
router.get('/:id/instructions', (req, res) => {
  const { id } = req.params;

  Instructions.findByRecipe(id)
    .then((instruction) => {
      console.log('instruction:', instruction);
    })
    .catch((err) => console.log(err));
});

// POST - A new recipe
router.post('/', (req, res) => {
  const recipeData = req.body;
  recipeData.user_id = req.jwt.subject;
  Recipes.add(recipeData)
    .then((recipe) => {
      res.status(201).json({ data: recipe });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to create a new recipe.' });
    });
});

// DELETE - A recipe by ID
router.delete('/:id', validateId, (req, res) => {
  Recipes.remove(req.params.id)
    .then((count) => {
      if (count) {
        res.status(204).json({ message: 'This recipe has been deleted.' });
      } else {
        res
          .status(404)
          .json({ message: 'Could not find a recipe with that id.' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to delete recipe' });
    });
});

module.exports = router;
