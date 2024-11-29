import axios from 'axios';

const API = 'http://localhost:8000/api';
export const listarPresupuestosAprobados = async () =>  axios.get(`${API}/listar_presupuestos_aceptados_para_proyectos`);

// Función para registrar un usuario (usuarios normales)
export const registrousuarioRequest = async (user) => axios.post(`${API}/registro_usuario`, user);

// Función para iniciar sesión
export const loginRequest = async (user) => axios.post(`${API}/login_user`, user);

// Función para listar todos los usuarios
export const listarUsuariosRequest = async () => axios.get(`${API}/listar_usuarios`);

// Función para listar todos los usuarios por rol
export const listarUsuariosPorRolRequest = async (rol) => axios.get(`${API}/listar_usuarios_por_rol/${rol}`);

// Función para eliminar un usuario por ID
export const eliminarUsuarioRequest = async (id) => axios.delete(`${API}/eliminar_usuario/${id}`);


// ------ Manejo de Clientes ------

// Función para registrar una solicitud de cliente
export const registrarClienteRequest = async (cliente) => axios.post(`${API}/registro_cliente`, cliente);

export const obtenerClienteConSolicitudesRequest = async (id) => axios.post(`${API}/obtenerSolicitudesPorCliente/${id}`);

// Función para obtener un cliente específico por ID
export const obtenerClienteRequest = async (id) => {
  try {
      const response = await axios.get(`${API}/obtener_cliente_por_id/${id}`);
      return response.data; // Retorna los datos del cliente
  } catch (error) {
      console.error('Error al obtener el cliente:', error);
      throw error;
  }
};

export const crearProyectoRequest = async (data) => axios.post(`${API}/registrar_proyecto`, data); 
// Función para actualizar un cliente específico por ID
export const actualizarClienteRequest = async (id, cliente) => axios.put(`${API}/editar_cliente/${id}`, cliente);


export const obtenerUserRequest = async (id) => axios.post(`${API}/actualizar_usuario/${id}`);
export const editarUserRequest = async (id, user) => axios.put(`${API}/actualizar_usuario/${id}`, user);

export const registroSolicitudRequest = async (data) => axios.post(`${API}/registro_solicitud`, data);
export const listarSolicitudesVendedoraRequest = async (headers) => {
  
    return await axios.get('http://localhost:8000/API/listar_solicitudes_vendedora', { 
      headers, 
    });
  };

export const obtenerSolicitudPorIdRequest = async (id) => axios.post(`${API}/obtener_solicitud_por_id/${id}`);
export const editarSolicitudRequest = async (id, data) => axios.put(`${API}/editar_solicitud/${id}`, data);

export const registroClienteRequest = async (data) => axios.post(`${API}/registro_cliente`, data);
export const listarClientesRequest = async () => axios.get(`${API}/listar_clientes`);
export const obtenerClientePorIdRequest = async (id) => axios.post(`${API}/obtener_cliente_por_id/${id}`);
export const editarClienteRequest = async (id, data) => axios.put(`${API}/editar_solicitud/${id}`, data);

export const registrarTarifaRequest = async (tarifa) => axios.post(`${API}/registro_tarifa`, tarifa);
export const listarTarifasRequest = async () => axios.get(`${API}/listar_tarifas`);
export const eliminarTarifaRequest = async (id) => axios.delete(`${API}/eliminar_tarifa/${id}`);
export const obtenerTarifaRequest = async (id) => axios.get(`${API}/obtener_tarifa_por_id/${id}`);
export const editarTarifaRequest = async (id, tarifa) => axios.put(`${API}/editar_tarifa/${id}`, tarifa);

export const obtener_cliente_por_idRequest = async (id) => { return await axios.post(`${API}/obtener_cliente_por_id/${id}`); };
export const listarSolicitudesRequest = async () => { return await axios.get(`${API}/listar_solicitudes_aprobadas_para_presupuesto`); };
export const actualizarEstadoSolicitudRequest = async (id, estado_2) => { return await axios.put(`${API}/editar_solicitud/${id}`, { estado_2 }); };
export const obtener_solicitud_por_idRequest = async (id) => { return await axios.post(`${API}/obtener_solicitud_por_id/${id}`); };

