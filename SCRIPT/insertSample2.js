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
	
	var nomefile = "02.json";
	fs.readFile(nomefile, 'utf8', function (err, data) {
		if (err) throw err;
		console.log(typeof data)
		var json = JSON.parse(data);
		// inserisco dentro SAMPLE il nostro record
		
		var id = json[1].ID
		/*json.forEach(function(json){
			db.collection("SAMPLE").insert({"idSample": id, "Var" : [ "CHROM" : json.CHROM, "POS" : json.POS, "ID" : json.id ], "idPaz" : idPaz})
		
		
			
			console.log(json.POS)
			/*var bed = db.collection("BED").find(
				 {"INTER.CHROM" : json.CHROM , "INTER.START" :{$lt : json.POS} , "INTER.STOP" : {$gt : json.POS}}).toArray(function(err,bed){
					console.log(bed.length)	*/
				/*var bedLength = myModule.coverage(json.CHROM, json.POS)			
					console.log(bedLength + " siamo dentro insertSample")		
					myModule.insertIntoVARIANTS(json, bedLength, idPaz)				
			})*/
		})
	})	