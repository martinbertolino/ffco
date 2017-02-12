'use strict;'

const genericQuery = require("./genericQuery");

module.exports = function (pool, app) {

    //  create a product unit
    app.post('/api/v1/productUnit', function (request, response) {

        const insertSQL = 'insert into public."ProductUnit"( \
            "ProductUnitId", "ProductUnitName", "ProductUnitDescription") \
            values (nextval(\'public."ProductUnit_ProductUnitId_seq"\'), $1, $2) returning "ProductUnitId"';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.productUnitName, request.body.productUnitDescription];

        genericQuery.queryOne(pool, insertSQL, paramsSQL, response, function (result) {
            return { "productUnitId": result.rows[0].ProductUnitId };
        });
    });

    function mapRowColumnsToObject(row) {
        return {
            productUnitId: row.ProductUnitId,
            productUnitName: row.ProductUnitName,
            productUnitDescription: row.ProductUnitDescription
        };
    };

    //  get a product unit by name
    app.get('/api/v1/productUnit/name/:name', function (request, response) {

        //TODO: we should probably sanitize the input here?  What does express do?
        genericQuery.queryOne(pool, 'select * from public."ProductUnit" t where t."ProductUnitName"=$1', [request.params.name], response, function (result) {
            return mapRowColumnsToObject(result.rows[0]);
        });
    });

    //  get a product unit by id
    app.get('/api/v1/productUnit/id/:id', function (request, response) {

        genericQuery.queryOne(pool, 'select * from public."ProductUnit" t where t."ProductUnitId"=$1', [request.params.id], response, function (result) {
            return mapRowColumnsToObject(result.rows[0]);
        });
    });

    // get all product units
    app.get('/api/v1/productUnit/', function (request, response) {

        genericQuery.queryMany(pool, 'select * from public."ProductUnit"', [], response, function (item) {
            return mapRowColumnsToObject(item);
        });
    });

    // update a product unit by id
    app.put('/api/v1/productUnit/id/:id', function (request, response) {

        const updateSQL = 'update public."ProductUnit" set "ProductUnitName"=$1, "ProductUnitDescription"=$2 where "ProductUnitId"=$3 returning "ProductUnitId"';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.productUnitName, request.body.productUnitDescription, request.params.id];

        genericQuery.queryOne(pool, updateSQL, paramsSQL, response, function (result) {
            return { "productUnitId": result.rows[0].ProductUnitId };
        });
    });

    // delete a product unit by id
    app.delete('/api/v1/productUnit/id/:id', function (request, response) {

        const deleteSQL = 'delete from public."ProductUnit" where "ProductUnitId"=$1 returning "ProductUnitId"';

        //TODO: need to improve the validation of the inpute data
        const paramsSQL = [request.params.id];

        genericQuery.queryOne(pool, deleteSQL, paramsSQL, response, function (result) {
            return { "productUnitId": result.rows[0].ProductUnitId };
        });
    });
};

//  end