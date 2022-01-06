const res = require('dotenv').config();

const REQUIRED_ENVIRONMENT_VARIABLES = ['DB_URL', 'TEST_DB_URL', 'PORT', 'SECRET']

function checkConfigValidity() {
    if (res.error) {
        throw res.error;
    }

    for (const variable of REQUIRED_ENVIRONMENT_VARIABLES) {
        if (!(variable in res.parsed)) {
            throw new Error(`${variable} is not defined in .env`);
        }
    }
}

checkConfigValidity()

const DB_URL = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URL
    : process.env.DB_URL

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    DB_URL,
}