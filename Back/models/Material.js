const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Material = sequelize.define('Material', {
  id_Material: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  categoria: DataTypes.INTEGER,
  stock: DataTypes.INTEGER,
  fecha_registro: DataTypes.DATE,
  unidad_medida: DataTypes.STRING,
}, {
  tableName: 'Materiales',
  timestamps: false
});

module.exports = Material;
