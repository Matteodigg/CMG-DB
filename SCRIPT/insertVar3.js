
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    fs = require('fs');
	CODICE_SAMPLE = "CL-376/10"
const myModule = require('./mymodule');
	// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");
  
	fs.readFile('04.json', 'utf8', function (err, data) {
		if (err) throw err;
		var json = JSON.parse(data); // così definito è un array
		
		var j= 0;
			
		json.forEach(function(json,j){
	
			j++;

			var docs = db.collection('SAMPLE').find(
			{$and :[ {Codice : CODICE_SAMPLE},{Var :{$elemMatch : {"CHROM": json.CHROM , "POS": json.POS , "REF": json.REF, "ALT" : json.ALT}}}]}
			).toArray(function(err,docs){
		
			
		
				if (docs.length == 0 ){
					
					db.collection('SAMPLE').update(
						{ Codice :  CODICE_SAMPLE}, //query
						{ $push : { Var :  json  } },  //cosa inserisci 
						{ upsert: false }) // se non esiste nessuna collezione che soddisfa la query non la crea
						console.log( "Ho inserito una bellissima variante nel PAZIENTE" + j)
						var bedLength = myModule.coverage(json.CHROM, json.POS)
						myModule.insertIntoVARIANTS(json,bedLength)
						/*var Vars = db.collection('VARIANTS').find(
							 {"CHROM": json.CHROM , "POS": json.POS , "REF": json.REF, "ALT" : json.ALT}
							).toArray(function(err,Vars){
							if(json.GT == "0/1")
								{all_incr = 1,
								 het_incr = 1,
								 homo_incr = 0
								}
							else if(json.GT == "1/1")
								{all_incr = 2,
								 het_incr = 0,
								 homo_incr = 1
								 }
							
							if(Vars.length == 0 ){
								db.collection("VARIANTS").insert({"CHROM": json.CHROM , "POS": json.POS , "REF": json.REF, "ALT" : json.ALT, "ID" : ".", "PAZ_COUNT" : 1, "SAMPLE":[CODICE_SAMPLE], "ALL_COUNT" : parseInt(json.AC, 10), "HOMO_COUNT" : homo_incr, "HET_COUNT" : het_incr, "ALL_NUM" :2,  "ID_RUN" : [json.ID]})
								console.log("la variante non era presente in VARIANTS")
								
							} else {
									var docs = db.collection("VARIANTS").find({'_id' : Vars[0]._id});
							docs.forEach(function(docs){
																		
								db.collection("VARIANTS").update(
									{'_id' : Vars[0]._id},
									
									{ 
										$push :{ ID_SAMPLE:CODICE_SAMPLE},
										$inc: {PAZ_COUNT : 1, ALL_COUNT : parseInt(json.AC, 10), HOMO_COUNT: homo_incr,HET_COUNT : het_incr , ALL_NUM : 2}
									
									}
								)
								var docs = db.collection("VARIANTS").find({'_id' : Vars[0]._id});
								docs.forEach(function(docs){

											 db.collection("VARIANTS").update( 
											 {'_id' : Vars[0]._id},
											 { $set: { MAF : docs.ALL_COUNT/docs.ALL_NUM } }
										   )
								})
							
							})
							}
						})*/
						

					
				} else {
					console.log("variante gia' presente nel SAMPLE " + j);	
					}
				})	     
		});
	})
})

  
  
  
  
  
  
  
  
 