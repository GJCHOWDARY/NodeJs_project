var fs = require('fs');
var database =require('./database');
var mysql = require('mysql'),
async = require('async');
var migration = require('mysql-migration');
var path = require('path');


var environment_db_config = function() {
    var environment = process.env.NODE_ENV;
    console.log(environment);
    return database[environment];
}();

var state = {
  pool: null,
}

exports.connect = function(done){
	state.pool = mysql.createPool({
		host: environment_db_config.host,
  	user: environment_db_config.username,
  	password: environment_db_config.password,
  	database: environment_db_config.database
	})
  console.log("good");
	done()
}
migration.init(connect, __dirname + '/migrations/migration.js');

exports.get = function() {
  return state.pool
  console.log("good");
}
