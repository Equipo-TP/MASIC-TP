'use strict';

const Proyecto = require('../models/proyecto'); // Modelo de Proyecto
const Presupuesto = require('../models/presupuesto'); // Modelo de Presupuesto
const Cliente = require('../models/cliente'); // Modelo de Cliente

const ChatbotController = {};

ChatbotController.handleMessage = async (req, res) => {
    const userMessage = req.body.message?.toLowerCase() || '';
    let response;

    const responses = {
        hola: '¡Hola! ¿En qué puedo ayudarte hoy?',
        usuarios: 'Puedes gestionar usuarios desde la sección "Gestionar Usuarios".',
        tarifas: 'Puedes gestionar tarifas desde la opción "Gestionar Tarifas".',
    };

    // Comprueba si el mensaje contiene alguna palabra clave predefinida
    response = Object.entries(responses).find(([key]) => userMessage.includes(key))?.[1];

    // Si el mensaje incluye "proyecto", consulta la base de datos de proyectos
    if (userMessage.includes('proyecto')) {
        try {
            const proyectos = await Proyecto.find({}, 'Nombre_Proyecto Descripcion Estado');
            if (proyectos.length > 0) {
                response = 'Aquí tienes la lista de proyectos:<br>';
                proyectos.forEach((proyecto) => {
                    response += `<br>- <strong>${proyecto.Nombre_Proyecto}</strong>: ${proyecto.Descripcion} (Estado: ${proyecto.Estado})`;
                });
            } else {
                response = 'No hay proyectos registrados actualmente.';
            }
        } catch (error) {
            console.error('Error al consultar proyectos:', error);
            response = 'Hubo un error al consultar los proyectos. Intenta nuevamente más tarde.';
        }
    }

    // Si el mensaje incluye "presupuesto", consulta la base de datos de presupuestos
    if (userMessage.includes('presupuesto')) {
        try {
            const presupuestos = await Presupuesto.find({}, 'ID_Presupuesto Pago_Total estado_1 estado_2');
            if (presupuestos.length > 0) {
                response = 'Aquí tienes la lista de presupuestos registrados:<br>';
                presupuestos.forEach((presupuesto) => {
                    response += `<br>- ID: ${presupuesto.ID_Presupuesto}<br>  Pago Total: S/ ${presupuesto.Pago_Total}<br>  Estado: ${presupuesto.estado_1}, ${presupuesto.estado_2}<br>`;
                });
            } else {
                response = 'No hay presupuestos registrados actualmente.';
            }
        } catch (error) {
            console.error('Error al consultar presupuestos:', error);
            response = 'Hubo un error al consultar los presupuestos. Intenta nuevamente más tarde.';
        }
    }

    // Si el mensaje incluye "cliente", consulta la base de datos de clientes
    if (userMessage.includes('cliente')) {
        try {
            const clientes = await Cliente.find({}, 'nombre apellidos tipo email telefono');
            if (clientes.length > 0) {
                response = '👥 <strong>Lista de Clientes Registrados:</strong><br>';
                clientes.forEach((cliente, index) => {
                    response += `<br>${index + 1}. <strong>Nombre:</strong> ${cliente.nombre} ${cliente.apellidos || ''}<br>` +
                                `   <strong>Tipo:</strong> ${cliente.tipo}<br>` +
                                `   <strong>Email:</strong> ${cliente.email}<br>` +
                                `   <strong>Teléfono:</strong> ${cliente.telefono}<br>`;
                });
            } else {
                response = 'No hay clientes registrados actualmente.';
            }
        } catch (error) {
            console.error('Error al consultar clientes:', error);
            response = 'Hubo un error al consultar los clientes. Intenta nuevamente más tarde.';
        }
    }

    // Respuesta predeterminada si no encuentra una coincidencia
    response = response || 'Lo siento, no entendí tu mensaje.';

    res.json({ reply: response });
};

module.exports = ChatbotController;