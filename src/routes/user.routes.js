const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

router.post(
  '/users',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  userController.register
);

router.post('/login', userController.login);

router.get('/users', auth, userController.getAll);
router.get('/users/:id', auth, userController.getOne);
router.put(
  '/users/:id',
  [
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 }),
  ],
  validate,
  userController.update
);

router.delete('/users/:id', auth, userController.remove);

module.exports = router;
