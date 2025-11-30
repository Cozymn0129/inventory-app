const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');

router.get('/', itemsController.list);
router.get('/new', itemsController.newForm);
router.post('/', itemsController.create);
router.get('/:id', itemsController.show);
router.get('/:id/edit', itemsController.editForm);
router.put('/:id', itemsController.update);
router.delete('/:id', itemsController.delete);

module.exports = router;
