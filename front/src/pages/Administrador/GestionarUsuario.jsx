import React, { useEffect, useState } from 'react';
import { listarUsuariosRequest, eliminarUsuarioRequest } from '../../api/auth'; // request de los métodos para listar usuarios y para borrar usuario
import Sidebar from '../../components/MenuSideBar';
import Navbar from '../../components/NavBar'; 
import { Link } from 'react-router-dom'; //insertar redirección para crear usuario
import { confirmAlert } from 'react-confirm-alert'; // Importa la función para mostrar la alerta
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa los estilos para la alerta

const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await listarUsuariosRequest();
        setUsuarios(response.data.data);
      } catch (error) {
        console.error('Error al listar los usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación de usuario',
      message: '¿Estás seguro de que deseas eliminar este usuario?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await eliminarUsuarioRequest(id);
              setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
            } catch (error) {
              console.error('Error al eliminar el usuario:', error);
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <h1 className="text-3xl font-bold mb-2">Gestor de Usuarios</h1> {/* Reducido el margen inferior */}
            <div className="flex justify-end mb-4">
              <Link to="/crear_usuario"> {/* cambiar direccion para enviar a crear_usuario aquí!!! */}
                <button className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Crear Usuario
                </button>
              </Link>
            </div>
            <table className="shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3">Apellido</th>
                  <th scope="col" className="px-6 py-3">Correo</th>
                  <th scope="col" className="px-6 py-3">Rol</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{usuario.nombre}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{usuario.apellidos}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{usuario.email}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{usuario.rol}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      <a href={`/ver_usuario/${usuario._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">Ver</a> {/* modificar dirección, esta solo como referencia */}
                      <a href={`/editar_usuario/${usuario._id}`} className="font-medium text-green-600 dark:text-green-500 hover:underline mr-4">Editar</a> {/* modificar dirección, esta solo como referencia */}
                      <button
                        onClick={() => handleDelete(usuario._id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionarUsuarios;
