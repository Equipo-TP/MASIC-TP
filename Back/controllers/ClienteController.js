'use strict'

var Cliente = require('../models/cliente');

const registro_cliente = async function(req,res){
    //variable para que reciba toda la data que esta en el cuerpo del request
    var data = req.body;
    var cliente_arr = [];
    cliente_arr = await Cliente.find({email:data.email}, {telefono:data.telefono});
    if (cliente_arr.length == 0) {
          //registrando
            var reg = await Cliente.create(data);
            res.status(200).send({data:reg.toJSON()});
                
    }else{
        res.status(200).send({message:'El cliente ya existe en la base de datos', data: undefined});
    }

}
const listar_clientes = async function(req,res) {
    var reg = await Cliente.find().sort({createdAt:-1});
    res.status(200).send({data: reg});
}

const obtener_cliente = async function(req, res) {
           var Id = req.params['id'];
           //var data = req.body;
            try {
                var reg = await Cliente.findById({_id:Id});
                console.log({data:reg});
                res.status(200).send({data:reg});
            } catch (error) {
                res.status(200).send({message: "no se pudo encontrar " + Id, data:undefined});
            }
}

const editar_cliente = async function(req, res) {
            var Id = req.params['id'];
            try {
            var data = req.body;
            var reg = await Cliente.findByIdAndUpdate({_id:Id},{
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono
            });
            res.status(200).send({data:reg});
            } catch{
                res.status(200).send({message:'no se escuentra', data: undefined});
            }
}

const eliminar_cliente = async function(req, res) {
    var id = req.params['id'];
    try {
           let reg = await Cliente.findByIdAndDelete({_id:id});
            res.status(200).send({data:reg});
            console.log("se ha eliminado correctamente");

    }
    catch{
        res.status(200).send({message:'no se puede eliminar', data: undefined});
        console.log(id);
    }

}

module.exports = {
    registro_cliente,
    listar_clientes,
    editar_cliente,
    obtener_cliente,
    //eliminar_cliente,
}