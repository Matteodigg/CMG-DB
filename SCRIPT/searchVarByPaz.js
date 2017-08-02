var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
var idPaz = "NN_17/02/1962_01"	
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");

	//CERCO tutte le varianti dello stesso paziente
	
	var docs = db.collection("PATIENTS").find({"idPaz": idPaz});
		docs.forEach(function(docs){
			var vars = db.collections("SAMPLE").find({"idSample" : docs.idSample});
			vars.forEach(function(vars){
				console.log(vars.ALT, vars.REF, vars.CHROM , vars.POS)
				})
		})
	
	
})