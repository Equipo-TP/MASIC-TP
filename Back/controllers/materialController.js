'use strict';

var Material = require('../models/Material');

// Obtener todos los materiales
const registro_material = async function (req, res) {
  var data = req.body;

  var material_arr = await Material.find({ nombre: data.nombre }); 
  if (material_arr.length === 0) {
      if(data.nombre&&data.categoria&&data.stock&&data.unidad_medida){
      // Registrando
      var reg = await Material.create(data);
      res.status(200).send({ 
          
          data: reg.toJSON() });}
    else { res.status(400).send({message: 'Complete todos los datos'});}
  } else {
      res.status(400).send({ message: 'El tipo de material ya existe en la base de datos', data: undefined }); // Cambiar a 400
  }
};
