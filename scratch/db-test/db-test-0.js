'use strict';

const _ = require('underscore');
const pg = require('pg');
//  this is weird
var Chance = require('chance');
var chance = new Chance();

console.log('started...');

//TODO: this needs to come from a config file or the environment
var config = {
    user: 'postgres', //env var: PGUSER
    database: 'ffco', //env var: PGDATABASE
    password: 'strato69', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);
//console.dir(pool);

pool.on('error', function (error, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', error.message, error.stack);
});

//not available yet?
//var time = await pool.query('SELECT NOW()');
//console.dir(time);

pool.query('SELECT NOW()', function (error, result) {
    if (error) {
        console.error('error querying PostgreSQL', error);
    } else {
        console.dir(result);
    }
});

pool.query('select * from public."User"', function (error, result) {
    if (error) {
        console.error('error querying PostgreSQL', error);
    } else {
        console.dir(result);
    }
});

var randomUsers = _.map(_.range(100), function(item) {
    let user = {
        userName: chance.email(),
        firtsName: chance.first(),
        lastName: chance.last()
    };
    console.dir(user);
    return user;
});

const insertUserSQL = 'insert into public."User"("UserId", "UserName", "UserFirstName", "UserLastName") \
values (nextval(\'public."User_UserId_seq"\'), $1, $2, $3)';

_.each(randomUsers, function(item, index) {
    console.log(item);
    pool.query(insertUserSQL, [item.userName, item.firtsName, item.lastName], function(error, result) {
        if (error) {
            console.error('error inserting user into PostgreSQL', error);
        }
    })
});

//console.dir(randomUsers);

pool.end();

console.log('done!');

//  end