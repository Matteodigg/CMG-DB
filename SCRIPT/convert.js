//REQUISITI:
// - in input vuole ID PAZ che lo genera random all'inserimento del paziente. VEDI InsertPatients.js
// - Nome del file
// - Formato tsv con header corrette (possiamo aggiungere un controllo nel caso)
// - Posso quindi usarla solo ed esclusivamente su pazienti che sono già stati caricati nel db

const MongoClient = require('mongodb').MongoClient,
assert = require('assert');
fs = require('fs');
const myModule = require('./mymodule');
const _ = require('underscore');
var tsv = require("node-tsv-json");

// Questo va dato in ingresso
var idPaz = "SN-188/11"
var url = 'mongodb://localhost:27017/myproject';
var last = require('array-prototype-last');

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	
	var idVAR = '';
	var nomefile = '/home/minime/git/CMG-DB/SCRIPT/04.tsv'
	var result = [];
	var variants = [];
	
	fs.readFile(nomefile, 'utf8', function (err, tab) {

		console.log('tab')
		//var tsv is the TSV file with headers
	 	var lines = tab.split("\n");

	 	// Qui estraggo l'header e tolgo il carattere di break line /r
	 	var headers = lines.shift().replace('\r','').split("\t");

	 	// Qui aggiungo l'intestazione dell'header ConfermaSanger all'header
		headers.push("ConfermaSanger");

	 	// Ciclo _.each per processare le line contenute in lines  
		_.each(lines, function(line, index, lines){
			// Salta righe vuote
			if (line === "\r" || line === '') {return;}
			else{
			var obj = {};
			var vars = {};
			var currentline=line.replace('\r','').split("\t");
			currentline.push("-");
			// Estraggo i primi 24 campi e poi gli altri da inserire in sample
			for(var j=0;j<24;j++){
				obj[headers[j]] = currentline[j];
			}
			
			
			for(var c=45;c<51;c++){
					obj[headers[c]] = currentline[c];
				}
			
			//Inserisco i valori estratti per ogni linea in una hash (obj) e poi pusho l'hash in un array (result)
			//che serve per la collection SAMPLE	
			result.push(obj);
		
			// I campi da 0-5 a 24-46 vanno in variants (annotazioni variante-specifiche)
			for(var d=0;d<5;d++){
					vars[headers[d]] = currentline[d];
				}
			
			for(var v=24;v<46;v++){
					vars[headers[v]] = currentline[v];
				}

			//Inserisco invece i valori estratti per ogni linea in una hash (vars) e poi pusho l'hash in un array (variants)
			// che serve per la collection VARIANTS	
			variants.push(vars);

			}
		})
		
		// Con stringify trasformo le chiavi e i valori dell'array in una stringa JSON per poi convertirlo in formato JSON
		var str2 = JSON.stringify(variants);
		var str = JSON.stringify(result);

		// Infatti qui converto con il parse in formato JSON --> json2 contiene le varianti con annotazione variante-specifica
		// mentre json contiene le varianti con annotazioni corsa specifiche. 
		var json2 = JSON.parse(str2)
		var json = JSON.parse(str)
		
		// id sarebbe l'ID del sample:
		var id = json[1].ID
		console.log(id)
		db.collection("SAMPLE").insert({"idSample": id, "Var" : json , "idPaz" : idPaz})

		json2.forEach(function(rec){
			myModule.insertIntoVARIANTS(rec, idPaz)
		})

	})

})

			
	
