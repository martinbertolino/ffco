'use strict;'

const genericQuery = require("./genericQuery");

module.exports = function (pool, app) {

    //  create a user
    app.post('/api/v1/user', function (request, response) {

        const insertSQL = 'insert into public."User"("UserId", "UserName", "UserFirstName", "UserLastName") \
            values (nextval(\'public."User_UserId_seq"\'), $1, $2, $3) returning "UserId"';
        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.userName, request.body.userFirstName, request.body.userLastName];

        genericQuery.queryOne(pool, insertSQL, paramsSQL, response, function (result) {
            return { "userId": result.rows[0].UserId };
        });
    });

    function mapRowColumnsToObject(row) {
        return {
            userId: row.UserId,
            userName: row.UserName,
            userFirstName: row.UserFirstName,
            userLastName: row.UserLastName
        };
    };

    //  get a user by name
    app.get('/api/v1/user/name/:name', function (request, response) {

        //TODO: we should probably sanitize the input here?  What does express do?
        genericQuery.queryOne(pool, 'select * from public."User" t where t."UserName"=$1', [request.params.name], response, function (result) {
            return mapRowColumnsToObject(result.rows[0]);
        });
    });

    //  get a user by id
    app.get('/api/v1/user/id/:id', function (request, response) {

        genericQuery.queryOne(pool, 'select * from public."User" t where t."UserId"=$1', [request.params.id], response, function (result) {
            return mapRowColumnsToObject(result.rows[0]);
        });
    });

    // get all users
    app.get('/api/v1/user/', function (request, response) {

        genericQuery.queryMany(pool, 'select * from public."User"', [], response, function (item) {
            return mapRowColumnsToObject(item);
        });
    });

    // update a user by id
    app.put('/api/v1/user/id/:id', function (request, response) {

        const updateSQL = 'update public."User" set "UserName"=$1, "UserFirstName"=$2, "UserLastName"=$3 where "UserId"=$4 returning "UserId"';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.userName, request.body.userFirstName, request.body.userLastName, request.params.id];

        genericQuery.queryOne(pool, updateSQL, paramsSQL, response, function (result) {
            return { "userId": result.rows[0].UserId };
        });
    });

    // delete a user by id
    app.delete('/api/v1/user/id/:id', function (request, response) {

        const deleteSQL = 'delete from public."User" where "UserId"=$1 returning "UserId"';

        //TODO: need to improve the validation of the inpute data
        const paramsSQL = [request.params.id];

        genericQuery.queryOne(pool, deleteSQL, paramsSQL, response, function (result) {
            return { "userId": result.rows[0].UserId };
        });
    });
};

//  end