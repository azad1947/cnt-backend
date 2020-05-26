'use strict';
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const chalk = require('chalk');
require('dotenv').config();
const twilio = require('twilio')(process.env.accountSid, process.env.authToken);
const newUser = require('../db/joiSchema').newUser;
const model = require('../db/model').auth;
const log = console.log;


router.post('/', async (req, res) => {
    const {name, phone, password} = _.get(req, 'body', {});
    let validation = await newUser.validate({name: name, phone: phone, password: password});
    if (!validation.error) {
        model.findOne({phone: phone})
            .then(async (doc) => {
                if (!doc) {
                    let salt = await bcrypt.genSalt();
                    let hashedPassword = await bcrypt.hash(password, salt);
                    let user = new model({
                        name: name,
                        phone: phone,
                        password: hashedPassword
                    });
                    user.save()
                        .then((new_user) => {
                            return twilio.verify.services(process.env.verifySid)
                                .verifications
                                .create({to: `+91${phone}`, channel: 'sms'});
                        })
                        .then(verification_code => {
                            log(chalk.red(`new: ` + chalk.blue('new user has been saved to db and verification code has been sent.')));
                            return res.status(200).send('verification code is sent.');
                        })
                        .catch(err => {
                            log(chalk.red('err--->'), err);
                            model.deleteOne({phone: phone})
                                .then(deletedPhone => {
                                    return res.status(403).send('invalid phone number.');
                                });
                        })
                } else {
                    log(chalk.magenta(`warning: `) + chalk.red(`${phone} already exists.`))
                    return res.status(403).send('phone number already exist.');
                }
            })
    } else {
        log(chalk.red(`validation error--->`) + validation.error.message);
        return res.status(403).send(validation.error.message);
    }
})

module.exports = router;
