import React, { useEffect, useState } from 'react';
import { listarPresupuestosVendedoraRequest, obtenerSolicitudPorIdRequest, obtenerClientePorIdRequest } from '../../api/auth';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
const GestionarPresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [Solicitud, setSolicitud] = useState([]);
  const [cliente, setCliente] = useState([]);
  const { name } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5; // Número máximo de presupuestos por página
  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const response = await listarPresupuestosVendedoraRequest(headers); //const response = await listarPresupuestosRequest(headers);
        setPresupuestos(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al listar los presupuestos:', error.response ? error.response.data : error.message);
      }
    };
    fetchPresupuestos();
  }, []);
  useEffect(() => {
    const fetchSolicitud = async () => {
        try {
          const solicitudes = await Promise.all(
            presupuestos.map(async (presupuesto) => {
              const response = await obtenerSolicitudPorIdRequest(presupuesto.ID_Solicitud_Presupuesto);
              return response.data.data; // Devuelve la solicitud completa
            })
          );
          setSolicitud(solicitudes);
          setIsLoading(false);
        } catch (error) {
          console.error('Error al obtener la solicitud:', error);
        }
      };
    
      if (presupuestos.length > 0) {
        fetchSolicitud();
      }
    }, [presupuestos]);
useEffect(() => {
  const fetchCliente = async () => {
      try {
        const fetchedClientes = {};
        await Promise.all(
          Solicitud.map(async (solicitud) => {
            if (solicitud && solicitud.cliente && solicitud.cliente._id) {
              const response = await obtenerClientePorIdRequest(solicitud.cliente._id);
              fetchedClientes[solicitud.cliente._id] = response.data.data;
            } else {
            }
          })
        );
        setCliente(fetchedClientes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };
    if (Solicitud.length > 0) {
      fetchCliente();
    }
  }, [Solicitud]);
  // Calcular los presupuestos que se mostrarán en la página actual
  const indexOfLastPresupuesto = currentPage * itemsPerPage;
  const indexOfFirstPresupuesto = indexOfLastPresupuesto - itemsPerPage;
  const currentPresupuestos = presupuestos.slice(indexOfFirstPresupuesto, indexOfLastPresupuesto);
  const totalPages = Math.ceil(presupuestos.length / itemsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <div className="flex">
      <Layout/>
      <div className="flex-1">
        <div className="p-6 mt-16 h-full">
          <div className="relative overflow-hidden h-full">
            <div className="overflow-y-auto h-[calc(100vh-6rem)]">

              {/* Titulo */}
              <div className='select-none flex items-center justify-between mb-4'>
                <h1 className="text-md font-bold mb-2 md:text-3xl">Gestor de Presupuestos de {name}</h1>
              </div>

              {/* Tabla para vista pc */}
              <div className='overflow-auto rounded-lg shadow hidden md:block'>
                <table className="w-full shadow-md text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="tracking-wide text-left px-6 py-3">ID</th>
                      <th scope="col" className="tracking-wide text-left px-6 py-3">Cliente</th>
                      <th scope="col" className="tracking-wide text-left px-6 py-3">Transporte Personal</th>
                      <th scope="col" className="tracking-wide text-left px-6 py-3">Pago Total</th>
                      <th scope="col" className="tracking-wide text-left px-6 py-3">Estado</th>
                      <th scope="col" className="tracking-wide text-left px-6 py-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPresupuestos.map((presupuesto) => {
                      const solicitud = Solicitud.find(s => s && s._id === presupuesto.ID_Solicitud_Presupuesto);
                      const clientes = solicitud && solicitud.cliente ? cliente[solicitud.cliente._id] : null;
                      return (
                        <tr key={presupuesto._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.ID_Presupuesto}</td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">{clientes ? `${clientes.nombre} ${clientes.apellidos}` : "Cargando cliente..."}</td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.Transporte_Personal}</td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.Pago_Total}</td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.estado_2}</td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">  
                            <Link to={`/ver_presupuesto/${presupuesto._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">Ver</Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Vista para móviles */}
              <div className='space-y-6'>
                {currentPresupuestos.map((presupuesto) => {
                  const solicitud = Solicitud.find(s => s && s._id === presupuesto.ID_Solicitud_Presupuesto);
                  const clientes = solicitud && solicitud.cliente ? cliente[solicitud.cliente._id] : null;

                  return (
                    <div key={presupuesto._id} className='grid grid-cols-1 gap-4 md:hidden'>
                      {/* Bloque individual para cada presupuesto */}
                      <div className='bg-white p-4 space-y-4 rounded-lg shadow'>
                        {/* Encabezado del presupuesto */}
                        <div className='flex items-center space-x-4 text-sm'>
                          <div className='text-green-500 font-bold'>{presupuesto.ID_Presupuesto}</div>
                          <div className='font-mono'>{clientes ? `${clientes.nombre} ${clientes.apellidos}` : "Cargando cliente..."}</div>
                          <div>| {presupuesto.estado_2}</div>
                        </div>
                        {/* Detalles del presupuesto */}
                        <div className='text-sm text-gray-700'>Transporte Personal: {presupuesto.Transporte_Personal}</div>
                        <div className='text-sm text-gray-700'>Pago Total: {presupuesto.Pago_Total}</div>
                        {/* Botón de acción */}
                        <div className='flex pt-2 items-center justify-center'>
                          <Link to={`/ver_presupuesto/${presupuesto._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">
                            Ver
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>


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
    </div>

  );
};
export default GestionarPresupuestos;