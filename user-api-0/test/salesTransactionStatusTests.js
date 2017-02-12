const expect = require('chai').expect;
const request = require('request');
//  this is weird
const Chance = require('chance');
const chance = new Chance();
const _ = require('lodash');

describe('v1 api sales transaction status tests/', function () {

    const baseUri = 'http://localhost:3000/api/v1/';

    const baseGetInfo = {
        method: 'GET',
        uri: baseUri + 'salesTransactionStatus',
        headers: {
            'Accept': 'application/json; charset=utf-8'
        }
    };

    describe('initial sales transaction status tests/', function () {

        it('api is running', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                done();
            });
        });

        it('database has at least one sales transaction status', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let salesTransactionStatuses = JSON.parse(body);
                expect(salesTransactionStatuses.length).to.be.greaterThan(0);
                done();
            });
        });

        const salesTransactionStatusNames = ['OK', 'VOID', 'FREE'];

        salesTransactionStatusNames.forEach(function (salesTransactionStatusName) {

            it('database has ' + salesTransactionStatusName + ' unit', function (done) {
                request(baseGetInfo, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const salesTransactionStatuses = JSON.parse(body);
                    let index = _.findIndex(salesTransactionStatuses, function (i) { return i.salesTransactionStatusName === salesTransactionStatusName });
                    expect(index).to.not.equal(-1);
                    expect(salesTransactionStatuses[index].salesTransactionStatusId).to.not.be.null;
                    expect(salesTransactionStatuses[index].salesTransactionStatusName).to.not.be.null;
                    expect(salesTransactionStatuses[index].salesTransactionStatusDescription).to.not.be.null;
                    done();
                });
            });

            let salesTransactionStatusId = null;

            it('lookup ' + salesTransactionStatusName + ' by name', function (done) {
                let getInfoByName = Object.assign({}, baseGetInfo);
                getInfoByName.uri = getInfoByName.uri + '/name/' + salesTransactionStatusName;
                request(getInfoByName, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const salesTransactionStatus = JSON.parse(body);
                    expect(salesTransactionStatus.salesTransactionStatusId).to.not.be.null;
                    expect(salesTransactionStatus.salesTransactionStatusName).to.equal(salesTransactionStatusName);
                    expect(salesTransactionStatus.salesTransactionStatusDescription).to.not.be.null;
                    //  save the id for the next test
                    salesTransactionStatusId = salesTransactionStatus.salesTransactionStatusId;
                    done();
                });
            });

            it('lookup ' + salesTransactionStatusName + ' by id', function (done) {
                let getInfoByName = Object.assign({}, baseGetInfo);
                getInfoByName.uri = getInfoByName.uri + '/id/' + salesTransactionStatusId;
                request(getInfoByName, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const salesTransactionStatus = JSON.parse(body);
                    expect(salesTransactionStatus.salesTransactionStatusId).to.be.equal(salesTransactionStatusId);
                    expect(salesTransactionStatus.salesTransactionStatusName).to.equal(salesTransactionStatusName);
                    expect(salesTransactionStatus.salesTransactionStatusDescription).to.not.be.null;
                    done();
                });
            });
        });
    });

    describe('new sales transaction status tests/', function () {

        //  construct a new random sales transaction status
        let newRandomTransactionStatus = {
            salesTransactionStatusName: chance.word({ length: 16 }),
            salesTransactionStatusDescription: chance.word({ length: 16 }),
        };

        let newRandomTransactionStatusId = null;

        it('create new random ' + newRandomTransactionStatus.salesTransactionStatusName + ' sales transaction status', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'POST';
            postInfo.json = newRandomTransactionStatus;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const newProductGrouping = body;
                newRandomTransactionStatusId = newProductGrouping.salesTransactionStatusId;
                done();
            });
        });

        it('lookup ' + newRandomTransactionStatus.salesTransactionStatusName + ' by name', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/name/' + newRandomTransactionStatus.salesTransactionStatusName;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const salesTransactionStatus = JSON.parse(body);
                expect(salesTransactionStatus.salesTransactionStatusId).to.be.equal(newRandomTransactionStatusId);
                expect(salesTransactionStatus.salesTransactionStatusName).to.equal(newRandomTransactionStatus.salesTransactionStatusName);
                expect(salesTransactionStatus.salesTransactionStatusDescription).to.be.equal(newRandomTransactionStatus.salesTransactionStatusDescription);
                done();
            });
        });

        it('lookup ' + newRandomTransactionStatus.salesTransactionStatusName + ' by id', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/id/' + newRandomTransactionStatusId;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const salesTransactionStatus = JSON.parse(body);
                expect(salesTransactionStatus.salesTransactionStatusId).to.be.equal(newRandomTransactionStatusId);
                expect(salesTransactionStatus.salesTransactionStatusName).to.equal(newRandomTransactionStatus.salesTransactionStatusName);
                expect(salesTransactionStatus.salesTransactionStatusDescription).to.be.equal(newRandomTransactionStatus.salesTransactionStatusDescription);
                done();
            });
        });

        it('update ' + newRandomTransactionStatus.salesTransactionStatusName + ' by id', function (done) {
            newRandomTransactionStatus = {
                salesTransactionStatusName: chance.word({ length: 16 }),
                salesTransactionStatusDescription: chance.word({ length: 16 }),
            };
            let putInfo = Object.assign({}, baseGetInfo);
            putInfo.method = 'PUT';
            putInfo.uri = putInfo.uri + '/id/' + newRandomTransactionStatusId;
            putInfo.json = newRandomTransactionStatus;
            request(putInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const salesTransactionStatus = body;
                expect(salesTransactionStatus.salesTransactionStatusId).to.be.equal(newRandomTransactionStatusId);
                done();
            });
        });

        it('lookup again ' + newRandomTransactionStatus.salesTransactionStatusName + ' by id', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/id/' + newRandomTransactionStatusId;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const salesTransactionStatus = JSON.parse(body);
                expect(salesTransactionStatus.salesTransactionStatusId).to.be.equal(newRandomTransactionStatusId);
                expect(salesTransactionStatus.salesTransactionStatusName).to.equal(newRandomTransactionStatus.salesTransactionStatusName);
                expect(salesTransactionStatus.salesTransactionStatusDescription).to.be.equal(newRandomTransactionStatus.salesTransactionStatusDescription);
                done();
            });
        });

        it('get all sales transaction statuss and find the new one', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let salesTransactionStatuses = JSON.parse(body);
                expect(salesTransactionStatuses.length).to.be.greaterThan(0);
                let index = _.findIndex(salesTransactionStatuses, function (i) { return i.salesTransactionStatusId === newRandomTransactionStatusId });
                expect(index).to.not.equal(-1);
                expect(salesTransactionStatuses[index].salesTransactionStatusId).to.be.equal(newRandomTransactionStatusId);
                expect(salesTransactionStatuses[index].salesTransactionStatusName).to.equal(newRandomTransactionStatus.salesTransactionStatusName);
                expect(salesTransactionStatuses[index].salesTransactionStatusDescription).to.be.equal(newRandomTransactionStatus.salesTransactionStatusDescription);
                done();
            });
        });

        it('delete ' + newRandomTransactionStatus.salesTransactionStatusName + ' sales transaction status', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'DELETE';
            postInfo.uri = postInfo.uri + "/id/" + newRandomTransactionStatusId;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const salesTransactionStatus = JSON.parse(body);
                expect(salesTransactionStatus.salesTransactionStatusId).to.be.equal(newRandomTransactionStatusId);             
                done();
            });
        });
    })
});

//  end