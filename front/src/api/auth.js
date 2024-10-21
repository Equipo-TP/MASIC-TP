import axios from 'axios';

const API = 'http://localhost:8000/api';

// Función para registrar un usuario (usuarios normales)
export const registrousuarioRequest = async (user) => axios.post(`${API}/registro_usuario`, user);

// Función para iniciar sesión
export const loginRequest = async (user) => axios.post(`${API}/login_user`, user);

// Función para listar todos los usuarios
export const listarUsuariosRequest = async () => axios.get(`${API}/listar_usuarios`);

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

export const listarPresupuestosRequest = async (headers) => {
  
  return await axios.get('http://localhost:8000/API/listar_presupuestos', { 
    headers, 
  });
};
//export const listarPresupuestosRequest = async () => axios.get(`${API}/listar_presupuestos`);
export const eliminarPresupuestoRequest = async (id) => axios.delete(`${API}/eliminar_presupuesto/${id}`);
export const listarPresupuestosVendedoraRequest = async (headers) => { return axios.get(`${API}/listar_presupuestos_vendedora`, { headers }); };


export const obtenerUsuarioRequest = async (id) => {return await axios.get(`${API}/usuarios/${id}`);};
export const obtener_usuario_por_idRequest = async (id) => {return await axios.post(`${API}/obtener_usuario_por_id/${id}`);};
export const actualizarUsuarioRequest = async (id, data) => {return await axios.put(`/api/usuarios/${id}`, data);};



