
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
const myModule = require('./mymodule');
var tsv = require("node-tsv-json");
var idPaz = "SN-188/11"
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	
	var idVAR = '';
	var nomefile = '04.tsv'
	
	fs.readFile(nomefile, 'utf8', function (err, tsv) {
		
		//var tsv is the TSV file with headers
		var lines=tsv.split("\n");
		var result = [];
		var variants = [];
		var headers=lines[0].split("\t");
		headers.push("ConfermaSanger")
		var s = 0
		var lastlines = lines[lines.length-1]
		if (lastlines == ""){
			s = 1;			
		}

		for(var i=1;i<lines.length - s;i++){
			var obj = {};
			var vars = {};
			var currentline=lines[i].split("\t");
			currentline.push("-")
			for(var j=0;j<24;j++){
				obj[headers[j]] = currentline[j];
			}
			
			
			for(var c=45;c<51;c++){
					obj[headers[c]] = currentline[c];
				}
				
			result.push(obj);
		
			
			for(var d=0;d<5;d++){
					vars[headers[d]] = currentline[d];
				}
			
			for(var v=24;v<46;v++){
					vars[headers[v]] = currentline[v];
				}
			variants.push(vars);
	
			}
		
		var str2 = JSON.stringify(variants);
		var json2 = JSON.parse(str2)
		var str = JSON.stringify(result);
		var json = JSON.parse(str)
		
		var id = json[1].ID
		db.collection("SAMPLE").insert({"idSample": id, "Var" : json , "idPaz" : idPaz})

				
				
		json2.forEach(function(rec){
			myModule.insertIntoVARIANTS(rec, idPaz)
		})
		
		
	
	})	
})

			
	
