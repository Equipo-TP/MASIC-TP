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

// Función para obtener un usuario específico por ID
export const obtenerUserRequest = async (id) => axios.get(`${API}/actualizar_usuario/${id}`);

// Función para editar un usuario específico por ID
export const editarUserRequest = async (id, user) => axios.put(`${API}/actualizar_usuario/${id}`, user);

// ------ Manejo de Clientes ------

// Función para registrar una solicitud de cliente
export const registrarClienteRequest = async (cliente) => axios.post(`${API}/registro_cliente`, cliente);

// Función para listar todos los clientes (que se registraron a través de "Gestionar Solicitud")
export const listarClientesRequest = async () => axios.get(`${API}/listar_clientes`);
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




