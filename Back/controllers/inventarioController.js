const MovimientoInventario = require();
const Material = require('../models/Material');

// Registrar un movimiento (ingreso o egreso)
exports.createMovimiento = async (req, res) => {
  const { id_Material, tipo_mov, cantidad } = req.body;

  try {
    const material = await Material.findByPk(id_Material);
    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    // Actualizar el stock del material
    if (tipo_mov === 1) {
      // Ingreso
      material.stock += cantidad;
    } else if (tipo_mov === 2) {
      // Egreso
      if (material.stock < cantidad) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }
      material.stock -= cantidad;
    }
    await material.save();

    // Crear registro en MovimientosInventario
    const movimiento = await MovimientoInventario.create({
      id_Material,
      tipo_mov,
      cantidad,
      fecha_mov: new Date()
    });

    res.json(movimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
