var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
const myModule = require('./mymodule');
var idRun = "Test"	
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	
	
	fs.readFile('22.json', 'utf8', function (err, data) {
		if (err) throw err;
		var json = JSON.parse(data);
		json.forEach(function(json){
			
		db.collection("RUN").insert(json)
		
		db.collection("COUNTERS").update(
				{collection : "RUN"},
				{ 
					$inc: { counter: 1 } 
				}
		)
		var coll = db.collection("COUNTERS").find(
			{collection : "RUN"}
		)
		coll.forEach(function(coll){
			db.collection("RUN").update(
				{ID : json.ID},
				{
					$set : {"idRun" : idRun, counter : coll.counter + 1}
				}
			)
		})
			
		})
	})
})