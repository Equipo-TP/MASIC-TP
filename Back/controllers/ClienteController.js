'use strict';

var Cliente = require('../models/cliente');
var Solicitud = require('../models/solicitud'); // Asegúrate de importar el modelo de Solicitud

const registro_cliente = async function(req, res) {
    var data = req.body;
    var cliente_arr = [];
    cliente_arr = await Cliente.find({ email: data.email }, { telefono: data.telefono });
    if (cliente_arr.length == 0) {
        // Registrando
        var reg = await Cliente.create(data);
        res.status(200).send({ data: reg.toJSON() });
    } else {
        res.status(200).send({ message: 'El cliente ya existe en la base de datos', data: undefined });
    }
}

const listar_clientes = async function(req, res) {
    var reg = await Cliente.find().sort({ createdAt: -1 });
    res.status(200).send({ data: reg });
}

const obtener_cliente = async function(req, res) {
  
    const Id = req.params['id'];
    try {
        const reg = await Cliente.findById({_id:Id});
        if (!reg) {
            return res.status(404).send({ message: 'Cliente no encontrado', data: undefined });
        }
        res.status(200).send({ data: reg });
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        res.status(500).send({ message: 'Error al obtener el cliente', data: undefined });
    }
};

const obtener_cliente_por_id = async function(req, res) {
    const id = req.params['id'];
    try {
       
        let cliente = await Cliente.findById({_id:id});
        if (cliente) {
            res.status(200).send({ data: cliente });
        } else {
            res.status(404).send({ message: 'cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el cliente' + id, error });
    }
};

const editar_cliente = async function(req, res) {
    var Id = req.params['id'];
    var data = req.body;
    try {
        
        var reg = await Cliente.findByIdAndUpdate({ _id: Id }, {
            nombre: data.nombre,
            apellidos: data.apellidos,
            email: data.email,
            telefono: data.telefono
        });
        res.status(200).send({ data: reg });
    } catch {
        res.status(200).send({ message: 'No se encuentra', data: undefined });
    }
}

const eliminar_cliente = async function(req, res) {
    var id = req.params['id'];
    try {
        let reg = await Cliente.findByIdAndDelete({ _id: id });
        res.status(200).send({ data: reg });
        console.log("Se ha eliminado correctamente");
    } catch {
        res.status(200).send({ message: 'No se puede eliminar', data: undefined });
        console.log(id);
    }
}

// Nueva función para obtener un cliente junto con sus solicitudes
const obtenerClienteConSolicitudes = async function(req, res) {
    const clienteId = req.params['id'];
    try {
        const cliente = await Cliente.findById(clienteId);
        if (!cliente) {
            return res.status(404).send({ message: 'Cliente no encontrado' });
        }

        // Obtener las solicitudes del cliente
        const solicitudes = await Solicitud.find({ cliente: clienteId }).sort({ createdAt: -1 });

        res.status(200).send({
            cliente,
            solicitudes
        });
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el cliente y sus solicitudes', error });
    }
};

// Exportar las funciones
module.exports = {
    registro_cliente,
    listar_clientes,
    editar_cliente,
    obtener_cliente,
    eliminar_cliente,
    obtener_cliente_por_id,
}

