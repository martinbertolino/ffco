'use strict;'

const async = require('async');

exports.queryOne = function queryOne(pool, selectSQL, paramsSQL, response, procResult) {

    pool.query(selectSQL, paramsSQL, function (error, result) {
        if (error) {
            console.error('error querying database', error);
            response.sendStatus(500);
        } else {
            //  looking for only one row
            if (result.rows.length === 0) {
                response.status(404).json({ error: "item not found" });
            } else if (result.rows.length === 1) {
                response.status(200).json(procResult(result));
            } else {
                console.error(`error querying database, too many items returned: ${result.rows.length}`);
                response.sendStatus(500);
            }
        }
    });
};

exports.queryMany = function queryMany(pool, selectSQL, paramsSQL, response, procItem) {

    pool.query(selectSQL, paramsSQL, function (error, result) {
        if (error) {
            console.error('error querying database', error);
            response.sendStatus(500);
        } else {
            async.waterfall([
                (callback) => {
                    async.map(result.rows, (item, cb) => {
                        cb(null, procItem(item));
                    }, (error, result) => {
                        callback(null, result);
                    });
                }
            ], (error, result) => {
                response.status(200).json(result);
            });
        }
    });
};

//  end