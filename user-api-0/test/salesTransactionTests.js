const expect = require('chai').expect;
const request = require('request');
//  this is weird
const Chance = require('chance');
const chance = new Chance();
const _ = require('lodash');
const os = require('os');

describe('v1 api sales transaction tests/', function () {

    const baseUri = 'http://localhost:3000/api/v1/';

    const baseGetInfo = {
        method: 'GET',
        uri: baseUri + 'salesTransaction',
        headers: {
            'Accept': 'application/json; charset=utf-8'
        }
    };

    describe('initial sales transaction tests/', function () {

        //  construct a new random product
        let newRandomSalesTransaction = {
            salesTransactionDateTime: chance.date(),
            salesTransactionUserName: 'wbailey0@imdb.com',
            salesTransactionMachineName: os.hostname()
        };

        let newRandomSalesTransactionId = null;

        it('create new sales transaction', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'POST';
            postInfo.json = newRandomSalesTransaction;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                //QUESTION: why do we not need a JSON.parse here?
                const newSalesTransaction = body;
                newRandomSalesTransactionId = newSalesTransaction.salesTransactionId;
                expect(newRandomSalesTransactionId).to.not.be.null;
                done();
            });
        });

        //TODO: need to figure out date handling
        it('lookup the new sales transaction header', function (done) {
            let getInfo = Object.assign({}, baseGetInfo);
            getInfo.uri = getInfo.uri + 'Header/' + newRandomSalesTransactionId;
            request(getInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let salesTransaction = JSON.parse(body);
                //console.dir(salesTransaction);
                expect(salesTransaction.salesTransactionId).to.be.equal(newRandomSalesTransactionId);
                //expect(salesTransaction.salesTransactionDateTime).to.be.equal(newRandomSalesTransaction.salesTransactionDateTime);
                expect(salesTransaction.salesTransactionTotal).to.be.closeTo(0.0, 0.001);
                expect(salesTransaction.salesTransactionActual).to.be.closeTo(0.0, 0.001);
                expect(salesTransaction.salesTransactionStatusName).to.be.equal('PENDING');
                expect(salesTransaction.salesTransactionUserName).to.be.equal(newRandomSalesTransaction.salesTransactionUserName);
                expect(salesTransaction.salesTransactionMachineName).to.be.equal(newRandomSalesTransaction.salesTransactionMachineName);
                done();
            });
        })
    });
});

//  end