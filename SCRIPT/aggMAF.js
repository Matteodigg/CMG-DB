var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	
	var docs = db.collection("VARIANTS").find()
							docs.forEach(function(docs){
								console.log("ALL_NUM " + docs.ALL_NUM + " ALL_COUNT " + docs.ALL_COUNT)
								var maf = (parseFloat(docs.ALL_COUNT)/parseFloat(docs.ALL_NUM))
							
								db.collection("VARIANTS").update( 
									{_id: docs._id},
									{ $set: { MAF : maf } }
									)	
							})
						})