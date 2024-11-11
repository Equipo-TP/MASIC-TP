import React, { useEffect, useState } from 'react';
import { listarTarifasRequest, eliminarTarifaRequest } from '../../api/auth'; // Cambié la API a tarifas
import MenuSideBar from '../../components/MenuSideBar'; // Importa el Sidebar
import NavBar from '../../components/NavBar'; // Importa el Navbar
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const GestionarTarifas = () => {
  const [tarifas, setTarifas] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para controlar la apertura del sidebar

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const response = await listarTarifasRequest(); // Cambié la función de usuarios a tarifas
        setTarifas(response.data.data);
      } catch (error) {
        console.error('Error al listar las tarifas:', error);
      }
    };

    fetchTarifas();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación de tarifa',
      message: '¿Estás seguro de que deseas eliminar esta tarifa?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await eliminarTarifaRequest(id);
              setTarifas(tarifas.filter((tarifa) => tarifa._id !== id));
            } catch (error) {
              console.error('Error al eliminar la tarifa:', error);
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
      <MenuSideBar open={drawerOpen} /> {/* Pasa el estado de apertura al Sidebar */}
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} /> {/* Pasa la función y el estado al Navbar */}
        <div className="p-6">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <h1 className="text-3xl font-bold mb-2">Gestor de Tarifas</h1>
            <div className="flex justify-end mb-4">
              <Link to="/registrar_tarifa">
                <button className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Crear Tarifa
                </button>
              </Link>
            </div>
            <table className="shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Orden</th>
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3">Monto</th>
                  <th scope="col" className="px-6 py-3">Descripción</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tarifas.map((tarifa,index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{index +1}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{tarifa.tipo_luminaria}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{tarifa.precio}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{tarifa.descripcion}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                    <Link to={`/editar_tarifa/${tarifa._id}`} className="font-medium text-green-600 dark:text-green-500 hover:underline mr-4">
                      Editar
                    </Link>
                      <button
                        onClick={() => handleDelete(tarifa._id)}
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

export default GestionarTarifas;
