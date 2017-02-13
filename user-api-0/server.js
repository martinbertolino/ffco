'use strict;'

const express = require('express');
//const router = express.Router();
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pg = require('pg');
const genericQuery = require("./genericQuery");

console.log('started...');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//this comes mostly from the environment for security reasons, don't hardcode in source
const config = {
    user: process.env.PGUSER, //env var: PGUSER
    database: process.env.PGDATABASE, //env var: PGDATABASE
    password: process.env.PGPASSWORD, //env var: PGPASSWORD
    host: process.env.PGHOST, // Server hosting the postgres database
    port: process.env.PGPORT, //env var: PGPORT
    max: process.env.PGMAXPOOLSIZE, // max number of clients in the pool
    idleTimeoutMillis: process.env.PGIDLETIMEOUTMS, // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
const pool = new pg.Pool(config);

pool.on('error', function (error, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', error.message, error.stack);
});

// For details see the following issue https://github.com/brianc/node-pg-types/issues/28
// Fix for parsing of numeric fields
var types = require('pg').types
types.setTypeParser(1700, 'text', parseFloat);

const userApi = require('./user')(pool, app);
const productGroupingApi = require('./productGrouping')(pool, app);
const productUnitApi = require('./productUnit')(pool, app);
const productApi = require('./product')(pool, app);
const salesTransactionStatusApi = require('./salesTransactionStatus')(pool, app);
const salesTransactionApi = require('./salesTransaction')(pool, app);

app.listen(3000, function () {
    console.log('user api ready.');
});

//so the program will not close instantly
process.stdin.resume();

function exitHandler(options, error) {
    if (options.cleanup) {
        console.log('performing cleanup');
        pool.end();
    }
    if (error) {
        console.log(error.message);
        console.log(error.stack);
    }
    if (options.exit) {
        process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

console.log('done!');

// end
