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

//obtener tarifa por id
const obtener_tarifario_por_id = async function(req, res) {
    const id = req.params['id'];
    try {
        // Buscar la tarifa por ID
        let instalacion = await Instalacion.findById({_id:id});
        if (instalacion) {
            res.status(200).send({ data: instalacion });
        } else {
            res.status(404).send({ message: 'Tarifa no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener la tarifa' + id, error });
    }
};

const editar_tarifa = async function(req, res) {
    var Id = req.params['id'];
    try {
    var data = req.body;
    var reg = await Instalacion.findByIdAndUpdate({_id:Id},{
        tipo_luminaria: data.tipo_luminaria,
        descripcion: data.descripcion,
        precio: data.precio
    });
    res.status(200).send({data:reg});
    } catch{
        res.status(200).send({message:'no se escuentra', data: undefined});
    }
};

//elimina tarifa segun id
const eliminar_tarifa = async function(req, res) {
    const id = req.params.id;
    try {
        // Buscar y eliminar la tarifa por su ID
        let tarifaEliminada = await Instalacion.findByIdAndDelete(id);
        if (tarifaEliminada) {
            res.status(200).send({ message: 'Tarifa eliminada correctamente', data: tarifaEliminada });
        } else {
            res.status(404).send({ message: 'Tarifa no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar la tarifa', error });
    }
};


module.exports = {
    registro_precio_instalacion,
    listar_tarifario,
    obtener_tarifario_por_id,
    editar_tarifa,
    eliminar_tarifa
}