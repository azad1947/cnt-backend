'use strict';

const mongoose = require('mongoose');
const userSchema = require('./schema').userSchema;

const auth = mongoose.model('auth', userSchema);

module.exports = {
    auth: auth,
}