export const registrarPresupuestoRequest = async (presupuesto) => axios.post(`${API}/registro_presupuesto`, presupuesto);
export const obtenerPresupuestoRequest = async (id,headers) => axios.get(`${API}/obtener_presupuesto_por_id_solicitud/${id}`, { headers });
export const obtenerPresupuestoIDRequest = async (id,headers) => axios.get(`${API}/ver_presupuesto_id/${id}`, { headers });
export const editarPresupuestoRequest = async (id, presupuesto, headers) => axios.put(`${API}/editar_presupuesto/${id}`, presupuesto, { headers });
export const editarPresupuestoAdminRequest = async (id, presupuesto, headers) => axios.put(`${API}/editar_presupuesto_admin/${id}`, presupuesto, { headers });

export const listarPresupuestosRequest = async (headers) => { return await axios.get('http://localhost:8000/API/listar_presupuestos', { headers, });};

//export const listarPresupuestosRequest = async () => axios.get(`${API}/listar_presupuestos`);
export const eliminarPresupuestoRequest = async (id) => axios.delete(`${API}/eliminar_presupuesto/${id}`);
export const listarPresupuestosVendedoraRequest = async (headers) => { return axios.get(`${API}/listar_presupuestos_vendedora`, { headers }); };
export const listar_proyectos_por_tecnicoRequest = async (headers) => { return axios.get(`${API}/gestionar_proyectos_tecnico`, { headers }); };


export const obtenerUsuarioRequest = async (id) => {return await axios.get(`${API}/usuarios/${id}`);};
export const obtener_usuario_por_idRequest = async (id) => {return await axios.post(`${API}/obtener_usuario_por_id/${id}`);};
export const actualizarUsuarioRequest = async (id, data) => {return await axios.put(`/api/usuarios/${id}`, data);};

// ------ Manejo de Almacén ------

// Función para listar todos los almacenes
export const listarAlmacenesRequest = async () => axios.get(`${API}/listar_materiales`);

// Función para obtener un almacén específico por ID
export const obtenerAlmacenRequest = async (id) => axios.get(`${API}/obtener_almacen/${id}`);

// Función para registrar un nuevo almacén
export const registrarAlmacenRequest = async (almacen) => axios.post(`${API}/registro_almacen`, almacen);

// Función para actualizar un almacén específico por ID
export const actualizarAlmacenRequest = async (id, almacen) => axios.put(`${API}/editar_almacen/${id}`, almacen);

// Función para eliminar un almacén específico por ID
export const eliminarAlmacenRequest = async (id) => axios.delete(`${API}/eliminar_material/${id}`);

export const inventarioAlmacenRequest = async (id) => axios.get(`${API}/obtener_movimiento/${id}`);

export const registrarMovimientoRequest = async (movimiento) => axios.post(`${API}/registrar_movimiento`, movimiento);

export const listarInventarioRequest = async () => axios.get(`${API}/listar_movimientos'${id}`);

export const eliminarInventarioRequest = async (id) => axios.delete(`${API}/eliminar_movimiento/${id}`);

export const ver_proyecto_por_idRequest = async (id) => {return await axios.post(`${API}/ver_proyecto_por_id/${id}`);};
export const listar_proyectosRequest = async () => {return await axios.get(`${API}/listar_proyectos`);};
export const editar_proyecto_Request = async(id,data) => {return await axios.put(`${API}/editar_proyecto_por_id/${id}`, data);};

// ------ Manejo de Cobro ------

// Listar todos los proyectos (incluye datos de cobros/pagos)
export const listarProyectosRequest = async () => axios.get(`${API}/listar_proyectos`);

// Obtener un proyecto específico con todos los detalles (incluye cobros y pagos)
export const verProyectoPorIdRequest = async (id) => axios.get(`${API}/ver/${id}`);

// Actualizar los cobros/pagos de un proyecto específico
export const actualizarProyectoCobrosRequest = async (id, data) => axios.post(`${API}/actualizarCobros/${id}`, data);

// Registrar un nuevo pago en un proyecto
export const registrarPagoProyectoRequest = async (id, pago) => axios.post(`${API}/proyectos/${id}/pagos`, pago);

// Eliminar un pago específico de un proyecto
export const eliminarPagoProyectoRequest = async (idPago) => axios.delete(`${API}/pagos/${idPago}`);

// En api/auth.js, asegúrate de tener algo como esto:

export const listarMovimientosRequest = async () => {return await axios.get(`${API}/listar_movimientos`);};
