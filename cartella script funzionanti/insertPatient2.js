var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	
	
	fs.readFile('36.json', 'utf8', function (err, data) {
		if (err) throw err;
		var json = JSON.parse(data);
		json.forEach(function(paz){
			
			var str = paz["Cognome e Nome"].replace("à", "a'").replace(/è/g, "e'").replace(/é/g, "e'").replace(/ò/g, "o'").replace(/ì/g, "i'").replace(/ù/g, "u'")
			db.collection("PATIENTS").find({ "Cognome e Nome": str.toUpperCase , "Data di nascita" : paz["Data di nascita"] , "Data consulenza": paz["Data consulenza"]}).toArray(function(err,pazz){
			  
				if (pazz.length == 0 ){
		// genero l'idPaz attraverso l'unione random di 5 cifre
			
			var idPaz = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 6; i++)
				idPaz += possible.charAt(Math.floor(Math.random() * possible.length));
			
			
			db.collection("PATIENTS").insert(paz);
			db.collection("PATIENTS").update(
							{_id  : paz._id},
							{$set : {"Cognome e Nome" : str.toUpperCase()}}
						)
			console.log(idPaz)		
		    db.collection("PATIENTS").find(
		    { "idPaz" : idPaz }).toArray(function(err,docs){
			  
				if (docs.length == 0 ){
					
						db.collection("PATIENTS").update(
							{_id  : paz._id},
							{$set : {"idPaz" : idPaz}}
						)
					}else {
						 for (var i = 0; i < 6; i++)
							idPaz += possible.charAt(Math.floor(Math.random() * possible.length));
						
						db.collection("PATIENTS").update(
							{_id  : paz._id},
							{$set : {"idPaz" : idPaz}}
						)
					
					}
				})
				//console.log(json["Data di nascita"])
				/*var data = paz["Data di nascita"]
				var res = data.split("/");
				var date = new Date();
				var current_years = date.getFullYear();
				if(res[0].lenght != 2 || res[1].lenght != 2 || res[2].lenght != 4 || parseInt(res[0])< 1 || parseInt(res[0])>31 || parseInt(res[1] ) < 0 || parseInt(res[1]) > 12 || parseInt(res[2]) > current_years)
				{
					console.log("data errata")
				}*/				
			}else {
				console.log("Stai inserendo un paziente particolare sei sicuro?")
			}
			
		})
	})
})
})