'use strict;'

const genericQuery = require("./genericQuery");

module.exports = function (pool, app) {

    //  create a product grouping
    app.post('/api/v1/productGrouping', function (request, response) {

        const insertSQL = 'insert into public."ProductGrouping"( \
            "ProductGroupingId", "ProductGroupingName", "ProductGroupingDescription", "ProductGroupingOrder") \
            values (nextval(\'public."ProductGrouping_ProductGroupingId_seq"\'), $1, $2, $3) returning "ProductGroupingId"';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.productGroupingName, request.body.productGroupingDescription, request.body.productGroupingOrder];

        genericQuery.queryOne(pool, insertSQL, paramsSQL, response, function (result) {
            return { "productGroupingId": result.rows[0].ProductGroupingId };
        });
    });

    function mapRowColumnsToObject(row) {
        return {
            productGroupingId: row.ProductGroupingId,
            productGroupingName: row.ProductGroupingName,
            productGroupingDescription: row.ProductGroupingDescription,
            productGroupingOrder: row.ProductGroupingOrder
        };
    };

    //  get a product grouping by name
    app.get('/api/v1/productGrouping/name/:name', function (request, response) {

        //TODO: we should probably sanitize the input here?  What does express do?
        genericQuery.queryOne(pool, 'select * from public."ProductGrouping" t where t."ProductGroupingName"=$1', [request.params.name], response, function (result) {
            return mapRowColumnsToObject(result.rows[0]);
        });
    });

    //  get a product grouping by id
    app.get('/api/v1/productGrouping/id/:id', function (request, response) {

        genericQuery.queryOne(pool, 'select * from public."ProductGrouping" t where t."ProductGroupingId"=$1', [request.params.id], response, function (result) {
            return mapRowColumnsToObject(result.rows[0]);
        });
    });

    // get all product groupings
    app.get('/api/v1/productGrouping/', function (request, response) {

        genericQuery.queryMany(pool, 'select * from public."ProductGrouping"', [], response, function (item) {
            return mapRowColumnsToObject(item);
        });
    });

    // update a product grouping by id
    app.put('/api/v1/productGrouping/id/:id', function (request, response) {

        const updateSQL = 'update public."ProductGrouping" set "ProductGroupingName"=$1, "ProductGroupingDescription"=$2, "ProductGroupingOrder"=$3 where "ProductGroupingId"=$4 returning "ProductGroupingId"';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.productGroupingName, request.body.productGroupingDescription, request.body.productGroupingOrder, request.params.id];

        genericQuery.queryOne(pool, updateSQL, paramsSQL, response, function (result) {
            return { "productGroupingId": result.rows[0].ProductGroupingId };
        });
    });

    // delete a product grouping by id
    app.delete('/api/v1/productGrouping/id/:id', function (request, response) {

        const deleteSQL = 'delete from public."ProductGrouping" where "ProductGroupingId"=$1 returning "ProductGroupingId"';

        //TODO: need to improve the validation of the inpute data
        const paramsSQL = [request.params.id];

        genericQuery.queryOne(pool, deleteSQL, paramsSQL, response, function (result) {
            return { "productGroupingId": result.rows[0].ProductGroupingId };
        });
    });
};

//  end