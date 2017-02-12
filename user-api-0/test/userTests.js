const expect = require('chai').expect;
const request = require('request');
//  this is weird
const Chance = require('chance');
const chance = new Chance();
const _ = require('lodash');

describe('v1 api user tests/', function () {

    const baseUri = 'http://localhost:3000/api/v1/';

    const baseGetInfo = {
        method: 'GET',
        uri: baseUri + 'user',
        headers: {
            'Accept': 'application/json; charset=utf-8'
        }
    };

    //  dummy test to verify the setup is working
    describe('dummy tests/', function () {

        it('dummy test', function () {
            expect(1).to.equal(1);
        });
    });

    describe('initial user tests/', function () {

        const williamBaileyReference = {
            userName: 'wbailey0@imdb.com',
            userFirstName: 'William',
            userLastName: 'Bailey'
        };

        it('api is running', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                done();
            });
        });

        it('database has at least one user', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let users = JSON.parse(body);
                expect(users.length).to.be.greaterThan(0);
                done();
            });
        });

        it('database has one William Bailey', function (done) {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const users = JSON.parse(body);
                let index = _.findIndex(users, function (i) { return i.userName === williamBaileyReference.userName; });
                expect(index).to.not.equal(-1);
                expect(users[index].userName).to.equal(williamBaileyReference.userName);
                expect(users[index].userFirstName).to.equal(williamBaileyReference.userFirstName);
                expect(users[index].userLastName).to.equal(williamBaileyReference.userLastName);
                done();
            });
        });

        let williamBaileyId = null;

        it('lookup William Bailey by name', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/name/' + 'wbailey0@imdb.com';
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const williamBailey = JSON.parse(body);
                expect(williamBailey.userName).to.equal(williamBaileyReference.userName);
                expect(williamBailey.userFirstName).to.equal(williamBaileyReference.userFirstName);
                expect(williamBailey.userLastName).to.equal(williamBaileyReference.userLastName);
                //  save the id for the next test
                williamBaileyId = williamBailey.userId;
                done();
            });
        });

        it('lookup William Bailey by id', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/id/' + williamBaileyId;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const williamBailey = JSON.parse(body);
                expect(williamBailey.userId).to.equal(williamBaileyId);
                expect(williamBailey.userName).to.equal(williamBaileyReference.userName);
                expect(williamBailey.userFirstName).to.equal(williamBaileyReference.userFirstName);
                expect(williamBailey.userLastName).to.equal(williamBaileyReference.userLastName);
                done();
            });
        });
    });

    describe('new user tests/', function () {

        //  construct a new random user
        let newRandomUser = {
            userName: chance.email(),
            userFirstName: chance.first(),
            userLastName: chance.last()
        };

        let newRandomUserId = null;

        it('create new random user', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'POST';
            postInfo.json = newRandomUser;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const newUser = body;
                newRandomUserId = newUser.userId;
                done();
            });
        });

        it('lookup ' + newRandomUser.userName + ' by name', function (done) {
            let getInfoByName = Object.assign({}, baseGetInfo);
            getInfoByName.uri = getInfoByName.uri + '/name/' + newRandomUser.userName;
            request(getInfoByName, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const newUser = JSON.parse(body);
                expect(newUser.userId).to.equal(newRandomUserId);
                expect(newUser.userName).to.equal(newRandomUser.userName);
                expect(newUser.userFirstName).to.equal(newRandomUser.userFirstName);
                expect(newUser.userLastName).to.equal(newRandomUser.userLastName);
                done();
            });
        });

        it('lookup ' + newRandomUser.userName + ' by id', function (done) {
            let getInfoById = Object.assign({}, baseGetInfo);
            getInfoById.uri = getInfoById.uri + '/id/' + newRandomUserId;
            request(getInfoById, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const newUser = JSON.parse(body);
                expect(newUser.userId).to.equal(newRandomUserId);
                expect(newUser.userName).to.equal(newRandomUser.userName);
                expect(newUser.userFirstName).to.equal(newRandomUser.userFirstName);
                expect(newUser.userLastName).to.equal(newRandomUser.userLastName);
                done();
            });
        });

        it('update ' + newRandomUser.userName + ' by id', function (done) {
            newRandomUser = {
                userName: chance.email(),
                userFirstName: chance.first(),
                userLastName: chance.last()
            };
            let putInfo = Object.assign({}, baseGetInfo);
            putInfo.method = 'PUT';
            putInfo.uri = putInfo.uri + '/id/' + newRandomUserId;
            putInfo.json = newRandomUser;
            request(putInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const user = body;
                expect(user.userId).to.equal(newRandomUserId);
                done();
            });
        });

        it('lookup again' + newRandomUser.userName + ' by id', function (done) {
            let getInfoById = Object.assign({}, baseGetInfo);
            getInfoById.uri = getInfoById.uri + '/id/' + newRandomUserId;
            request(getInfoById, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const newUser = JSON.parse(body);
                expect(newUser.userId).to.equal(newRandomUserId);
                expect(newUser.userName).to.equal(newRandomUser.userName);
                expect(newUser.userFirstName).to.equal(newRandomUser.userFirstName);
                expect(newUser.userLastName).to.equal(newRandomUser.userLastName);
                done();
            });
        });

        it('get all users and find the new one', function (done) {
            let getInfo = Object.assign({}, baseGetInfo);
            request(getInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const users = JSON.parse(body);
                let index = _.findIndex(users, function (i) { return i.userId === newRandomUserId; });
                expect(index).to.not.equal(-1);
                expect(users[index].userId).to.equal(newRandomUserId);
                expect(users[index].userName).to.equal(newRandomUser.userName);
                expect(users[index].userFirstName).to.equal(newRandomUser.userFirstName);
                expect(users[index].userLastName).to.equal(newRandomUser.userLastName);
                done();
            });
        });

        it('delete ' + newRandomUser.userName + ' user', function (done) {
            let postInfo = Object.assign({}, baseGetInfo);
            postInfo.method = 'DELETE';
            postInfo.uri = postInfo.uri + "/id/" + newRandomUserId;
            request(postInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                const user = JSON.parse(body);
                expect(user.userId).to.equal(newRandomUserId);              
                done();
            });
        });
    });
});

//  end