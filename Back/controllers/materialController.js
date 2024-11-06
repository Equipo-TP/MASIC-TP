const Material = require('../models/Material');

// Obtener todos los materiales
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo material
exports.createMaterial = async (req, res) => {
  try {
    const material = await Material.create(req.body);
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
