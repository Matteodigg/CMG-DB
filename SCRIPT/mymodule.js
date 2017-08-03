exports.coverage= function( CHROM, POS){

	var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	fs = require('fs');
	var url = 'mongodb://localhost:27017/myproject';
	// Use connect method to connect to the Server
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		var bedLength;
		db.collection("BED").find(
			{"INTER.CHROM" : CHROM , "INTER.START" :{$lt : POS} , "INTER.STOP" : {$gt : POS}}).toArray(function(err,bed){	
				  return bedLength = bed.length;
				// console.log(bedLength + " mymodule")
			})
		console.log(bedLength + " mymodule")
		//return bedLength
		
		})
		
		
	}


// Questa funzione prende in ingresso la riga del JSON convertito nello script convert.js (e non solo) e idPaz generato dal db
// La posso usare solo se il paziente è già stato caricato.
exports.insertIntoVARIANTS = function(json,idPaz){
	var all_incr = 0;
	var het_incr = 0;
	var homo_incr =0;
	// Standard, sempre uguale
	var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	fs = require('fs');
	// nel caso cambiare il nome del folder
	var url = 'mongodb://localhost:27017/myproject';

	// Use connect method to connect to the Server
	// Standard, sempre uguale
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);

		// Scrivo l'id var
		var idVAR = (json.CHROM + "-"+ json.POS + "-"+ json.REF+ "-"+json.ALT)
		// Verifico se l'ID VAR sia presente
		var Vars = db.collection('VARIANTS').find(
			{"idVAR" : idVAR }
		).toArray(function(err,Vars){
			var gen = json.GT.split("/")
			
			// Verifico che la variante sia omozigote o eterozigote
			if(gen[0] != gen[1]) // è ETEROZIGOTE
				{  
				  all_incr  = 1,
				  het_incr  = 1,
				  homo_incr = 0
				}
			else if(gen[0] == gen[1]) // è OMOZIGOTE
				{ all_incr  = 2,
				  het_incr  = 0,
				  homo_incr = 1
				 }
				 
			
			// Se la variante NON C'E' quindi vars.length = 0
			// Allora la inserisco in variants come variante nuova
			if(Vars.length == 0 ){
				db.collection("VARIANTS").insert({
					"idVAR": idVAR,
					"Consequence" : json.Consequence, 
					"SYMBOL" : json.SYMBOL,
					"Feature": json.Feature,
					"EXON": json.EXON,
					"INTRON": json.INTRON,
					"HGVSc": json.HGVSc,
					"HGVSp": json.HGVSp,
					"cDNA_position": json.cDNA_position,
					"CDS_position": json.CDS_position,
					"Protein_position": json.Protein_position,
					"Amino_acids": json.Amino_acids,
					"Codons": json.Codons,
					"Existing_variation": json.Existing_variation,
					"VARIANT_CLASS": json.VARIANT_CLASS,
					"CANONICAL": json.CANONICAL,
					"ENSP": json.ENSP,
					"SIFT": json.SIFT,
					"PolyPhen": json.PolyPhen,
					"GMAF": json.GMAF,
					"CLIN_SIG": json.CLIN_SIG,
					"PUBMED": json.PUBMED, 
					"PAZ_COUNT" : 1, 
					"ALL_COUNT" : all_incr, 
					"HOMO_COUNT" : homo_incr, 
					"HET_COUNT" : het_incr, 
					"ALL_NUM" : 2,
					"SAMPLE_ID" : [json.ID], 
					"PAZ_ID" : [idPaz]
				})
				console.log("VARIANTE INSERITA CON SUCCESSO")
			
			//ALTRIMENTI se la variante è già presente aggiorno solo i count
			} else {
				console.log("VARIANTE GIA' PRESENTE, AGGIORNATA CON SUCCESSO")
				// Se l'id del paziente non è contenuto nell'array PAZ_ID di (VARIANTS-->che abbiamo inserito in Vars)
				// Allora mi avvisa che è un nuovo paziente e mi aggorna i conteggi
				// N.B idPaz != Vars[0].PAZ_ID Verifica che idPaz non sia in OGNI elemento di PAZ_ID
				if(idPaz != Vars[0].PAZ_ID){
					console.log("nuovo paziente con questa variante")
					db.collection("VARIANTS").update(
						// update vuole query + option. In questa query chiedo di prendere OBJECT ID della variante
						{'_id' : Vars[0]._id},
						// e poi pusho i valori di PAZ_ID e SAMPLE_ID e poi incremento i nuovi conteggi
						{ 
							$push :{ SAMPLE_ID : json.ID , PAZ_ID : idPaz},
							$inc: { PAZ_COUNT : 1, 
								    ALL_COUNT : all_incr,
								    HOMO_COUNT: homo_incr,
								    HET_COUNT : het_incr , 
								    ALL_NUM : 2
								  }
								
						}
					)
											
				}
			}
												
		})
	})
}

