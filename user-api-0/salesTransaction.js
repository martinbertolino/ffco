'use strict;'

const genericQuery = require("./genericQuery");

module.exports = function (pool, app) {

    //  the design of the sales transaction API is roughly modeled after this 
    //  http://stackoverflow.com/questions/14737393/how-to-represent-maintain-a-master-detail-relationship-in-a-restful-way

    //  create a sales transaction
    app.post('/api/v1/salesTransaction', function (request, response) {

        const insertSQL = 'insert into public."SalesTransaction"("SalesTransactionId", "SalesTransactionDateTime", "SalesTransactionTotal", \
            "SalesTransactionActual", "SalesTransactionStatusId", "SalesTransactionUserId", "SalesTransactionMachineName") \
            values (nextval(\'public."SalesTransaction_SalesTransactionId_seq"\'), $1, $2, $3, \
            (select "SalesTransactionStatusId" from public."SalesTransactionStatus" where "SalesTransactionStatusName" = $4), \
            (select "UserId" from public."User" where "UserName" = $5), \
            $6 ) returning "SalesTransactionId"';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.body.salesTransactionDateTime, 0.0, 0.0, 'PENDING', request.body.salesTransactionUserName, request.body.salesTransactionMachineName];

        genericQuery.queryOne(pool, insertSQL, paramsSQL, response, function (result) {
            return { "salesTransactionId": result.rows[0].SalesTransactionId };
        });
    });

    // get the sales transaction header only by id
    app.get('/api/v1/salesTransactionHeader/:id', function (request, response) {

        const selectSQL = 'select st."SalesTransactionId", st."SalesTransactionDateTime", st."SalesTransactionTotal", \
            st."SalesTransactionActual", sts."SalesTransactionStatusName", u."UserName", "SalesTransactionMachineName" \
            from public."SalesTransaction" as st \
            inner join public."SalesTransactionStatus" as sts on (st."SalesTransactionStatusId" = sts."SalesTransactionStatusId") \
            inner join public."User" as u on (st."SalesTransactionUserId" = u."UserId") \
            where "SalesTransactionId" = $1';

        //TODO: need to improve the validation of the input data
        const paramsSQL = [request.params.id];

        genericQuery.queryOne(pool, selectSQL, paramsSQL, response, function (result) {
            return {
                salesTransactionId: result.rows[0].SalesTransactionId,
                salesTransactionDateTime: new Date(result.rows[0].SalesTransactionDateTime),
                salesTransactionTotal: result.rows[0].SalesTransactionTotal,
                salesTransactionActual: result.rows[0].SalesTransactionActual,
                salesTransactionStatusName: result.rows[0].SalesTransactionStatusName,
                salesTransactionUserName: result.rows[0].UserName,
                salesTransactionMachineName: result.rows[0].SalesTransactionMachineName
            };
        });
    });

}

//  end