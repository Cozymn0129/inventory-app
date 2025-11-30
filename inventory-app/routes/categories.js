const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');

router.get('/', categoriesController.list);
router.get('/new', categoriesController.newForm);
router.post('/', categoriesController.create);
router.get('/:id/edit', categoriesController.editForm);
router.put('/:id', categoriesController.update);
router.delete('/:id', categoriesController.delete);

module.exports = router;
