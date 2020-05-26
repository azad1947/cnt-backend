'use strict';

const Joi = require("@hapi/joi");
const validateUser = Joi.object({
    name: Joi.string()
        .required('required'),
    phone: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required('required'),
    password: Joi.string()
        .min(6)
        .required('required')
})

module.exports = {
    newUser: validateUser
};
