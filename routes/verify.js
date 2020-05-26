'use strict';
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const twilio = require('twilio')(process.env.accountSid, process.env.authToken);
require('dotenv').config();
const model = require('../db/model').auth;
const log = console.log;

router.post('/', (req, res) => {
    const {
        phone,
        name,
        code
    } = req.body;
    Promise.resolve(twilio.verify.services(process.env.verifySid).verificationChecks
            .create({
                code: code,
                to: `+91${phone}`
            }))
        .then(async (result) => {
            console.log('result---->', result);
            if (result.valid) {
                await model.updateOne({
                    phone: phone
                }, {
                    verified: true
                });
                const token = await jwt.sign({
                    name: name,
                    phone: phone
                }, process.env.secretKey);
                return res.json({
                    auth_token: token
                });
            } else {
                return res.status(422).send('invalid code')
            }
        })
        .catch(err => {
            log(chalk.red(`err--->${err}`));
            return res.send(err);
        })
})

module.exports = router;