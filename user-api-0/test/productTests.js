const expect = require('chai').expect;
const request = require('request');
//  this is weird
const Chance = require('chance');
const chance = new Chance();
const _ = require('lodash');

describe('v1 api product tests/', function () {

    const baseUri = 'http://localhost:3000/api/v1/';

    const baseGetInfo = {
        method: 'GET',
        uri: baseUri + 'product',
        headers: {
            'Accept': 'application/json; charset=utf-8'
        }
    };

    describe('initial product tests/', function () {

        it('api is running', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                done();
            });
        });

        it('database has at least one product', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let products = JSON.parse(body);
                expect(products.length).to.be.greaterThan(0);
                done();
            });
        });

        const productNames = [
            'FISH-ADULT-ORDER',
            'EXTRA-FISH-ADULT-ORDER',
            'SHRIMP-ADULT-ORDER',
            'EXTRA-SHRIMP-ADULT-ORDER',
            'COMBO-ADULT-ORDER',
            'FISH-CHILD-ORDER',
            'SHRIMP-CHILD-ORDER',
            'COMBO-CHILD-ORDER',
            'FISH-BULK-ORDER',
            'SHRIMP-BULK-ORDER',
            'SPAGHETTI-BULK-ORDER',
            'FF-BULK-ORDER',
            'APLSCE-BULK-ORDER',
            'SLAW-BULK-ORDER'];

        productNames.forEach(function (productName) {

            it('database has ' + productName, function (done) {
                request(baseGetInfo, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const products = JSON.parse(body);
                    let index = _.findIndex(products, function (i) { return i.productName === productName });
                    expect(index).to.not.equal(-1);
                    expect(products[index].productId).to.not.be.null;
                    expect(products[index].productName).to.not.be.null;
                    expect(products[index].productDescription).to.not.be.null;
                    expect(products[index].productPrice).to.not.be.null;
                    expect(products[index].productGroupingName).to.not.be.null;
                    expect(products[index].productUnitName).to.not.be.null;
                    expect(products[index].productOrder).to.not.be.null;
                    done();
                });
            });

            let productId = null;

            it('lookup ' + productName + ' by name', function (done) {
                let getInfoByName = Object.assign({}, baseGetInfo);
                getInfoByName.uri = getInfoByName.uri + '/name/' + productName;
                request(getInfoByName, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const product = JSON.parse(body);
                    expect(product.productId).to.not.be.null;
                    expect(product.productName).to.equal(productName);
                    expect(product.productDescription).to.not.be.null;
                    expect(product.productPrice).to.not.be.null;
                    expect(product.productGroupingName).to.not.be.null;
                    expect(product.productUnitName).to.not.be.null;
                    expect(product.productOrder).to.not.be.null;
                    //  save the id for the next test
                    productId = product.productId;
                    done();
                });
            });

            it('lookup ' + productName + ' by id', function (done) {
                let getInfoByName = Object.assign({}, baseGetInfo);
                getInfoByName.uri = getInfoByName.uri + '/id/' + productId;
                request(getInfoByName, (error, response, body) => {
                    expect(error).to.be.null;
                    expect(response.statusCode).to.equal(200);
                    expect(response.statusMessage).to.equal('OK');
                    const product = JSON.parse(body);
                    expect(product.productId).to.be.equal(productId);
                    expect(product.productName).to.equal(productName);
                    expect(product.productDescription).to.not.be.null;
                    expect(product.productPrice).to.not.be.null;
                    expect(product.productGroupingName).to.not.be.null;
                    expect(product.productUnitName).to.not.be.null;
                    expect(product.productOrder).to.not.be.null;
                    done();
                });
            });
        });
    });

    describe('new product tests/', function () {

        //  construct a new random product
        let newRandomProduct = {
            productName: chance.word({ length: 16 }),
            productDescription: chance.word({ length: 16 }),
            productPrice: chance.floating({ min: 1.0, max: 50.0, fixed: 2 }),
            productGroupingName: chance.pickone(['ADULT', 'CHILD', 'BULK']),
            productUnitName: chance.pickone(['ORDER', 'LB']),
            productOrder: chance.integer({ min: 0, max: 100 })
        };

        let newRandomProductId = null;

        it('create new random ' + newRandomProduct.productName + ' product', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'POST';
            postInfo.json = newRandomProduct;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                //QUESTION: why do we not need a JSON.parse here?
                const newProduct = body;
                newRandomProductId = newProduct.productId;
                expect(newRandomProductId).to.not.be.null;
                done();
            });
        });

        it('lookup ' + newRandomProduct.productName + ' by name', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/name/' + newRandomProduct.productName;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const product = JSON.parse(body);
                expect(product.productId).to.be.equal(newRandomProductId);
                expect(product.productName).to.equal(newRandomProduct.productName);
                expect(product.productDescription).to.be.equal(newRandomProduct.productDescription);
                expect(product.productPrice).to.be.closeTo(newRandomProduct.productPrice, 0.001);
                expect(product.productGroupingName).to.be.equal(newRandomProduct.productGroupingName);
                expect(product.productUnitName).to.be.equal(newRandomProduct.productUnitName);
                expect(product.productOrder).to.be.equal(newRandomProduct.productOrder);
                done();
            });
        });

        it('lookup ' + newRandomProduct.productName + ' by id', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/id/' + newRandomProductId;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const product = JSON.parse(body);
                expect(product.productId).to.be.equal(newRandomProductId);
                expect(product.productName).to.equal(newRandomProduct.productName);
                expect(product.productDescription).to.be.equal(newRandomProduct.productDescription);
                expect(product.productPrice).to.be.closeTo(newRandomProduct.productPrice, 0.001);
                expect(product.productGroupingName).to.be.equal(newRandomProduct.productGroupingName);
                expect(product.productUnitName).to.be.equal(newRandomProduct.productUnitName);
                expect(product.productOrder).to.be.equal(newRandomProduct.productOrder);
                done();
            });
        });

        it('update ' + newRandomProduct.productName + ' by id', function (done) {
            newRandomProduct = {
                productName: chance.word({ length: 16 }),
                productDescription: chance.word({ length: 16 }),
                productPrice: chance.floating({ min: 1.0, max: 50.0, fixed: 2 }),
                productGroupingName: chance.pickone(['ADULT', 'CHILD', 'BULK']),
                productUnitName: chance.pickone(['ORDER', 'LB']),
                productOrder: chance.integer({ min: 0, max: 100 })
            };
            let putInfo = Object.assign({}, baseGetInfo);
            putInfo.method = 'PUT';
            putInfo.uri = putInfo.uri + '/id/' + newRandomProductId;
            putInfo.json = newRandomProduct;
            request(putInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                //QUESTION: why do we not need a JSON.parse here?
                const product = body;
                expect(product.productId).to.be.equal(newRandomProductId);
                done();
            });
        });

        it('lookup again ' + newRandomProduct.productName + ' by id', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/id/' + newRandomProductId;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const product = JSON.parse(body);
                expect(product.productId).to.be.equal(newRandomProductId);
                expect(product.productName).to.equal(newRandomProduct.productName);
                expect(product.productDescription).to.be.equal(newRandomProduct.productDescription);
                expect(product.productPrice).to.be.closeTo(newRandomProduct.productPrice, 0.001);
                expect(product.productGroupingName).to.be.equal(newRandomProduct.productGroupingName);
                expect(product.productUnitName).to.be.equal(newRandomProduct.productUnitName);
                expect(product.productOrder).to.be.equal(newRandomProduct.productOrder);
                done();
            });
        });

        it('get all products and find the new one', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let products = JSON.parse(body);
                expect(products.length).to.be.greaterThan(0);
                let index = _.findIndex(products, function (i) { return i.productId === newRandomProductId });
                expect(index).to.not.equal(-1);
                expect(products[index].productId).to.be.equal(newRandomProductId);
                expect(products[index].productName).to.equal(newRandomProduct.productName);
                expect(products[index].productDescription).to.be.equal(newRandomProduct.productDescription);
                expect(products[index].productPrice).to.be.closeTo(newRandomProduct.productPrice, 0.001);
                expect(products[index].productGroupingName).to.be.equal(newRandomProduct.productGroupingName);
                expect(products[index].productUnitName).to.be.equal(newRandomProduct.productUnitName);
                expect(products[index].productOrder).to.be.equal(newRandomProduct.productOrder);
                done();
            });
        });

        it('delete ' + newRandomProduct.productName + ' product', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'DELETE';
            postInfo.uri = postInfo.uri + "/id/" + newRandomProductId;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                //QUESTION: why do we need a JSON.parse here?
                const product = JSON.parse(body);
                expect(product.productId).to.be.equal(newRandomProductId);
                done();
            });
        });
    })
});

//  end