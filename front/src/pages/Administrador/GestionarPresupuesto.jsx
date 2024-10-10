import React, { useEffect, useState } from 'react';
import { listarPresupuestosRequest, eliminarPresupuestoRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const GestionarPresupuesto = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const response = await listarPresupuestosRequest();
        setPresupuestos(response.data.data);
      } catch (error) {
        console.error('Error al listar los presupuestos:', error);
      }
    };

    fetchPresupuestos();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación de presupuesto',
      message: '¿Estás seguro de que deseas eliminar este presupuesto?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await eliminarPresupuestoRequest(id);
              setPresupuestos(presupuestos.filter((presupuesto) => presupuesto._id !== id));
            } catch (error) {
              console.error('Error al eliminar el presupuesto:', error);
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
      <MenuSideBar open={drawerOpen} /> {}
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} /> {}
        <div className="p-6">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <h1 className="text-3xl font-bold mb-2">Gestor de Presupuestos</h1>
            <div className="flex justify-end mb-4">
              <Link to="/registrar_presupuesto"> {}
                <button className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Crear Presupuesto
                </button>
              </Link>
            </div>
            <table className="shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Orden</th>
                  <th scope="col" className="px-6 py-3">Cliente</th>
                  <th scope="col" className="px-6 py-3">Monto Total</th>
                  <th scope="col" className="px-6 py-3">Descripción</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {presupuestos.map((presupuesto, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.cliente}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.monto_total}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.descripcion}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      <Link to={`/editar_presupuesto/${presupuesto._id}`} className="font-medium text-green-600 dark:text-green-500 hover:underline mr-4">
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(presupuesto._id)}
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

export default GestionarPresupuesto;
