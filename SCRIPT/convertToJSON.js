
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
var tsv = require("node-tsv-json");

var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	
	function isLowerCase( char ) {
    return char !== char.toUpperCase();
}
	var nomefile = 'testheader.tsv'
	
	fs.readFile(nomefile, 'utf8', function (err, str) {
		
		var x = str.split('\n')
		var template = "Codice	CognomeNome	Sex	DataNascita	DataConsulenza	Età"
		var errore = 0;
		var header = x[0].replace("\r", "");

		if (header === template ){
			console.log("header presente, procedo con il controllo dei dati")
			
			var head = x[0].split('\t');
			
			for (var i=1; i <= x.length-1; i++){ //perchè la prima riga è l'header
				y = x[i].split('\t');
				
				var CognomeNome= y[1].split(' ')
				for(var e = 0; e <= CognomeNome.length-1; e ++){
					var nome = CognomeNome[e];
					for(var z = 0; z<=nome.length-1 ; z++){
						console.log(nome[z])
						if(nome[z]== ''){
							console.log("Attenzione spazio inaspettato al carattere " + z)
							errore = 1
						}
					}
				}
				for (var c = 0; c<= CognomeNome.length-1; c++){   //per ogni parola dentro CognomeNome controllo che abbia la prima lettera maiuscola
					if (isLowerCase(CognomeNome[c].charAt(0))){
						console.log("CognomeNome non è scritto nel formato corretto alla riga " + i )
						errore = 1;
					}
				}
				
				var Sex = y[2]
				
				if(Sex != "F" && Sex != "M") {
					console.log("Sex non adeguato alla linea " + i)
					errore = 1;
				}
				for (var d = 3; d<=4; d++){
					var data = y[d].split("/");
					var date = new Date();
					var current_years = date.getFullYear()
					var gg		= data[0]
					var mm		= data[1]
					var aaaa	= data[2]
					var cond = gg.length != 2 || mm.length != 2 || aaaa.length != 4 || parseInt(gg)< 1 || parseInt(gg)>31 || parseInt(mm ) < 0 || parseInt(mm) > 12 || parseInt(aaaa) > current_years
					
					if(cond)
					{
						console.log(head[d] + " errata alla riga " + i)
						errore = 1
					}	
				}}
				if(errore === 0){
					console.log("File corretto, procedo alla trasformazione")
					tsv({
						input: nomefile, 
						output: "testheader.json" //array of arrays, 1st array is column names 
						,parseRows: false
					}, function(err, result) {
						if(err) {
							console.error(err);
						}else {
							//console.log(result); 
						}
					})
				}
			
		}else{
			console.log("header non adeguato")
		}
	})
})
			
	
