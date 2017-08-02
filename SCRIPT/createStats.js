var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
var idPaz = "NN-188/11"

var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");

var docs = db.collection("VARIANTS").find()
	docs.forEach(function(docs){
		
		var sample = db.collection('SAMPLE').find({"CHROM":docs.CHROM , "POS":docs.POS , "REF":docs.REF, "ALT" :docs.ALT})
			sample.forEach(function(sample){
				
			var bed = db.collection("BED").find(
			{"INTER.CHROM" : json.CHROM , "INTER.START" :{$lt : json.POS} , "INTER.STOP" : {$gt : json.POS}}).toArray(function(err,bed){
				console.log(bed.length)	

				
							if(sample.GT == "0/1") // è OMOZIGOTE
								{ all_incr  = 1,
								  het_incr  = 1,
								  homo_incr = 0
								}
							else if(sample.GT == "1/1") // è ETEROZIGOTE
								{ all_incr  = 2,
								  het_incr  = 0,
								  homo_incr = 1
								 }
								
								console.log("RELOAD VARIANTI IN CORSO" )
									
									if(sample.ID  != docs.SAMPLE_ID){
									 db.collection("VARIANTS").update(
										{'_id' : Vars[0]._id},
										
										{ 
											$push :{ SAMPLE_ID :sample.ID , PAZ : idPaz},
											$inc: {PAZ_COUNT : 1, ALL_COUNT : all_incr, HOMO_COUNT: homo_incr,HET_COUNT : het_incr, ALL_NUM : bed.length*2}
										}
									)
								}
								
							db.collection("VARIANTS").update( 
								{"CHROM": json.CHROM, "POS": json.POS , "REF": json.REF, "ALT" : json.ALT},
								{ $set: { MAF : docs.ALL_COUNT/docs.ALL_NUM } }
								)
							})
							
						})
							
					})
				})