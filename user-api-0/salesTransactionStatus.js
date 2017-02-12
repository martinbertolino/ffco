'use strict;'

const genericQuery = require("./genericQuery");

module.exports = function (pool, app) {

    //  create a sales transaction status
    app.post('/api/v1/salesTransactionStatus', function (request, response) {

        const insertSQL = 'insert into public."SalesTransactionStatus"( \
            "SalesTransactionStatusId", "SalesTransactionStatusName", "SalesTransactionStatusDescription") \
            values (nextval(\'public."SalesTransactionStatus_SalesTransactionStatusId_seq"\'), $1, $2) returning "SalesTransactionStatusId"';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.salesTransactionStatusName, request.body.salesTransactionStatusDescription];

        genericQuery.queryOne(pool, insertSQL, paramsSQL, response, function (result) {
            return { "salesTransactionStatusId": result.rows[0].SalesTransactionStatusId };
        });
    });

    function mapRowColumnsToObject(row) {
        return {
            salesTransactionStatusId: row.SalesTransactionStatusId,
            salesTransactionStatusName: row.SalesTransactionStatusName,
            salesTransactionStatusDescription: row.SalesTransactionStatusDescription
        };
    };

    //  get a sales transaction status by name
    app.get('/api/v1/salesTransactionStatus/name/:name', function (request, response) {

        //TODO: we should probably sanitize the input here?  What does express do?
        genericQuery.queryOne(pool, 'select * from public."SalesTransactionStatus" t where t."SalesTransactionStatusName"=$1', [request.params.name], response, function (result) {
            return mapRowColumnsToObject(result.rows[0]);
        });
    });

    //  get a sales transaction status by id
    app.get('/api/v1/salesTransactionStatus/id/:id', function (request, response) {

        genericQuery.queryOne(pool, 'select * from public."SalesTransactionStatus" t where t."SalesTransactionStatusId"=$1', [request.params.id], response, function (result) {
            return mapRowColumnsToObject(result.rows[0]);
        });
    });

    // get all sales transaction statuss
    app.get('/api/v1/salesTransactionStatus/', function (request, response) {

        genericQuery.queryMany(pool, 'select * from public."SalesTransactionStatus"', [], response, function (item) {
            return mapRowColumnsToObject(item);
        });
    });

    // update a sales transaction status by id
    app.put('/api/v1/salesTransactionStatus/id/:id', function (request, response) {

        const updateSQL = 'update public."SalesTransactionStatus" set "SalesTransactionStatusName"=$1, "SalesTransactionStatusDescription"=$2 where "SalesTransactionStatusId"=$3 returning "SalesTransactionStatusId"';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.salesTransactionStatusName, request.body.salesTransactionStatusDescription, request.params.id];

        genericQuery.queryOne(pool, updateSQL, paramsSQL, response, function (result) {
            return { "salesTransactionStatusId": result.rows[0].SalesTransactionStatusId };
        });
    });

    // delete a sales transaction status by id
    app.delete('/api/v1/salesTransactionStatus/id/:id', function (request, response) {

        const deleteSQL = 'delete from public."SalesTransactionStatus" where "SalesTransactionStatusId"=$1 returning "SalesTransactionStatusId"';

        //TODO: need to improve the validation of the inpute data
        const paramsSQL = [request.params.id];

        genericQuery.queryOne(pool, deleteSQL, paramsSQL, response, function (result) {
            return { "salesTransactionStatusId": result.rows[0].SalesTransactionStatusId };
        });
    });
};

//  end