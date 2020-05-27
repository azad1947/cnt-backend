'use strict';
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const twilio = require('twilio')(process.env.accountSid, process.env.authToken);
require('dotenv').config();
const model = require('../db/model').auth;
const log = console.log;

router.post('/', async (req, res) => {
    const {
        phone,
        password
    } = req.body;
    let salt = await bcrypt.genSalt();
    let newPassword = await bcrypt.hash(password, salt);
    model.updateOne({phone:phone},{password: newPassword})
    .then(user=>{
        log(chalk.blue(`password of ${phone} has been updated.`));
        return res.send('password changed successfully.')
    }).catch(err=>log(chalk.red(`err---->${err}`)))
})

module.exports = router;