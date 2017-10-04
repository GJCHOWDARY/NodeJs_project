var path = require('path');
var db = require(path.resolve('config')).dbConfig;
var qs = require('querystring');
exports.getFeaturedDeals = function(req,res){
	var sqlQuery = "SELECT spt.id,spt.deal_desc,spt.deal_price,spt.product_actual_price,spt.product_deal_desc,spt.cover,"+
				"spt.featured_deal_image,spt.spayeCustomerId, sc.merchant_name,sc.coordinates,spt.mobile_cover "+
				"FROM spaye_deal_txn spt inner join spaye_customer sc on spt.spayeCustomerId = sc.id "+
				"where spt.featured_deal_flag = true and (spt.deal_start_date<current_date() and spt.deal_end_date> current_date());"
	db.get().query(sqlQuery, function (err, result) {
    if (err) {
      return res.status(err.status).json(err);
    }
    res.status(200).json(result);
  });
};
exports.getUser = function(req,res){
	//var sqlQuery1 = "SELECT * FROM spaye_user;"
	//var sqlQuery1="SELECT  id, deal_desc, deal_price, product_actual_price, product_deal_desc, cover FROM spaye_deal_txn; "
 // var sqlQuery1="SELECT spt.id,spt.deal_desc,spt.deal_price,spt.product_actual_price,spt.product_deal_desc,spt.cover,"+
 // 		 "spt.featured_deal_image,spt.spayeCustomerId, sc.merchant_name,sc.coordinates,spt.mobile_cover "+
 // 		 "FROM spaye_deal_txn spt inner join spaye_customer sc on spt.spayeCustomerId = sc.id "+
 // 		 "where spt.featured_deal_flag = true and (spt.deal_start_date<current_date() and spt.deal_end_date> current_date());"
var sqlQuery1="SELECT sdt.id, sdt.deal_desc, sdt.deal_price, sdt.product_actual_price,sdt.deal_end_date, sdt.spayeProductId, sdt.spayeCustomerId, sdt.cover,sc.merchant_name,sc.coordinates,sp.product_name,"+
            " avg(sdv.rating) as average_rating, count(scdc.id) as cart_count FROM spaye_deal_txn as sdt"+
            " INNER JOIN spaye_product as sp on sdt.spayeProductId=sp.id "+
            "INNER JOIN spaye_customer as sc on sdt.spayeCustomerId=sc.id "+
            "LEFT JOIN spaye_deal_review as sdv on sdv.spayeDealTxnId=sdt.id "+
            "LEFT JOIN spaye_consumer_deal_cart as scdc on scdc.spayeDealTxnId=sdt.id AND scdc.status_flag='Added'"+
            " WHERE  sdt.status_flag = 'Active' AND now() BETWEEN sdt.deal_start_date AND sdt.deal_end_date"+
            " GROUP BY sdt.id, sdt.deal_desc, sdt.deal_price, sdt.product_actual_price,sdt.deal_end_date, sdt.cover,sc.merchant_name,sp.product_name ORDER BY RAND() LIMIT 8 ;"
	db.get().query(sqlQuery1, function (err, result) {
    if (err) {
      return res.status(err.status).json(err);
    }
    res.status(200).json(result);
  });
};

exports.getDealsNearMe = function (req,res) {
	var queryParams = req.query;
	var latitude = queryParams.latitude
	var longitude = queryParams.longitude
	var sqlGetDeals = '';

	if(latitude && longitude)
	{
		sqlGetDeals = "SELECT sdt.id, sdt.deal_desc, sdt.deal_price, sdt.product_actual_price, sdt.deal_end_date, sdt.cover, sdt.spayeProductId, sdt.spayeCustomerId, "+
	  "sc.merchant_name,sc.coordinates,sp.product_name, avg(sdv.rating) as average_rating, count(scdc.id) as cart_count, "+
	  "(3959 * acos(cos(radians('"+ latitude +"')) * cos( radians(ST_X(coordinates)) ) * cos( radians(ST_Y(coordinates)) - radians('"+longitude+"')) +sin(radians('"+ latitude +"')) * sin(radians(ST_X(coordinates))))) distance "+
	  "FROM spaye_deal_txn as sdt "+
	  "INNER JOIN spaye_product as sp on sdt.spayeProductId=sp.id "+
	  "INNER JOIN spaye_customer as sc on sdt.spayeCustomerId=sc.id "+
	  "LEFT JOIN spaye_deal_review as sdv on sdv.spayeDealTxnId=sdt.id "+
	  "LEFT JOIN spaye_consumer_deal_cart as scdc on scdc.spayeDealTxnId=sdt.id AND scdc.status_flag='Added' "+
	  "WHERE sdt.status_flag = 'Active' "+
	  "AND now() BETWEEN sdt.deal_start_date AND sdt.deal_end_date "+
	  "GROUP BY sdt.id, sdt.deal_desc, sdt.deal_price, sdt.product_actual_price, sdt.deal_end_date, sdt.cover, "+
	  "sc.merchant_name,sp.product_name ORDER BY distance LIMIT 10;";
	}
	else
	{
		sqlGetDeals = "SELECT sdt.id, sdt.deal_desc, sdt.deal_price, sdt.product_actual_price, sdt.deal_end_date, sdt.cover, sdt.spayeProductId, sdt.spayeCustomerId, "+
	  "sc.merchant_name,sc.coordinates,sp.product_name, avg(sdv.rating) as average_rating, count(scdc.id) as cart_count "+
	  "FROM spaye_deal_txn as sdt "+
	  "INNER JOIN spaye_product as sp on sdt.spayeProductId=sp.id "+
	  "INNER JOIN spaye_customer as sc on sdt.spayeCustomerId=sc.id "+
	  "LEFT JOIN spaye_deal_review as sdv on sdv.spayeDealTxnId=sdt.id "+
	  "LEFT JOIN spaye_consumer_deal_cart as scdc on scdc.spayeDealTxnId=sdt.id AND scdc.status_flag='Added' "+
	  "WHERE sdt.status_flag = 'Active' "+
	  "AND now() BETWEEN sdt.deal_start_date AND sdt.deal_end_date "+
	  "GROUP BY sdt.id, sdt.deal_desc, sdt.deal_price, sdt.product_actual_price, sdt.deal_end_date, sdt.cover, "+
	  "sc.merchant_name,sp.product_name ORDER BY RAND() LIMIT 10;";
	}

	db.get().query(sqlGetDeals, function (err, result) {
    if (err) {
      return res.status(err.status).json(err);
    }
    res.status(200).json(result);
  });
}
