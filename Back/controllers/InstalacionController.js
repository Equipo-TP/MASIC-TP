'use strict'

var Instalacion = require('../models/instalacion');

const registro_precio_instalacion = async function(req,res){
    //variable para que reciba toda la data que esta en el cuerpo del request
    var data = req.body;
    var instalacion_arr = [];
    instalacion_arr = await Instalacion.find({tipo_luminaria:data.tipo_luminaria});
    if (instalacion_arr.length == 0) {
          //registrando
            var reg = await Instalacion.create(data);
            res.status(200).send({data:reg.toJSON()});
                
    }else{
        res.status(200).send({message:'El tipo de instalación ya existe en la base de datos', data: undefined});
    }

}

const listar_tarifario = async function(req,res) {
    var reg = await Instalacion.find().sort({createdAt:-1});
    res.status(200).send({data: reg});
}

module.exports = {
    registro_precio_instalacion,
    listar_tarifario
}