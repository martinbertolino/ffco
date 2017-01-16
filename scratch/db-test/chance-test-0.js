'use strict';

const _ = require('underscore');
//  this is weird
var Chance = require('chance');
var chance = new Chance();

//console.dir(chance);

var firstName = chance.first();
var lastName = chance.last();

console.log(firstName);
console.log(lastName);

var randomUsers = _.map(_.range(10), function(item) {
    let user = {
        userName: chance.email(),
        firtsName: chance.first(),
        lastName: chance.last()
    };
    console.dir(user);
    return user;
});

console.dir(randomUsers);

//  end