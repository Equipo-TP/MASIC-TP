'use strict'

const cliente = require('../models/cliente');
var Solicitud = require('../models/solicitud');

const registro_solicitud = async function(req,res){
    //variable para que reciba toda la data que esta en el cuerpo del request
    var data = req.body;
    var solicitud_arr = [];
    solicitud_arr = await Solicitud.find({email:data.email}, {telefono:data.telefono});
    if (solicitud_arr.length == 0) {
          //registrando
            var reg = await Solicitud.create(data);
            res.status(200).send({data:reg.toJSON()});
                
    }else{
        res.status(200).send({message:'La solicitud ya existe en la base de datos', data: undefined});
    }

}
const listar_solicitudes_vendedora = async function(req,res) {
 try {
    var reg = await Solicitud.find({vendedor: req.user._id }).sort({createdAt:-1});
    res.status(200).send({data: reg});} catch(error){
        res.status(500).send({ message: 'Error en la solicitud', error });
    }
}

const listar_solicitudes_administrador = async function(req,res) {
    var reg = await Solicitud.find({estado_1: 'Enviado'}).sort({createdAt:-1});
    res.status(200).send({data: reg});
};

//obtener solicitud por ID 
const obtener_solicitud_por_id = async function(req, res) {
    const id = req.params['id'];
    try {
        // Buscar la solicitud por ID
        let solicitud = await Solicitud.findById({_id:id});
        if (solicitud) {
            res.status(200).send({ data: solicitud });
        } else {
            res.status(404).send({ message: 'Solicitud no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener la solicitud' + id, error });
    }
};

const editar_solicitud = async function(req, res) {
    var Id = req.params['id'];
    try {
    var data = req.body;
    var reg = await Solicitud.findByIdAndUpdate({_id:Id},{
        vendedor: data.vendedor,
        cliente: data.cliente,
        caracteristicas_obra: data.caracteristicas_obra,
        descripcion_servicio: data.descripcion_servicio,
        observaciones: data.observaciones,
        estado_1: data.estado_1,
        estado_2: data.estado_2,
        presupuesto: data.presupuesto,
    });
    res.status(200).send({data:reg});
    } catch{
        res.status(200).send({message:'no se escuentra', data: undefined});
    }
};

module.exports = {
    registro_solicitud,
    listar_solicitudes_vendedora,
    listar_solicitudes_administrador,
    obtener_solicitud_por_id,
    editar_solicitud,
}