const { User } = require('../models');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sequelize } = require('../models')
require('dotenv').config();

exports.myAccount = async (req, res, next) => {
  try {
    res.status(200).json({
      user: {
        name: req.user.name,
        balance: req.user.balance,
      }
    })
  } catch (err) {
    next(err)
  }
}

exports.protect = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    };
    if (!token) return res.status(401).json({ message: 'you are unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ where: { cardId: payload.cardId } });
    if (!user) return res.status(400).json({ message: 'user not found' });
    req.user = user;
    req.payload = payload;
    next();
  } catch (err) {
    next(err)
  }
};

exports.login = async (req, res, next) => {
  try {
    const { cardId, pin } = req.body;
    if (cardId === undefined || cardId.trim() === '') return res.status(400).json({ message: 'email is required' })
    if (pin === undefined) return res.status(400).json({ message: 'pin is required' })
    const user = await User.findOne({ where: { cardId } });
    if (!user) return res.status(400).json({ message: 'user or pin incorrect' });
    if (pin !== user.passcode) return res.status(400).json({ message: 'pin incorrect, please try again'})
    const payload = { cardId: user.cardId ,name: user.name, balance: user.balance }
    // const token = jwt.sign(payload, 'secretkey', { expiresIn: 1000000000000000 });
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: +process.env.JWT_EXPIRES_IN }); // env file required
    res.status(200).json({ message: 'login success', token })
  } catch (err) {
    next(err)
  }
};