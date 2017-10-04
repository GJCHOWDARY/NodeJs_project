// const http = require('http');
var path = require('path');
var db = require(path.resolve('config')).dbConfig;
var qs = require('querystring');


exports.searchDealsNearMe = function(req,res){
	// var jsonString = '';
    // query.on('data', function (data) {
    // 	jsonString += data;
    // 	console.log("data inseide: " + jsonString);
    // });
    var body ='';
    req.on('data', function(chunk){
        body += chunk;
        console.log("Came to on")
    });

    req.on('end', function(){
    		console.log("Came to end")
        var fbResponse = JSON.parse(body);
        console.log("Got a response: ", fbResponse.picture);
    });
    var qryString = JSON.stringify(req.query);
		console.log("query Str : " + qryString);



	// var mystring = (query.query).toString();
	// var dataString = JSON.parse(query.query);
	
	// var obj = JSON.parse(dataString);
	// console.log("obj: " + obj);
	// console.log("obj: " + obj(0));

	// var keys = Object.keys(obj);
	// for (var i = 0; i < keys.length; i++) {
	// 	console.log("Came to For")
	//   console.log(obj[keys[i]]);		
	// }
	// //querystring.stringify(data);

	console.log("Mystr:" +mystring);
	console.log("Data sting :" + dataString);
	// console.log("another String :" +anotherTest);
	// console.log(JSON.stringify(mystring));
	// console.log(JSON.stringify(mystring));
	// console.log(JSON.parse(mystring));
	// var sqlSearch = "searchTerm:" + req.query.query + "Lat:"  + req.query.latitude + "Long: "+ req.query.longitude;
	// console.log(sqlSearch);
	var distance = 25;
	if (req.query.distance)
	{
		distance = req.query.distance
	}
	var searchQuery = "SELECT sdt.*,( 3959 * acos(cos(radians('"+ req.query.latitude +"')) * cos( radians(ST_X(coordinates)) ) * cos( radians(ST_Y(coordinates)) - radians('"+req.query.longitude+"')) +sin(radians('"+ req.query.latitude +"')) * sin(radians(ST_X(coordinates))))) distance,"+
										// "CONCAT(\"{"+'\\"' +"latitude"+'\\"' +":\", ST_X(coordinates), \","+'\\"' +"longitude"+'\\"' +":\", ST_Y(coordinates),\"\}\") as coordinates "+
										"CONCAT(\"latitude"+'\\"' +":\", ST_X(coordinates), \","+'\\"' +"longitude"+'\\"' +":\", ST_Y(coordinates)) as coordinates "+
										"FROM spaye_deal_txn sdt INNER JOIN spaye_customer sc ON " +
										"sc.id = sdt.spayeCustomerId LEFT JOIN spaye_product sp ON " +
										"sdt.spayeProductId = sp.id WHERE sc.status_flag = 'Active' and sdt.status_flag = 'Active' and ("+
										"lower(sdt.product_deal_desc) like '%"+req.query.query+"%' or lower(sdt.product_specs ) like '%"+req.query.query+"%' or lower(sp.product_name ) like '%"+req.query.query+"%') "+ 
										"HAVING distance < '"+distance+"' ORDER BY distance ASC;"

	db.get().query(searchQuery, function (err, result) {
    if (err) {
      return res.status(err.status).json(err);
    }
    res.status(200).json(result);
  });
}

exports.samplePostCall = function(req,res,next){
	// if (req.method == 'POST') {
    var jsonString = '';
    req.on('data', function (data) {
    	jsonString += data;
    	// Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (jsonString.length > 1e6)
      	req.connection.destroy();
    });
    req.on('end', function () {
    	var requestData = JSON.parse(jsonString);
    	console.log(requestData);
    	console.log(requestData.grant_type);
    });
  // }
  res.status(200).json({status:true});
}