exports.aggiornaVARIANTS = function(idPaz){
	var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	fs = require('fs');
	var url = 'mongodb://localhost:27017/myproject';

	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
	var docs = db.collection("VARIANTS").find()
	// Per ogni variante vedo se aggiornarla
	docs.forEach(function(docs){

		//Splitto l'ID per prendere chrom pos ref e alt
		var ID = docs.idVAR.split("-")

		// Ora vado a prendere la stessa variante in SAMPLE (se esiste)
		var sample = db.collection('SAMPLE').find({"Var.CHROM":ID[0] , "Var.POS":ID[1] , "Var.REF":ID[2], "Var.ALT" :ID[3]})
			sample.forEach(function(sample){
				console.log("sample")

			// Entro nella collection BED e vedo se la variante cade nell'intervallo definito in bed.
			var bed = db.collection("BED").find(
			// INTER è l'array nella collection BED che contiene tutti i CHROM START e STOP di un sample.
			// $lt significa 'lower than' mentre $gt significa 'greater than' quindi sto chiedendo di trovare la posizione
			// che sia maggiore di start e minore di stop
			// Dopo di che inserisce tutti i valori trovati (in realtà uno solo) dentro l'array bed.
			{"INTER.CHROM" : ID[0] , "INTER.START" :{$lt : ID[1]} , "INTER.STOP" : {$gt : ID[1]}}).toArray(function(err,bed){
				for ( var i = 0; i < sample.Var.length; i++){
					var g = sample.Var[i]
					var gen = g.GT.split("/")
					if(gen[0] != gen[1]) // è ETEROZIGOTE
						{  
						  all_incr  = 1,
						  het_incr  = 1,
						  homo_incr = 0
						}
					else if(gen[0] == gen[1]) // è OMOZIGOTE
						{ all_incr  = 2,
						  het_incr  = 0,
						  homo_incr = 1
						 }	
						console.log(g.ConfermaSanger)				
					console.log("RELOAD VARIANTI IN CORSO" )
					var conferma  = g.ConfermaSanger
					if( conferma === "-" || conferma === "si"){
						console.log("conferma confermata")

						//Se il sample non è in SAMPLE_ID allora aggiorno
						if(sample.ID  != docs.SAMPLE_ID){
							
							db.collection("VARIANTS").update(
								{},
								{ 
									$push :{ SAMPLE_ID :sample.ID , PAZ : idPaz},
									$inc: {PAZ_COUNT : 1, ALL_COUNT : all_incr, HOMO_COUNT: homo_incr,HET_COUNT : het_incr, ALL_NUM : bed.length*2}
								}
							)
						}
					}
					
					// Aggirno i conteggi delle varianti			
					db.collection("VARIANTS").update( 
						{"CHROM": docs.CHROM, "POS": docs.POS , "REF": docs.REF, "ALT" : docs.ALT},
						{ $set: { MAF : docs.ALL_COUNT/docs.ALL_NUM } }
					)
			}
			})
							
		})
		
							
	})
	})
}


exports.getNextSequence = function(name) {
	
	var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	fs = require('fs');
	var url = 'mongodb://localhost:27017/myproject';
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
		
		var ret = db.collection("COUNTERS").findAndModify(
			  {
				query: { idRun: name },
				update: { $inc: { seq: 1 } },
				new: true
			  }
		);
		return ret.seq;
		
	})
}


exports.aggiornaeVARIANTS = function(){
	var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	fs = require('fs');
	var url = 'mongodb://localhost:27017/myproject';
	// Use connect method to connect to the Server
	
	MongoClient.connect(url, function(err, db) {
		console.log(" sei dentro aggiornaVARIANTS in my module")
		var docs = db.collection("VARIANTS").find().forEach(function(docs){
		var ID = docs.idVAR.split("-")
		var sample = db.collection('SAMPLE').find({"Var.CHROM":ID[0] , "Var.POS":ID[1] , "Var.REF":ID[2], "Var.ALT" :ID[3]})
			sample.forEach(function(sample){
				var bed = db.collection("BED").find(
				{"INTER.CHROM" : ID[0] , "INTER.START" :{$lt : ID[1]} , "INTER.STOP" : {$gt : ID[1]}}).toArray(function(err,bed){
					console.log(bed.length)
					
					
				})
			})
		})
	})
}



// Questa funzione richiede:
// - nome del file. Il file in formato JSON (che posso ottenere dallo script convertToJSON.js)
exports.insertPatient = function(json){
	var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	fs = require('fs');
	var url = 'mongodb://localhost:27017/myproject';

	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);

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
			
				}else {
					console.log("Stai inserendo un paziente particolare sei sicuro?")
				}
				
			})
		})
	})
}