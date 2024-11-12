const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovimientoInventario = sequelize.define('MovimientoInventario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_Material: DataTypes.INTEGER,
  tipo_mov: DataTypes.INTEGER,
  cantidad: DataTypes.INTEGER,
  fecha_mov: DataTypes.DATE,
}, {
  tableName: 'MovimientosInventario',
  timestamps: false
});

module.exports = MovimientoInventario;
