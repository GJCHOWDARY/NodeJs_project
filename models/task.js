'use strict';
module.exports = (sequelize, DataTypes) => {
  var task = sequelize.define('task', {
    name: DataTypes.STRING,
    work: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        task.hasMany(models.model,{ foreignKey: 'modelId'});
      }
    }
  });
  return task;
};
