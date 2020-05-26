'use strict';
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const twilio = require('twilio')(process.env.accountSid, process.env.authToken);
require('dotenv').config();
const model = require('../db/model').auth;
const log = console.log;

router.post('/', async (req, res) => {
    const {phone} = req.body;
    model.findOne({phone: phone})
        .then(async (doc) => {
            if (doc) {
                await twilio.verify.services(process.env.verifySid)
                    .verifications
                    .create({to: `+91${phone}`, channel: 'sms'})
                    .then(code => {
                        log(chalk.green(`verification code--->${code}`));
                        return res.status(200).send('verification code has been sent')
                    })
                    .catch(err => {
                        log(chalk.red(`err--->${err}`));
                        return res.send(err);
                    })
            } else {
                log(chalk.red('warning: ') + chalk.magenta(`no account with this phone.`))
                return res.send('no account with this phone')
            }
        })
        .catch(err => {
            log(chalk.red(`err---->${err}`));
            return res.send(err);
        })
})

module.exports = router;
