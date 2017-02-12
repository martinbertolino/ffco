const expect = require('chai').expect;
const request = require('request');
//  this is weird
const Chance = require('chance');
const chance = new Chance();
const _ = require('lodash');

describe('v1 api product grouping tests/', function () {

    const baseUri = 'http://localhost:3000/api/v1/';

    const baseGetInfo = {
        method: 'GET',
        uri: baseUri + 'productGrouping',
        headers: {
            'Accept': 'application/json; charset=utf-8'
        }
    };

    describe('initial product grouping tests/', function () {

        it('api is running', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                done();
            });
        });

        it('database has at least one product grouping', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let productGroupings = JSON.parse(body);
                expect(productGroupings.length).to.be.greaterThan(0);
                done();
            });
        });

        const productGroupingNames = ['ADULT', 'CHILD', 'BULK'];

        productGroupingNames.forEach(function (productGroupingName) {

            it('database has ' + productGroupingName + ' grouping', function (done) {
                request(baseGetInfo, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const productGroupings = JSON.parse(body);
                    let index = _.findIndex(productGroupings, function (i) { return i.productGroupingName === productGroupingName });
                    expect(index).to.not.equal(-1);
                    expect(productGroupings[index].productGroupingId).to.not.be.null;
                    expect(productGroupings[index].productGroupingName).to.not.be.null;
                    expect(productGroupings[index].productGroupingDescription).to.not.be.null;
                    expect(productGroupings[index].productGroupingOrder).to.not.be.null;
                    done();
                });
            });

            let productGroupingId = null;

            it('lookup ' + productGroupingName + ' by name', function (done) {
                let getInfoByName = Object.assign({}, baseGetInfo);
                getInfoByName.uri = getInfoByName.uri + '/name/' + productGroupingName;
                request(getInfoByName, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const productGrouping = JSON.parse(body);
                    expect(productGrouping.productGroupingId).to.not.be.null;
                    expect(productGrouping.productGroupingName).to.equal(productGroupingName);
                    expect(productGrouping.productGroupingDescription).to.not.be.null;
                    expect(productGrouping.productGroupingOrder).to.not.be.null;
                    //  save the id for the next test
                    productGroupingId = productGrouping.productGroupingId;
                    done();
                });
            });

            it('lookup ' + productGroupingName + ' by id', function (done) {
                let getInfoByName = Object.assign({}, baseGetInfo);
                getInfoByName.uri = getInfoByName.uri + '/id/' + productGroupingId;
                request(getInfoByName, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const productGrouping = JSON.parse(body);
                    expect(productGrouping.productGroupingId).to.be.equal(productGroupingId);
                    expect(productGrouping.productGroupingName).to.equal(productGroupingName);
                    expect(productGrouping.productGroupingDescription).to.not.be.null;
                    expect(productGrouping.productGroupingOrder).to.not.be.null;
                    done();
                });
            });
        });
    });

    describe('new product grouping tests/', function () {

        //  construct a new random product grouping
        let newRandomProductGrouping = {
            productGroupingName: chance.word({ length: 16 }),
            productGroupingDescription: chance.word({ length: 16 }),
            productGroupingOrder: chance.integer({ min: 0, max: 1000 })
        };

        let newRandomProductGroupingId = null;

        it('create new random ' + newRandomProductGrouping.productGroupingName + ' product grouping', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'POST';
            postInfo.json = newRandomProductGrouping;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const newProductGrouping = body;
                newRandomProductGroupingId = newProductGrouping.productGroupingId;
                done();
            });
        });

        it('lookup ' + newRandomProductGrouping.productGroupingName + ' by name', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/name/' + newRandomProductGrouping.productGroupingName;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const productGrouping = JSON.parse(body);
                expect(productGrouping.productGroupingId).to.be.equal(newRandomProductGroupingId);
                expect(productGrouping.productGroupingName).to.equal(newRandomProductGrouping.productGroupingName);
                expect(productGrouping.productGroupingDescription).to.be.equal(newRandomProductGrouping.productGroupingDescription);
                expect(productGrouping.productGroupingOrder).to.be.equal(newRandomProductGrouping.productGroupingOrder);
                done();
            });
        });

        it('lookup ' + newRandomProductGrouping.productGroupingName + ' by id', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/id/' + newRandomProductGroupingId;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const productGrouping = JSON.parse(body);
                expect(productGrouping.productGroupingId).to.be.equal(newRandomProductGroupingId);
                expect(productGrouping.productGroupingName).to.equal(newRandomProductGrouping.productGroupingName);
                expect(productGrouping.productGroupingDescription).to.be.equal(newRandomProductGrouping.productGroupingDescription);
                expect(productGrouping.productGroupingOrder).to.be.equal(newRandomProductGrouping.productGroupingOrder);
                done();
            });
        });

        it('update ' + newRandomProductGrouping.productGroupingName + ' by id', function (done) {
            newRandomProductGrouping = {
                productGroupingName: chance.word({ length: 16 }),
                productGroupingDescription: chance.word({ length: 16 }),
                productGroupingOrder: chance.integer({ min: 0, max: 1000 })
            };
            let putInfo = Object.assign({}, baseGetInfo);
            putInfo.method = 'PUT';
            putInfo.uri = putInfo.uri + '/id/' + newRandomProductGroupingId;
            putInfo.json = newRandomProductGrouping;
            request(putInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const productGrouping = body;
                expect(productGrouping.productGroupingId).to.be.equal(newRandomProductGroupingId);
                done();
            });
        });

        it('lookup again ' + newRandomProductGrouping.productGroupingName + ' by id', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/id/' + newRandomProductGroupingId;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const productGrouping = JSON.parse(body);
                expect(productGrouping.productGroupingId).to.be.equal(newRandomProductGroupingId);
                expect(productGrouping.productGroupingName).to.equal(newRandomProductGrouping.productGroupingName);
                expect(productGrouping.productGroupingDescription).to.be.equal(newRandomProductGrouping.productGroupingDescription);
                expect(productGrouping.productGroupingOrder).to.be.equal(newRandomProductGrouping.productGroupingOrder);
                done();
            });
        });

        it('get all product groupings and find the new one', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let productGroupings = JSON.parse(body);
                expect(productGroupings.length).to.be.greaterThan(0);
                let index = _.findIndex(productGroupings, function (i) { return i.productGroupingId === newRandomProductGroupingId });
                expect(index).to.not.equal(-1);
                expect(productGroupings[index].productGroupingId).to.be.equal(newRandomProductGroupingId);
                expect(productGroupings[index].productGroupingName).to.equal(newRandomProductGrouping.productGroupingName);
                expect(productGroupings[index].productGroupingDescription).to.be.equal(newRandomProductGrouping.productGroupingDescription);
                expect(productGroupings[index].productGroupingOrder).to.be.equal(newRandomProductGrouping.productGroupingOrder);
                done();
            });
        });

        it('delete ' + newRandomProductGrouping.productGroupingName + ' product grouping', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'DELETE';
            postInfo.uri = postInfo.uri + "/id/" + newRandomProductGroupingId;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const productGrouping = JSON.parse(body);
                expect(productGrouping.productGroupingId).to.be.equal(newRandomProductGroupingId);
                done();
            });
        });
    })
});

//  end