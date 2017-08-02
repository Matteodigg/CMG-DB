var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
var idRun = "20170224_01_Cancer"	
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");

	//CERCO tutte le varianti con lo stesso gene
	
	var docs = db.collection("SAMPLE").find({"ID": idRun});
		docs.forEach(function(docs){
			console.log(docs.ID)
			})
	
	
})