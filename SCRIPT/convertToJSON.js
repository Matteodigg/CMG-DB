// Questa funzione converte da TSV in JSON. Funziona SOLO PER I PAZIENTI
// Requisiti:
// - nome del file in tsv
// - l'header deve essere uguale a quella proposta nello script.

var MongoClient = require('mongodb').MongoClient,
assert = require('assert');
fs = require('fs');
const _ = require('underscore');
var tsv = require("node-tsv-json");
const myModule = require('./mymodule');
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the Server
// la variabile db la ottengo in uscita dalla funzione MongoClient.connect (autoreferenziata)
// Se lavoro sul db devo mettere tutto dentro questa funzione
MongoClient.connect(url, function(err, db) {

	// assert.equal consente di avere un messaggio d'errore in uscita in base all'errore inserito.
	assert.equal(null, err);
	
	// Funzione per verificare che sia minuscolo
	function isLowerCase( char ) {
    return char !== char.toUpperCase();
}
	
	// Imposto nome del file
	var nomefile = 'testheader.tsv'
	
	fs.readFile(nomefile, 'utf8', function (err, str) {
		// Splitto il file ed estraggo header
		var x = str.split('\n')
		var template = "Codice	CognomeNome	Sex	DataNascita	DataConsulenza	Età"
		var errore = 0;
		var header = x.shift().replace('\r','');

		// Se header è uguale a template allora procedo
		if (header === template ){
			console.log("header presente, procedo con il controllo dei dati")

			//Splittiamo header
			header = header.split('\t');

			//Processo ora tutte le righe del file tsv
			_.each(x, function(line, index, x){

				// Splitto la riga corrente
				y = line.replace('\r','').split('\t');

				// Splitto i nomi e cognomi e controllo che siano formattati adeguatamente
				var CognomeNome = y[header.indexOf('CognomeNome')].split(/ |\t/)

				console.log(CognomeNome)

				var Clean = []

				// Controllo che nomi e cognomi non contengano spazi aggiuntivi o lettere accentate
				_.each(CognomeNome, function(Name, index, CognomeNome){
					if (Name == ''){
						return;
					}
					else{
						// Verifico le lettere accentate
						Name.replace("à", "a'").replace(/è|é/g, "e'").replace(/ò/g, "o'").replace(/ì/g, "i'").replace(/ù/g, "u'")
						}
						Clean.push(Name)

					})
				
				var Sex = y[header.indexOf('Sex')]
				
				// Verifichiamo che abbia solo valori F o M
				if(Sex != "F" && Sex != "M") {
					errore = 1;
				}

				//Verifichiamo le sezioni DATA che siano correttamente formattate
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
				}
			})
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
							console.log(result); 
						}
					})
					//QUI INSERISCO IL MODULO INSERTPATIENT
				}
			
		}else{
			console.log("header non adeguato")
		}
	})
})