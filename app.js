'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db/connections');
const chalk = require('chalk');
const app = express();
const log = console.log;
const newUser = require('./routes/newUser');
const verify = require('./routes/verify');
const login = require('./routes/login');
const resendcode = require('./routes/sendVerificationCode');
const checkToken = require('./middleware/checkToken');
const updatepassword = require('./routes/updatePassword');

connection();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(checkToken);
app.use('/signup', newUser);
app.use('/verify', verify);
app.use('/login', login);
app.use('/resendcode', resendcode);
app.use('/updatepassword',checkToken, updatepassword);
app.listen(3000, () => log(chalk.magenta(`app is running at port 3000.`)));
