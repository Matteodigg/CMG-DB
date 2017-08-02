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

exports.insertIntoVARIANTS = function(json,idPaz){
	idPaz= idPaz || 0;
	var all_incr = 0;
	var het_incr = 0;
	var homo_incr =0;
	var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	fs = require('fs');
	var url = 'mongodb://localhost:27017/myproject';
	// Use connect method to connect to the Server
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		var bedLength;
		db.collection("BED").find(
			{"INTER.CHROM" : json.CHROM , "INTER.START" :{$lt : json.POS} , "INTER.STOP" : {$gt : json.POS}}).toArray(function(err,bed){	
				  return bedLength = bed.length;
			})
		var idVAR = (json.CHROM + "-"+ json.POS + "-"+ json.REF+ "-"+json.ALT)
		var Vars = db.collection('VARIANTS').find(
			{"idVAR" : idVAR }
		).toArray(function(err,Vars){
			var gen = json.GT.split("/")
			
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
			//else{}
				
				//console.log( typeof all_incr)
				//console.log(json.CHROM)
				//console.log(json.POS)
				//console.log(json.GT)
				
				 
			
			
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
					"ALL_NUM" : bedLength*2,
					"SAMPLE_ID" : [json.ID], 
					"PAZ_ID" : [idPaz]
				})
				console.log("VARIANTE INSERITA CON SUCCESSO")
			} else {
				console.log("VARIANTE GIA' PRESENTE, AGGIORNATA CON SUCCESSO")
				if (idPaz === 0){
					
					db.collection("VARIANTS").update(
									{'_id' : Vars[0]._id},
									
									{ 
										$push :{ ID_SAMPLE:CODICE_SAMPLE},
										$inc: {PAZ_COUNT : 1, ALL_COUNT : all_incr, HOMO_COUNT: homo_incr,HET_COUNT : het_incr , ALL_NUM : bedLength*2}
									
									}
								)
				}
				else{
					if(idPaz != Vars[0].PAZ_ID){
						console.log("nuovo paziente con questa variante")
						db.collection("VARIANTS").update(
							{'_id' : Vars[0]._id},
									
							{ 
								$push :{ SAMPLE_ID : json.ID , PAZ_ID : idPaz},
								$inc: { PAZ_COUNT : 1, 
									    ALL_COUNT : all_incr,
									    HOMO_COUNT: homo_incr,
									    HET_COUNT : het_incr , 
									    ALL_NUM : bedLength*2
									  }
									
							}
						)
												
					}
				}
												
			}
		})
	})
}

exports.aggiornaVARIANTS = function(){
	var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	fs = require('fs');
	var url = 'mongodb://localhost:27017/myproject';
	// Use connect method to connect to the Server
	
	MongoClient.connect(url, function(err, db) {
	console.log(" sei dentro aggiornaVARIANTS in my module")
	var docs = db.collection("VARIANTS").find()
	docs.forEach(function(docs){
		var ID = docs.idVAR.split("-")
		var sample = db.collection('SAMPLE').find({"Var.CHROM":ID[0] , "Var.POS":ID[1] , "Var.REF":ID[2], "Var.ALT" :ID[3]})
			sample.forEach(function(sample){
			var bed = db.collection("BED").find(
			{"INTER.CHROM" : ID[0] , "INTER.START" :{$lt : ID[1]} , "INTER.STOP" : {$gt : ID[1]}}).toArray(function(err,bed){
				console.log(sample.Var.length)
				//for each( var in sample.Var)
				//var g = sample.Var[i]
				//console.log(g.GT)
				//var gen = g.GT.split("/")
				/*if(gen[0] != gen[1]) // è ETEROZIGOTE
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
									
				console.log("RELOAD VARIANTI IN CORSO" )
				console.log(sample.ConfermaSanger)
				if("sample.Var.ConfermaSanger" === "-" || "sample.Var.confermaSanger" == "si"){
					if(sample.ID  != docs.SAMPLE_ID){
						db.collection("VARIANTS").update(
							{'_id' : Vars[0]._id},
							{ 
								$push :{ SAMPLE_ID :sample.ID , PAZ : idPaz},
								$inc: {PAZ_COUNT : 1, ALL_COUNT : all_incr, HOMO_COUNT: homo_incr,HET_COUNT : het_incr, ALL_NUM : bed.length*2}
							}
						)
					}
				}
								
				db.collection("VARIANTS").update( 
					{"CHROM": docs.CHROM, "POS": docs.POS , "REF": docs.REF, "ALT" : docs.ALT},
					{ $set: { MAF : docs.ALL_COUNT/docs.ALL_NUM } }
				)*/
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