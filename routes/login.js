'use strict';
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
require('dotenv').config();
const model = require('../db/model').auth;
const log = console.log;

router.post('/', async (req, res) => {
    const {phone, password} = req.body;
    model.findOne({phone: phone})
        .then(async (user) => {
            if (user) {
                    if(!user.verified){
                        return res.status(403).send('wrong password');
                    }
                     await bcrypt.compare(password, user.password)
                    .then(async (passwordMatched) => {
                        if (passwordMatched) {
                            const token = await jwt.sign({name: user.name, phone: phone}, process.env.secretKey);
                            log(chalk.magenta(`${user.name} is logged in.`))
                            res.header('auth_token', token);
                            return res.json({auth_token: token,name: user.name});
                        } else {
                            return res.send('wrong password');
                        }
                    })
                    .catch(err => {
                        log(chalk.red(`err--->${err}`));
                        return res.send(err);
                    })
            } else {
                log(chalk.green(`user-->${user}`))
                return res.send(`no user with this phone`);
            }
        })
        .catch(err => {
            log(chalk.green(`user-->${err}`));
            return res.send(err);
        })
})

module.exports = router;
