var fs        = require('fs'),
    path      = require('path'),
    Sequelize = require('sequelize'),
    lodash    = require('lodash'),
    config    = require(path.resolve('config')).database,
    logger    = require('../utils/logger'),
    db        = {};


var environment_db_config = function() {
    var environment = process.env.NODE_ENV;
    return config[environment];
}();

var sequelize = new Sequelize(environment_db_config.database, environment_db_config.username, environment_db_config.password, {
    host: environment_db_config.host,
    port: environment_db_config.port,
    dialect: 'mysql',
    omitNull: null,
    //logging: logger.info,
    pool: {
        max: 5,
        min: 2,
        idle: 10000
    },
    timezone: '+05:30'
});

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);
