//conferma Sanger!
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
const myModule = require('./mymodule');
var tsv = require("node-tsv-json");
var idPaz = "MN-188/11"
var CONFERMA = "WT" , idVAR = "chr1_17350238_A_G", idSample = "20170224_02_Cancer"
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	if (CONFERMA === "WT"){
		var arr = idVAR.split("_")
		console.log("Conferma non avvenuta, provvedo alla cancellazione della variante " + idVAR + " nel paziente " + idPaz)
		
			db.collection("SAMPLE").update(
			{Var : {$elemMatch: {CHROM : arr[0], POS : arr[1], REF : arr[2], ALT : arr[3], ID : idSample}}},
				{ 
				$set: {
				"Var.$.ConfermaSanger" : "WT"
					}
				}
			)
		myModule.aggiornaVARIANTS()
   }
})
