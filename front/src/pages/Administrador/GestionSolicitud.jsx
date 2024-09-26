import React, { useEffect, useState } from 'react';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GestionSolicitud = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para controlar la apertura del sidebar
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await axios.get('/api/solicitudes/listar_solicitudes_administrador');
        setSolicitudes(response.data.data);
      } catch (error) {
        console.error('Error al listar las solicitudes:', error);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Alterna el estado del sidebar
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`/api/solicitudes/editar_solicitud/${id}`, { estado_1: nuevoEstado });
      setSolicitudes(solicitudes.map(solicitud => 
        solicitud._id === id ? { ...solicitud, estado_1: nuevoEstado } : solicitud
      ));
    } catch (error) {
      console.error('Error al actualizar el estado de la solicitud:', error);
    }
  };

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <h1 className="text-3xl font-bold mb-2">Gestión de Solicitud</h1>
            <table className="shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">ID Cliente</th>
                  <th scope="col" className="px-6 py-3">Distrito</th>
                  <th scope="col" className="px-6 py-3">Descripción</th>
                  <th scope="col" className="px-6 py-3">Estado</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{solicitud.cliente}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{solicitud.distrito}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{solicitud.descripcion_servicio}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{solicitud.estado_1}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => actualizarEstado(solicitud._id, 'Aprobado')} className="text-green-600 hover:underline mr-4">✔</button>
                      <button onClick={() => actualizarEstado(solicitud._id, 'Rechazado')} className="text-red-600 hover:underline mr-4">✖</button>
                      <button onClick={() => navigate(`/info_solicitud/${solicitud._id}`)} className="text-blue-600 hover:underline">Ver</button>
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

export default GestionSolicitud;
