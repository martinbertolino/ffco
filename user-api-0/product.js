'use strict;'

const genericQuery = require("./genericQuery");

module.exports = function (pool, app) {

    //  create a product
    app.post('/api/v1/product', function (request, response) {

        //QUESTION: Are we really getting any value from the domain tables having both surrogate and natural keys?
        //note that we map names to ids here
        const insertSQL = 'insert into public."Product"("ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder") \
            values (nextval(\'public."Product_ProductId_seq"\'), $1, $2, $3, \
            (select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = $4), \
            (select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = $5), \
            $6) returning "ProductId"';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.productName, request.body.productDescription, request.body.productPrice, request.body.productGroupingName, request.body.productUnitName, request.body.productOrder];

        genericQuery.queryOne(pool, insertSQL, paramsSQL, response, function (result) {
            return { "productId": result.rows[0].ProductId };
        });
    });

    function mapRowColumnsToObject(row) {
        return {
            productId: row.ProductId,
            productName: row.ProductName,
            productDescription: row.ProductDescription,
            productPrice: row.ProductPrice,
            productGroupingName: row.ProductGroupingName,
            productUnitName: row.ProductUnitName,
            productOrder: row.ProductOrder
        };
    };

    //  get a product by name
    app.get('/api/v1/product/name/:name', function (request, response) {

        const selectSQL = 'select p."ProductId", p."ProductName", p."ProductDescription", p."ProductPrice", pg."ProductGroupingName", pu."ProductUnitName", p."ProductOrder" from public."Product" as p \
            inner join public."ProductGrouping" as pg on (p."ProductGroupingId" = pg."ProductGroupingId") \
            inner join public."ProductUnit" as pu on (p."ProductUnitId" = pu."ProductUnitId") \
            where p."ProductName" = $1';

        //TODO: we should probably sanitize the input here?  What does express do?
        genericQuery.queryOne(pool, selectSQL, [request.params.name], response, function (result) {
            return mapRowColumnsToObject(result.rows[0]);
        });
    });

    //  get a product by id
    app.get('/api/v1/product/id/:id', function (request, response) {

        const selectSQL = 'select p."ProductId", p."ProductName", p."ProductDescription", p."ProductPrice", pg."ProductGroupingName", pu."ProductUnitName", p."ProductOrder" from public."Product" as p \
            inner join public."ProductGrouping" as pg on (p."ProductGroupingId" = pg."ProductGroupingId") \
            inner join public."ProductUnit" as pu on (p."ProductUnitId" = pu."ProductUnitId") \
            where p."ProductId" = $1';

        genericQuery.queryOne(pool, selectSQL, [request.params.id], response, function (result) {
            return mapRowColumnsToObject(result.rows[0]);
        });
    });

    // get all products
    app.get('/api/v1/product/', function (request, response) {

        const selectSQL = 'select p."ProductId", p."ProductName", p."ProductDescription", p."ProductPrice", pg."ProductGroupingName", pu."ProductUnitName", p."ProductOrder" from public."Product" as p \
            inner join public."ProductGrouping" as pg on (p."ProductGroupingId" = pg."ProductGroupingId") \
            inner join public."ProductUnit" as pu on (p."ProductUnitId" = pu."ProductUnitId")';

        genericQuery.queryMany(pool, selectSQL, [], response, function (item) {
            return mapRowColumnsToObject(item);
        });
    });

    // update a product by id
    app.put('/api/v1/product/id/:id', function (request, response) {

        const updateSQL = 'update public."Product" set "ProductName"=$1, "ProductDescription"=$2, "ProductPrice"=$3, \
            "ProductGroupingId" = (select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = $4), \
            "ProductUnitId" = (select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = $5), \
            "ProductOrder" = $6 \
            where "ProductId"=$7 returning "ProductId"';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.productName, request.body.productDescription, request.body.productPrice, request.body.productGroupingName, request.body.productUnitName, request.body.productOrder, request.params.id];

        genericQuery.queryOne(pool, updateSQL, paramsSQL, response, function (result) {
            return { "productId": result.rows[0].ProductId };
        });
    });

    // delete a product by id
    app.delete('/api/v1/product/id/:id', function (request, response) {

        const deleteSQL = 'delete from public."Product" where "ProductId"=$1 returning "ProductId"';

        //TODO: need to improve the validation of the inpute data
        const paramsSQL = [request.params.id];

        genericQuery.queryOne(pool, deleteSQL, paramsSQL, response, function (result) {
            return { "productId": result.rows[0].ProductId };
        });
    });
};

//  end