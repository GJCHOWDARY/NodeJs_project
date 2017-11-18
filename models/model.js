'use strict';
module.exports = (sequelize, DataTypes) => {
  var model = sequelize.define('model', {
    name: DataTypes.STRING,
    work: DataTypes.STRING 
  }, {
    classMethods: {
      associate: function(models) {
        model.belongsTo(models.task,{ foreignKey: 'modelId'});
      }
    }
  });
  return model;
};
