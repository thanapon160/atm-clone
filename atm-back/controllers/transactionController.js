const { User, Transaction } = require('../models');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sequelize } = require('../models')
require('dotenv').config();

exports.withdrawal = async (req, res, next) => {
  try {
    const { amount, balance } = req.body
    await User.update({ balance }, { where: { id: req.user.id } })
    const withdrawal = await Transaction.create({
      type: 'WITHDRAWAL', amount, userId: req.user.id
    })
    res.status(200).json({
      message: "Withdrawal success", withdrawal
    })
  } catch (err) {
    next(err)
  }
}

exports.deposit = async (req, res, next) => {
  try {
    const { amount, balance } = req.body
    await User.update({ balance }, { where: { id: req.user.id } })
    const deposit = await Transaction.create({
      type: 'DEPOSIT', amount, userId: req.user.id
    })
    res.status(200).json({
      message: "Deposit success", deposit
    })
  } catch (err) {
    next(err)
  }
}