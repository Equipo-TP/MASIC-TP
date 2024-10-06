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

export const obtener_cliente_por_idRequest = async (id) => {return await axios.post(`${API}/obtener_cliente_por_id/${id}`);};
export const listarSolicitudesRequest = async () => {return await axios.get(`${API}/listar_solicitudes_administrador`);};
export const actualizarEstadoSolicitudRequest = async (id, estado_2) => {return await axios.put(`${API}/editar_solicitud/${id}`,{estado_2});};
export const obtener_solicitud_por_idRequest = async (id) => {return await axios.post(`${API}/obtener_solicitud_por_id/${id}`);};

export const registrarPresupuestoTarifaRequest = async (data) => axios.post(`${API}/registro_presupuesto_tarifa`, data);
export const listarPresupuestosTarifasRequest = async () => axios.get(`${API}/listar_presupuestos_tarifas`);
export const obtenerPresupuestoTarifaRequest = async (id) => axios.get(`${API}/obtener_presupuesto_tarifa/${id}`);
export const editarPresupuestoTarifaRequest = async (id, data) => axios.put(`${API}/editar_presupuesto_tarifa/${id}`, data);

export const registrarPresupuestoRequest = async (presupuesto) => axios.post(`${API}/registro_presupuesto`, presupuesto);
export const listarPresupuestosRequest = async () => axios.get(`${API}/listar_presupuestos`);
export const obtenerPresupuestoRequest = async (id) => axios.get(`${API}/obtener_presupuesto/${id}`);
export const editarPresupuestoRequest = async (id, presupuesto) => axios.put(`${API}/editar_presupuesto/${id}`, presupuesto);

