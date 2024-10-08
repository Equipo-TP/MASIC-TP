import React, { useEffect, useState } from 'react';
import { listarUsuariosRequest, eliminarUsuarioRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Máximo de usuarios por página
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Paginación
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = usuarios.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(usuarios.length / itemsPerPage);

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

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  //handle de paginación
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          <div className="relative overflow-x-auto sm:rounded-lg">
            
            <div className="flex justify-between mb-4">
              <h1 className="text-3xl font-bold mb-2">Gestor de Usuarios</h1>
              <Link to="/registro_user">
                <button className="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-sm px-4 py-2 ">
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
                {currentUsers.map((usuario) => (
                  <tr key={usuario._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{usuario.nombre}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{usuario.apellidos}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{usuario.email}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{usuario.rol}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      <Link to={`/ver_usuario/${usuario._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">
                        Ver
                      </Link>
                      <Link to={`/editar_usuario/${usuario._id}`} className="font-medium text-green-600 dark:text-green-500 hover:underline mr-4">
                        Editar
                      </Link>
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

            {/* Paginación */}
            <div className="flex justify-center mt-4">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-l-lg bg-gray-200 hover:bg-gray-300">
                Anterior
              </button>
              <span className="px-4 py-2">{`Página ${currentPage} de ${totalPages}`}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-r-lg bg-gray-200 hover:bg-gray-300">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionarUsuarios;
