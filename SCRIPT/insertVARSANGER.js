//insertVARSANGER

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
const myModule = require('./mymodule');
var idPaz = "NN-188/11"
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	
	
})