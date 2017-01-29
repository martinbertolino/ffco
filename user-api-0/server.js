'use strict;'

const express = require('express');
//const router = express.Router();
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pg = require('pg');
const async = require('async');

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
    //TODO: need to improve the validation of the inpute data
    const paramsSQL = [request.body.userName, request.body.userFirstName, request.body.userLastName];

    pool.query(insertUserSQL, paramsSQL, function (error, result) {
        if (error) {
            console.error('error inserting user into PostgreSQL', error);
            response.sendStatus(500);
        } else {
            if (result.rows.length === 1) {
                response.status(200).json({ "userId": result.rows[0].UserId });
            } else {
                console.error(`error inserting user into PostgreSQL, too many rows returned: ${result.rows.length}`);
                response.sendStatus(500);
            }
        }
    });
});

//  get a user by name
app.get('/api/v1/user/name/:name', function (request, response) {

    //TODO: we should probably sanitize the input here?  What does express do?
    pool.query('select * from public."User" t where t."UserName"=$1', [request.params.name], function (error, result) {
        if (error) {
            console.error('error querying PostgreSQL', error);
            response.sendStatus(500);
        } else {
            if (result.rows.length === 0) {
                response.status(404).json({ error: "User.UserName not found" });
            } else if (result.rows.length === 1) {
                const userData = {
                    userId: result.rows[0].UserId,
                    userName: result.rows[0].UserName,
                    userFirstName: result.rows[0].UserFirstName,
                    userLastName: result.rows[0].UserLastName
                };
                response.status(200).json(userData);
            } else {
                console.error(`error querying PostgreSQL, too many rows returned: ${result.rows.length}`);
                response.sendStatus(500);
            }
        }
    });
});

//  get a user by id
app.get('/api/v1/user/id/:id', function (request, response) {

    //TODO: we should probably sanitize the input here?  What does express do?
    pool.query('select * from public."User" t where t."UserId"=$1', [request.params.id], function (error, result) {
        if (error) {
            console.error('error querying PostgreSQL', error);
            response.sendStatus(500);
        } else {
            if (result.rows.length === 0) {
                response.status(404).json({ error: "User.UserId not found" });
            } else if (result.rows.length === 1) {
                let userData = {
                    userId: result.rows[0].UserId,
                    userName: result.rows[0].UserName,
                    userFirstName: result.rows[0].UserFirstName,
                    userLastName: result.rows[0].UserLastName
                };
                response.status(200).json(userData);
            } else {
                console.error(`error querying PostgreSQL, too many rows returned: ${result.rows.length}`);
                response.sendStatus(500);
            }
        }
    });
});

// get all users
app.get('/api/v1/user/', function (request, response) {

    pool.query('select * from public."User"', function (error, result) {
        if (error) {
            console.error('error querying PostgreSQL', error);
            response.sendStatus(500);
        } else {
            async.waterfall([
                (callback) => {
                    async.map(result.rows, (item, cb) => {
                        cb (null, {
                            userId: item.UserId,
                            userName: item.UserName,
                            userFirstName: item.UserFirstName,
                            userLastName: item.UserLastName
                        });
                    }, (error, result) => {
                        callback(null, result);
                    });
                }
            ], (error, result) => {
                response.status(200).json(result);
            });
        };
    });
});

// update a user by id
app.put('/api/v1/user/id/:id', function (request, response) {

    const updateUserSQL = 'update public."User" set "UserName"=$1, "UserFirstName"=$2, "UserLastName"=$3 where "UserId"=$4';

    //TODO: need to improve the validation of the input data
    const paramsSQL = [request.body.userName, request.body.userFirstName, request.body.userLastName, request.params.id];

    pool.query(updateUserSQL, paramsSQL, function (error, result) {
        if (error) {
            console.error('error updating user in PostgreSQL', error);
            response.sendStatus(500);
        } else {
            if (result.rowCount === 0) {
                response.status(404).json({ error: "User.UserId not found" });
            } else if (result.rowCount === 1) {
                response.sendStatus(200);
            } else {
                console.error(`error updating PostgreSQL, too many rows updated: ${result.rowCount}`);
                response.sendStatus(500);
            }
        }
    });
});

// delete a user by id
app.delete('/api/v1/user/id/:id', function (request, response) {

    const deleteUserSQL = 'delete from public."User" where "UserId"=$1';

    //TODO: need to improve the validation of the inpute data
    const paramsSQL = [request.params.id];

    pool.query(deleteUserSQL, paramsSQL, function (error, result) {
        if (error) {
            console.error('error deleting user in PostgreSQL', error);
            response.sendStatus(500);
        } else {
            if (result.rowCount === 0) {
                response.status(404).json({ error: "User.UserId not found" });
            } else if (result.rowCount === 1) {
                response.sendStatus(200);
            } else {
                console.error(`error deleting PostgreSQL, too many rows deleted: ${result.rowCount}`);
                response.sendStatus(500);
            }
        }
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
