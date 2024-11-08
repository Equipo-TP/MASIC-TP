import React, { useEffect, useState } from 'react';
import { obtenerPresupuestoIDRequest, listar_proyectos_por_tecnicoRequest, obtenerSolicitudPorIdRequest, obtenerClientePorIdRequest, ver_proyecto_por_idRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
const GestionarPresupuestos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [Solicitud, setSolicitud] = useState([]);
  const [cliente, setCliente] = useState([]);
  const { name } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5; // Número máximo de presupuestos por página
  useEffect(() => {

    const fetchProyecto = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const response = await listar_proyectos_por_tecnicoRequest(headers); //const response = await listarPresupuestosRequest(headers);
        setProyectos(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al listar los proyectos:', error.response ? error.response.data : error.message);
      }
    };
    fetchProyecto();
  }, []);
  useEffect(() => {
    const fetchPresupuesto = async () => {
      try {
        const Presupuestos = await Promise.all(
          proyectos.map(async (proyecto) => {
            const response = await obtenerPresupuestoIDRequest(proyecto.ID_Presupuesto_Proyecto);
            return response.data.data; // Devuelve el presupyesto completo
          })
        );
        setPresupuestos(Presupuestos);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener la solicitud:', error);
      }
    };
    fetchPresupuesto();
  }, [proyectos]);
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
        fetchPresupuesto();
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
  const indexOfLastProyecto = currentPage * itemsPerPage;
  const indexOfFirstProyecto = indexOfLastProyecto - itemsPerPage;
  const currentProyectos = presupuestos.slice(indexOfFirstProyecto, indexOfLastProyecto);
  const totalPages = Math.ceil(presupuestos.length / itemsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          <div className="relative overflow-x-full sm:rounded-lg w-auto h-auto" style={{ minHeight: '500px', maxWidth: '1500px', width: '100%' }}>
            <div className='select-none flex items-center justify-between mb-4'>
              <h1 className="text-3xl font-bold mb-2">Gestor de Presupuestos de {name}</h1> 
            </div>
            <table className="shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed" style={{ width: '100%' }}>

              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Nombre del Proyecto</th>
                  <th className="py-3 px-6 text-left">Nombre del cliente</th>                
                <th className="py-3 px-6 text-left">Dirección</th>
                <th className="py-3 px-6 text-left">Estado</th> 
                  <th scope="col" className="px-6 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {currentProyectos.map((proyecto) => {
                // Busca el presupuestp correspondiente
                presupuesto = presupuestos.find(s => s && s._id === proyecto.ID_Presupuesto_Proyecto);
                const solicitud = Solicitud.find(s => s && s._id === presupuesto.ID_Solicitud_Presupuesto);
                solicitudes = Solicitud.find(s => s && s._id === presupuesto.ID_Solicitud_Presupuesto);
                // Obtiene el cliente si la solicitud es válida
                const clientes = solicitud && solicitud.cliente ? cliente[solicitud.cliente._id] : null;
                const direccion = solicitud && solicitud.direccion ? direccion[solicitud.cliente._id] : null;
                return (
                  <tr key={presupuesto._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{proyecto.ID_Proyecto}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white"> {proyecto.Nombre_Proyecto} </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{clientes ? `${clientes.nombre} ${clientes.apellidos}` : "Cargando cliente..."}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{solicitudes.direccion} </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.estado_2}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">  
                      <Link to={`/ver_presupuesto/${presupuesto._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">
                        Ver
                      </Link>
                    </td>
                  </tr>
                )})}
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
export default GestionarPresupuestos;