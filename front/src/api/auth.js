import axios from 'axios';

const API = 'http://localhost:8000/api'

export const registrousuarioRequest = async (user) => axios.post(`${API}/registro_usuario`, user);
export const loginRequest = async (user) => axios.post(`${API}/login_user`, user);

export const listarUsuariosRequest = async () => axios.get(`${API}/listar_usuarios`);
export const eliminarUsuarioRequest = async (id) => axios.delete(`${API}/eliminar_usuario/${id}`);
export const obtenerUserRequest = async (id) => axios.get(`${API}/actualizar_usuario/${id}`);
export const editarUserRequest = async (id, user) => axios.put(`${API}/actualizar_usuario/${id}`, user);

export const registrarTarifaRequest = async (tarifa) => axios.post(`${API}/registro_tarifa`, tarifa);
export const listarTarifasRequest = async () => axios.get(`${API}/listar_tarifas`);
export const eliminarTarifaRequest = async (id) => axios.delete(`${API}/eliminar_tarifa/${id}`);
export const obtenerTarifaRequest = async (id) => axios.get(`${API}/obtener_tarifa_por_id/${id}`);
export const editarTarifaRequest = async (id, tarifa) => axios.put(`${API}/editar_tarifa/${id}`, tarifa);