var expect = require('chai').expect;
var request = require('request');

describe('v1 api tests', () => {
    const baseUri = 'http://localhost:3000/api/v1/';

    //  dummy test to verify the setup is working
    describe('dummy tests', () => {
        it('dummy test', () => {
            expect(1).to.equal(1);
        });
    });

    describe('inititial users tests', () => {
        const baseGetInfo = {
            method: 'GET',
            uri: baseUri + 'user',
            headers: {
                'Accept': 'application/json; charset=utf-8'
            }
        };

        it('api is running', (done) => {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                done();
            });
        });

        it('database has only one user', (done) => {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let users = JSON.parse(body);
                expect(users.length).to.equal(1);
                done();
            });
        });

        it('database has only one William Bailey', (done) => {
            request(baseGetInfo, (error, response, body) => {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.statusMessage).to.equal('OK');
                let users = JSON.parse(body);
                expect(users.length).to.equal(1);
                let williamBailey = users[0];
                expect(williamBailey.UserName).to.equal('wbailey0@imdb.com');
                expect(williamBailey.UserFirstName).to.equal('William');
                expect(williamBailey.UserLastName).to.equal('Bailey');
                done();
            });
        });
    });
});

//  end