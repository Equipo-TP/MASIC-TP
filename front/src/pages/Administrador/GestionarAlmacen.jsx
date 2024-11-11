import React, { useEffect, useState } from 'react';
import { listarAlmacenesRequest, eliminarAlmacenRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const GestionarAlmacen = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAlmacenes, setFilteredAlmacenes] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        const response = await listarAlmacenesRequest();
        setAlmacenes(response.data.data);
      } catch (error) {
        console.error('Error al listar los almacenes:', error);
      }
    };

    fetchAlmacenes();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación de almacén',
      message: '¿Estás seguro de que deseas eliminar este almacén?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await eliminarAlmacenRequest(id);
              setAlmacenes(almacenes.filter((almacen) => almacen._id !== id));
            } catch (error) {
              console.error('Error al eliminar el almacén:', error);
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

  const handleFilter = () => {
    setFilteredAlmacenes(
      almacenes.filter((almacen) =>
        almacen.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };
  const handleReset = () => {
    setSearchTerm('');
    setFilteredAlmacenes(almacenes);
  };

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <h1 className="text-3xl font-bold mb-2">Gestor de Almacenes</h1>
            <p className="mb-6">Este módulo lista todos los almacenes de la empresa.</p>

        
            <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Nombre del almacén"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-6 py-2 border rounded-md shadow-sm"
            />
            </div>
            <div className="flex justify-end mb-4">
              <Link to="/registro_almacen">
                <button className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Crear Almacen
                </button>
              </Link>
            </div>

            {/* Tabla de Almacenes */}
            <table className="shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3">Stock</th>
                  <th scope="col" className="px-6 py-3">Fecha de Registro</th>
                  <th scope="col" className="px-6 py-3">Unidad de Medida</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {almacenes.map((almacen,index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{almacen.nombre}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{almacen.stock}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{almacen.fecha_registro}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{almacen.unidad_medida}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      <Link to={`/editar_almacen/${almacen._id}`} className="font-medium text-green-600 dark:text-green-500 hover:underline mr-4">
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(almacen._id)}
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

export default GestionarAlmacen;
