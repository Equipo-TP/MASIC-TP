'use strict';

const Proyecto = require('../models/proyecto'); // Modelo de Proyecto
const Presupuesto = require('../models/presupuesto'); // Modelo de Presupuesto
const Cliente = require('../models/cliente'); // Modelo de Cliente

const ChatbotController = {};

// Función para normalizar el texto (elimina acentos y convierte a minúsculas)
const normalizeText = (text) => {
    if (typeof text !== 'string') {
        return '';
    }
    return text
        .toLowerCase()
        .normalize('NFD') // Descompone caracteres con acento en base + tilde
        .replace(/[\u0300-\u036f]/g, ''); // Elimina los signos diacríticos (acentos, etc.)
};

ChatbotController.handleMessage = async (req, res) => {
    const userMessage = normalizeText(req.body.message || ''); // Normaliza el mensaje del usuario
    let response;

    const responses = {
        "hola": "¡Hola! ¿En qué puedo ayudarte hoy? Puedes preguntar sobre usuarios, proyectos, presupuestos, clientes o incluso solicitar soporte.<br>",

        "qué puedes hacer":
            `Puedo ayudarte a:<br>
            1. Registrar y gestionar usuarios.<br>
            2. Crear y consultar solicitudes.<br>
            3. Consultar y registrar presupuestos.<br>
            4. Gestionar proyectos asignando técnicos, materiales y horarios.<br>
            5. Gestionar tarifas y cobros.<br>
            Escríbeme sobre cualquiera de estos temas para guiarte paso a paso.<br>`,

        "solicitud":
            `Para registrar una solicitud:<br>
            1. Ve al módulo "Solicitudes" en el menú principal.<br>
            2. Haz clic en "Registrar Nueva Solicitud".<br>
            3. Completa el formulario con los datos del cliente y los detalles de la solicitud.<br>
            4. Haz clic en "Guardar" para finalizar.<br>
            Si necesitas ayuda con algún campo del formulario, házmelo saber.<br>`,

        "usuario":
            `Para gestionar usuarios:<br>
            1. Accede al módulo "Usuarios" desde el menú principal.<br>
            2. Allí puedes:<br>
               - Crear un nuevo usuario haciendo clic en "Registrar Usuario".<br>
               - Editar la información de un usuario existente seleccionándolo de la lista.<br>
               - Eliminar usuarios si ya no son necesarios.<br>
            3. Asegúrate de guardar los cambios después de cada acción.<br>`,

        "guia presupuesto":
            `Para trabajar con presupuestos:<br>
            1. Accede al módulo "Presupuestos" desde el menú principal.<br>
            2. Para registrar un presupuesto, haz clic en "Nuevo Presupuesto" y completa los campos necesarios:<br>
               - Selecciona la solicitud relacionada.<br>
               - Agrega los materiales, luminarias y sus costos.<br>
               - Calcula el IGV y verifica el costo total.<br>
            3. Una vez completado, haz clic en "Guardar".<br>
            4. Puedes consultar presupuestos existentes en la tabla de presupuestos y filtrar por estado.<br>`,

        "guia proyecto":
            `Para gestionar proyectos:<br>
            1. Ve al módulo "Proyectos" en el menú principal.<br>
            2. Haz clic en "Registrar Proyecto" para iniciar un nuevo proyecto.<br>
            3. Completa los datos requeridos:<br>
               - Selecciona un presupuesto aprobado para vincularlo.<br>
               - Asigna técnicos al proyecto.<br>
               - Configura el cronograma indicando fechas de inicio y fin.<br>
            4. Guarda el proyecto para finalizar.<br>
            5. Desde esta sección también puedes:<br>
               - Ver detalles de proyectos en curso.<br>
               - Actualizar el estado de un proyecto (Por realizar, En progreso, Finalizado).<br>`,

        "guia cliente":
            `Para registrar o gestionar clientes:<br>
            1. Accede al módulo "Clientes" en el menú principal.<br>
            2. Haz clic en "Registrar Cliente" para agregar un nuevo cliente.<br>
            3. Llena el formulario con:<br>
               - Nombre y apellidos.<br>
               - Tipo (persona o empresa).<br>
               - RUC, correo electrónico y teléfono.<br>
            4. Guarda los datos para finalizar.<br>
            5. También puedes buscar un cliente en la lista y editar su información si es necesario.<br>`,

        "inventario":
            `Para gestionar el inventario:<br>
            1. Ve al módulo "Inventario" desde el menú principal.<br>
            2. Allí puedes:<br>
               - Agregar nuevos materiales con su descripción, cantidad y costo.<br>
               - Actualizar la cantidad de materiales existentes.<br>
               - Eliminar materiales que ya no sean necesarios.<br>
            3. Utiliza la barra de búsqueda para encontrar materiales rápidamente.<br>`,

        "cobros":
            `Para gestionar cobros:<br>
            1. Accede al módulo "Cobros" desde el menú principal.<br>
            2. Selecciona el proyecto o presupuesto asociado al cobro.<br>
            3. Registra un nuevo pago indicando:<br>
               - Monto, fecha y observaciones.<br>
               - Estado del cobro (Cobrado completamente, Saldo parcial, Por cobrar).<br>
            4. Verifica el saldo restante y guarda la información.<br>`,

        "soporte":
            `Si necesitas soporte técnico:<br>
            1. Asegúrate de haber seguido los pasos indicados para tu consulta.<br>
            2. Si el problema persiste, contacta al administrador del sistema.<br>
            3. Puedes también enviar un correo a soporte@MASIC.com con una descripción detallada del problema.<br>`
    };

    // Busca una respuesta basada en el mensaje del usuario
    response = Object.entries(responses).find(([key]) => userMessage.includes(normalizeText(key)))?.[1];

    // Consultas a la base de datos basadas en palabras clave
    try {
        if (userMessage.includes('datos proyecto')) {
            const proyectos = await Proyecto.find({}, 'Nombre_Proyecto Descripcion Estado');
            if (proyectos.length > 0) {
                response = 'Aquí tienes la lista de proyectos:<br>';
                proyectos.forEach((proyecto) => {
                    response += `<br>- <strong>${proyecto.Nombre_Proyecto}</strong>: ${proyecto.Descripcion} (Estado: ${proyecto.Estado})`;
                });
            } else {
                response = 'No hay proyectos registrados actualmente.';
            }
        }

        if (userMessage.includes('datos presupuesto')) {
            const presupuestos = await Presupuesto.find({}, 'ID_Presupuesto Pago_Total estado_1 estado_2');
            if (presupuestos.length > 0) {
                response = 'Aquí tienes la lista de presupuestos registrados:<br>';
                presupuestos.forEach((presupuesto) => {
                    response += `<br>- ID: ${presupuesto.ID_Presupuesto}<br>  Pago Total: S/ ${presupuesto.Pago_Total}<br>  Estado: ${presupuesto.estado_2}<br>`;
                });
            } else {
                response = 'No hay presupuestos registrados actualmente.';
            }
        }

        if (userMessage.includes('datos cliente')) {
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
        }
    } catch (error) {
        console.error('Error al consultar base de datos:', error);
        response = 'Hubo un error al realizar la consulta. Intenta nuevamente más tarde.';
    }

    // Respuesta predeterminada si no encuentra coincidencia
    response = response || 'Lo siento, no entendí tu mensaje.';

    // Enviar la respuesta al cliente
    res.json({ reply: response });
};

module.exports = ChatbotController;
