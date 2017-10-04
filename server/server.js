var express=require("express");
var bodyParser=require('body-parser');
var app = express();
var path = require('path');
var http = require('http');
var db = require(path.resolve('config')).dbConfig;
var controllers = require(path.resolve('api')).controllers,
dealsController = controllers.dealsController,
searchController = controllers.searchController;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
/* route to handle login and registration */

  //Making DB Connection
db.connect(function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  } else {
    console.log('MySQL Successfull')
  }
})
    app.get('/api/getFeaturedDeal', dealsController.getFeaturedDeals);
    app.get('/api/getDealsNearMe', dealsController.getDealsNearMe);
    app.get('/api/searchDealsNearMe', searchController.searchDealsNearMe);
    app.post('/api/sample_post', searchController.samplePostCall);
    app.get('/api/deals/featured_deals', dealsController.getFeaturedDeals);
    app.get('/api/deals/near_me', dealsController.getDealsNearMe);
    app.get('/api/getUser', dealsController.getUser);


    // app.get("/api/getFeaturedDeal",function(req,res){
    //   console.log("success");
    //   var sqlQuery = "SELECT spt.id,spt.deal_desc,spt.deal_price,spt.product_actual_price,spt.product_deal_desc,spt.cover,"+
    // 				"spt.featured_deal_image,spt.spayeCustomerId, sc.merchant_name,sc.coordinates,spt.mobile_cover "+
    // 				"FROM spaye_deal_txn spt inner join spaye_customer sc on spt.spayeCustomerId = sc.id "+
    // 				"where spt.featured_deal_flag = true and (spt.deal_start_date<current_date() and spt.deal_end_date> current_date());"
    // 	db.get().query(sqlQuery, function (err, result) {
    //     if (err) {
    //       return res.status(err.status).json(err);
    //     }
    //     res.status(200).json(result);
    //   });
    // });
    //res.end('Hello World!');

app.listen(8080);
console.log('Server running on http://localhost:8080');
