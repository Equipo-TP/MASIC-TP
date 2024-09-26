import axios from 'axios';

const API = 'http://localhost:8000/api'

export const registrousuarioRequest = async (user) => axios.post(`${API}/registro_usuario`, user);
export const loginRequest = async (user) => axios.post(`${API}/login_user`, user);

export const listarUsuariosRequest = async () => axios.get(`${API}/listar_usuarios`);
export const eliminarUsuarioRequest = async (id) => axios.delete(`${API}/eliminar_usuario/${id}`);
export const obtenerUserRequest = async (id) => axios.get(`${API}/actualizar_usuario/${id}`);
export const editarUserRequest = async (id, user) => axios.put(`${API}/actualizar_usuario/${id}`, user);


export const obtenerUsuarioRequest = async (id) => {
    return await axios.get(`/api/usuarios/${id}`);
  };

  export const actualizarUsuarioRequest = async (id, data) => {
    return await axios.put(`/api/usuarios/${id}`, data);
  }; 