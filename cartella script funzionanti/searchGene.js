var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
var SYMBOL = "-"	
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");

	//CERCO tutte le varianti con lo stesso gene
	
	var docs = db.collection("SAMPLE").find({"SYMBOL": SYMBOL});
		docs.forEach(function(docs){
			console.log(docs.REF + ' ' +docs.ALT +' '+ docs.POS + ' ' + docs.CHROM +' '+ docs.SYMBOL)
			
		
		
	})
	
	
})