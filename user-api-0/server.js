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

//  create a user
app.post('/api/v1/user', function (request, response) {

    const insertUserSQL = 'insert into public."User"("UserId", "UserName", "UserFirstName", "UserLastName") \
        values (nextval(\'public."User_UserId_seq"\'), $1, $2, $3) returning "UserId"';
    //TODO: need to improve the validation of the input data
    const paramsSQL = [request.body.userName, request.body.userFirstName, request.body.userLastName];

    genericQuery.queryOne(pool, insertUserSQL, paramsSQL, response, function (result) {
        return { "userId": result.rows[0].UserId };
    });
});

//  get a user by name
app.get('/api/v1/user/name/:name', function (request, response) {

    //TODO: we should probably sanitize the input here?  What does express do?
    genericQuery.queryOne(pool, 'select * from public."User" t where t."UserName"=$1', [request.params.name], response, function (result) {
        return {
            userId: result.rows[0].UserId,
            userName: result.rows[0].UserName,
            userFirstName: result.rows[0].UserFirstName,
            userLastName: result.rows[0].UserLastName
        };
    });
});

//  get a user by id
app.get('/api/v1/user/id/:id', function (request, response) {

    genericQuery.queryOne(pool, 'select * from public."User" t where t."UserId"=$1', [request.params.id], response, function (result) {
        return {
            userId: result.rows[0].UserId,
            userName: result.rows[0].UserName,
            userFirstName: result.rows[0].UserFirstName,
            userLastName: result.rows[0].UserLastName
        };
    });
});

// get all users
app.get('/api/v1/user/', function (request, response) {

    genericQuery.queryMany(pool, 'select * from public."User"', [], response, function (item) {
        return {
            userId: item.UserId,
            userName: item.UserName,
            userFirstName: item.UserFirstName,
            userLastName: item.UserLastName
        };
    });
});

// update a user by id
app.put('/api/v1/user/id/:id', function (request, response) {

    const updateUserSQL = 'update public."User" set "UserName"=$1, "UserFirstName"=$2, "UserLastName"=$3 where "UserId"=$4 returning "UserId"';

    //TODO: need to improve the validation of the input data
    const paramsSQL = [request.body.userName, request.body.userFirstName, request.body.userLastName, request.params.id];

    genericQuery.queryOne(pool, updateUserSQL, paramsSQL, response, function (result) {
        return { "userId": result.rows[0].UserId };
    });
});

// delete a user by id
app.delete('/api/v1/user/id/:id', function (request, response) {

    const deleteUserSQL = 'delete from public."User" where "UserId"=$1 returning "UserId"';

    //TODO: need to improve the validation of the inpute data
    const paramsSQL = [request.params.id];

    genericQuery.queryOne(pool, deleteUserSQL, paramsSQL, response, function (result) {
        return { "userId": result.rows[0].UserId };
    });
});

app.listen(3000, function () {
    console.log('user api ready.');
});

//so the program will not close instantly
process.stdin.resume();

function exitHandler(options, err) {
    if (options.cleanup) {
        console.log('performing cleanup');
        pool.end();
    }
    if (err) {
        console.log(err.stack);
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
