exports.coverage= function( CHROM, POS){

	var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	fs = require('fs');
	var url = 'mongodb://localhost:27017/myproject';
	// Use connect method to connect to the Server
	var bedLength;
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		
		db.collection("BED").find(
			{"INTER.CHROM" : CHROM , "INTER.START" :{$lt : POS} , "INTER.STOP" : {$gt : POS}}).toArray(function(err,bed){	
				 bedLength = bed.length;
				 console.log(bedLength + " mymodule")
			})
		
		})
		return bedLength
		
	}

exports.insertIntoVARIANTS = function(json,bedLength,idPaz){
	//console.log(idPaz)
	 idPaz= idPaz || 0;
	var all_incr;
	var het_incr;
	var homo_incr;
	var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
	fs = require('fs');
	var url = 'mongodb://localhost:27017/myproject';
	// Use connect method to connect to the Server
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		
		var Vars = db.collection('VARIANTS').find(
			{"CHROM": json.CHROM , "POS": json.POS , "REF": json.REF, "ALT" : json.ALT}
		).toArray(function(err,Vars){
			if(json.GT == "0/1") // è ETEROZIGOTE
				{  
				  all_incr  = 1,
				  het_incr  = 1,
				  homo_incr = 0
				}
			else if(json.GT == "1/1") // è OMOZIGOTE
				{ all_incr  = 2,
				  het_incr  = 0,
				  homo_incr = 1
				 }					 
			if(Vars.length == 0 ){
				db.collection("VARIANTS").insert({"CHROM": json.CHROM , "POS": json.POS , "REF": json.REF, "ALT" : json.ALT, "PAZ_COUNT" : 1, "ALL_COUNT" : all_incr, "HOMO_COUNT" : homo_incr, "HET_COUNT" : het_incr, "ALL_NUM" : bedLength*2,  "SAMPLE_ID" : [json.ID], "PAZ_ID" : [idPaz]})
				console.log("VARIANTE INSERITA CON SUCCESSO")
			} else {
				console.log("VARIANTE GIA' PRESENTE, AGGIORNATA CON SUCCESSO")
				if (idPaz === 0){
					db.collection("VARIANTS").update(
									{'_id' : Vars[0]._id},
									
									{ 
										$push :{ ID_SAMPLE:CODICE_SAMPLE},
										$inc: {PAZ_COUNT : 1, ALL_COUNT : parseInt(json.AC, 10), HOMO_COUNT: homo_incr,HET_COUNT : het_incr , ALL_NUM : 2}
									
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
								$inc: {PAZ_COUNT : 1, ALL_COUNT : all_incr, HOMO_COUNT: homo_incr,HET_COUNT : het_incr , ALL_NUM : bedLength*2}
									
							}
						)
												
					}
				}
												
			}	
		})
	})
}