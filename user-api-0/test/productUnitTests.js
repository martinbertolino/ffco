const expect = require('chai').expect;
const request = require('request');
//  this is weird
const Chance = require('chance');
const chance = new Chance();
const _ = require('lodash');

describe('v1 api product unit tests/', function () {

    const baseUri = 'http://localhost:3000/api/v1/';

    const baseGetInfo = {
        method: 'GET',
        uri: baseUri + 'productUnit',
        headers: {
            'Accept': 'application/json; charset=utf-8'
        }
    };

    describe('initial product unit tests/', function () {

        it('api is running', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                done();
            });
        });

        it('database has at least one product unit', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let productUnits = JSON.parse(body);
                expect(productUnits.length).to.be.greaterThan(0);
                done();
            });
        });

        const productUnitNames = ['ORDER', 'LB'];

        productUnitNames.forEach(function (productUnitName) {

            it('database has ' + productUnitName + ' unit', function (done) {
                request(baseGetInfo, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const productUnits = JSON.parse(body);
                    let index = _.findIndex(productUnits, function (i) { return i.productUnitName === productUnitName });
                    expect(index).to.not.equal(-1);
                    expect(productUnits[index].productUnitId).to.not.be.null;
                    expect(productUnits[index].productUnitName).to.not.be.null;
                    expect(productUnits[index].productUnitDescription).to.not.be.null;
                    done();
                });
            });

            let productUnitId = null;

            it('lookup ' + productUnitName + ' by name', function (done) {
                let getInfoByName = Object.assign({}, baseGetInfo);
                getInfoByName.uri = getInfoByName.uri + '/name/' + productUnitName;
                request(getInfoByName, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const productUnit = JSON.parse(body);
                    expect(productUnit.productUnitId).to.not.be.null;
                    expect(productUnit.productUnitName).to.equal(productUnitName);
                    expect(productUnit.productUnitDescription).to.not.be.null;
                    //  save the id for the next test
                    productUnitId = productUnit.productUnitId;
                    done();
                });
            });

            it('lookup ' + productUnitName + ' by id', function (done) {
                let getInfoByName = Object.assign({}, baseGetInfo);
                getInfoByName.uri = getInfoByName.uri + '/id/' + productUnitId;
                request(getInfoByName, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const productUnit = JSON.parse(body);
                    expect(productUnit.productUnitId).to.be.equal(productUnitId);
                    expect(productUnit.productUnitName).to.equal(productUnitName);
                    expect(productUnit.productUnitDescription).to.not.be.null;
                    done();
                });
            });
        });
    });

    describe('new product unit tests/', function () {

        //  construct a new random product unit
        let newRandomProductUnit = {
            productUnitName: chance.word({ length: 16 }),
            productUnitDescription: chance.word({ length: 16 }),
        };

        let newRandomProductUnitId = null;

        it('create new random ' + newRandomProductUnit.productUnitName + ' product unit', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'POST';
            postInfo.json = newRandomProductUnit;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const newProductGrouping = body;
                newRandomProductUnitId = newProductGrouping.productUnitId;
                done();
            });
        });

        it('lookup ' + newRandomProductUnit.productUnitName + ' by name', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/name/' + newRandomProductUnit.productUnitName;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const productUnit = JSON.parse(body);
                expect(productUnit.productUnitId).to.be.equal(newRandomProductUnitId);
                expect(productUnit.productUnitName).to.equal(newRandomProductUnit.productUnitName);
                expect(productUnit.productUnitDescription).to.be.equal(newRandomProductUnit.productUnitDescription);
                done();
            });
        });

        it('lookup ' + newRandomProductUnit.productUnitName + ' by id', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/id/' + newRandomProductUnitId;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const productUnit = JSON.parse(body);
                expect(productUnit.productUnitId).to.be.equal(newRandomProductUnitId);
                expect(productUnit.productUnitName).to.equal(newRandomProductUnit.productUnitName);
                expect(productUnit.productUnitDescription).to.be.equal(newRandomProductUnit.productUnitDescription);
                done();
            });
        });

        it('update ' + newRandomProductUnit.productUnitName + ' by id', function (done) {
            newRandomProductUnit = {
                productUnitName: chance.word({ length: 16 }),
                productUnitDescription: chance.word({ length: 16 }),
            };
            let putInfo = Object.assign({}, baseGetInfo);
            putInfo.method = 'PUT';
            putInfo.uri = putInfo.uri + '/id/' + newRandomProductUnitId;
            putInfo.json = newRandomProductUnit;
            request(putInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const productUnit = body;
                expect(productUnit.productUnitId).to.be.equal(newRandomProductUnitId);
                done();
            });
        });

        it('lookup again ' + newRandomProductUnit.productUnitName + ' by id', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/id/' + newRandomProductUnitId;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const productUnit = JSON.parse(body);
                expect(productUnit.productUnitId).to.be.equal(newRandomProductUnitId);
                expect(productUnit.productUnitName).to.equal(newRandomProductUnit.productUnitName);
                expect(productUnit.productUnitDescription).to.be.equal(newRandomProductUnit.productUnitDescription);
                done();
            });
        });

        it('get all product units and find the new one', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let productUnits = JSON.parse(body);
                expect(productUnits.length).to.be.greaterThan(0);
                let index = _.findIndex(productUnits, function (i) { return i.productUnitId === newRandomProductUnitId });
                expect(index).to.not.equal(-1);
                expect(productUnits[index].productUnitId).to.be.equal(newRandomProductUnitId);
                expect(productUnits[index].productUnitName).to.equal(newRandomProductUnit.productUnitName);
                expect(productUnits[index].productUnitDescription).to.be.equal(newRandomProductUnit.productUnitDescription);
                done();
            });
        });

        it('delete ' + newRandomProductUnit.productUnitName + ' product unit', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'DELETE';
            postInfo.uri = postInfo.uri + "/id/" + newRandomProductUnitId;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const productUnit = JSON.parse(body);
                expect(productUnit.productUnitId).to.be.equal(newRandomProductUnitId);
                done();
            });
        });
    })
});

//  end