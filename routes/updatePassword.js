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
    log(chalk.magenta(`token---->${req}`))
    const {
        phone,
        password
    } = req.body;
    let salt = await bcrypt.genSalt();
    let newPassword = await bcrypt.hash(password, salt);
    model.updateOne({
            phone: phone
        }, {
            password: newPassword
        })
        .then(resp => {
            log(chalk.blue(`password of ${phone} has been updated.`));
            model.findOne({
                    phone: phone
                })
                .then(async (user) => {
                    let token = await jwt.sign({
                        phone: user.phone,
                        name: user.name
                    }, process.env.secretKey);
                    return res.json({
                        auth_token: token,
                        phone: user.phone,
                        name: user.name
                    });
                }).catch(err => log(chalk.red(`err---->${err}`)))
        }).catch(err => log(chalk.red(`err---->${err}`)))
})

module.exports = router;