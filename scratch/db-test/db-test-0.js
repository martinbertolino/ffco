'use strict';

const _ = require('underscore');
const pg = require('pg');
//  this is weird
var Chance = require('chance');
var chance = new Chance();

console.log('started...');

//this comes mostly from the environment for security reasons, don't hardcode in source
var config = {
    user: process.env.PGUSER, //env var: PGUSER
    database: process.env.PGDATABASE, //env var: PGDATABASE
    password: process.env.PGPASSWORD, //env var: PGPASSWORD
    host: process.env.PGHOST, // Server hosting the postgres database
    port: process.env.PGPORT, //env var: PGPORT
    max: process.env.PGMAXPOOLSIZE, // max number of clients in the pool
    idleTimeoutMillis: process.env.PGIDLETIMEOUTMS, // how long a client is allowed to remain idle before being closed
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

var randomUsers = _.map(_.range(5), function(item) {
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