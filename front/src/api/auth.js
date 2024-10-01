import axios from 'axios';

const API = 'http://localhost:8000/api'

export const registrousuarioRequest = async (user) => axios.post(`${API}/registro_usuario`, user);
export const loginRequest = async (user) => axios.post(`${API}/login_user`, user);

export const listarUsuariosRequest = async () => axios.get(`${API}/listar_usuarios`);
export const eliminarUsuarioRequest = async (id) => axios.delete(`${API}/eliminar_usuario/${id}`);
export const obtenerUserRequest = async (id) => axios.get(`${API}/actualizar_usuario/${id}`);
export const editarUserRequest = async (id, user) => axios.put(`${API}/actualizar_usuario/${id}`, user);

export const registroSolicitudRequest = async (data) => axios.post(`${API}/registro_solicitud`, data);
export const listarSolicitudesVendedoraRequest = async (headers, currentPage) => {
    const params = {
      page: currentPage, // Agregar el número de página
      limit: 10,
    };
  
    return await axios.get('http://localhost:8000/API/listar_solicitudes_vendedora', { 
      headers, 
      params // Agregar los parámetros a la solicitud
    });
  };
  
export const obtenerSolicitudPorIdRequest = async (id) => axios.post(`${API}/obtener_solicitud_por_id/${id}`);
export const editarSolicitudRequest = async (id, data) => axios.put(`${API}/editar_solicitud/${id}`, data);

export const registroClienteRequest = async (data) => axios.post(`${API}/registro_cliente`, data);
export const listarClientesRequest = async () => axios.get(`${API}/listar_clientes`);
export const obtenerClientePorIdRequest = async (id) => axios.post(`${API}/obtener_cliente_por_id/${id}`);
export const editarClienteRequest = async (id, data) => axios.put(`${API}/editar_solicitud/${id}`, data);