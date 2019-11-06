'use strict'

require('dotenv').config() /* create my environments vars */

const { Pool } = require('pg')
const {
    DB_USER,
    DB_PASS,
    DB_HOST,
    DB_PORT,
    DB_NAME
} = process.env

//const posgresUrl = `postgresql://postgres:abcd.1234@localhost:5432/postgres`

const posgresUrl = `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
const pool = new Pool({connectionString: posgresUrl})

module.exports = pool