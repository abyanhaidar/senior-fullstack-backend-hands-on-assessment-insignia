const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(req, res, next) {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();

  res.status(201).json({ message: 'User has been created', userId: user._id });
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid Credentials' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: 'Invalid Credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
  
}

async function getAll(req, res, next) {
  const users = await User.find({}, '-password');

  res.json(users);
}

async function getOne(req, res, next) {
  const user = await User.findById(req.params.id, '-password');
  if (!user){
    return res.status(404).json({ message: `User id ${req.params.id} not found` });
  }
  
  res.json(user);
}

async function update(req, res, next) {
  const updates = req.body;

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!user) {
    return res.status(404).json({ message: `User id ${req.params.id} not found` });
  }

  res.json({ message: 'User data is updated', user });
}

async function remove(req, res, next) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: `User id ${req.params.id} not found` });
  }
  res.json({ message: 'User deleted' });
}

module.exports = {
  register,
  login,
  getAll,
  getOne,
  update,
  remove,
};
