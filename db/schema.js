'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userCreatedOn: {
        type: Date,
        default: Date.now()
    },
    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = {
    userSchema: userSchema
}
