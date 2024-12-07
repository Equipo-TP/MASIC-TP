import React, { useEffect, useState } from 'react';
import { listar_proyectos_por_tecnicoRequest, obtenerPresupuestoIDRequest, obtenerSolicitudPorIdRequest, obtenerClientePorIdRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const GestionarProyectosTecnico = () => {
  const [proyectos, setProyectos] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [isOpen, setIsOpen] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5; 

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const response = await listar_proyectos_por_tecnicoRequest(headers);
        console.log(response.data);
        setProyectos(response.data.data);
      } catch (error) {
        console.error('Error al listar los proyectos:', error.response ? error.response.data : error.message);
      }
    };

    fetchProyectos();
  }, []);
  useEffect(() => {
    const fetchPresupuesto = async () => {
        try {
          const presupuestos = await Promise.all(
            proyectos.map(async (proyectos) => {
              const response = await obtenerPresupuestoIDRequest(proyectos.ID_Presupuesto_Proyecto);
              console.log(response.data);
              return response.data.data; 
            })
          );
          setPresupuestos(presupuestos);
          setIsLoading(false);
        } catch (error) {
          console.error('Error al obtener la solicitud:', error);
        }
      };
    
      if (proyectos.length > 0) {
        fetchPresupuesto();
      }
    }, [proyectos]);

    useEffect(() => {
      const fetchSolicitud = async () => {
          try {
            const solicitudes = await Promise.all(
              presupuestos.map(async (presupuesto) => {
               // const response = await obtenerSolicitudPorIdRequest(presupuesto.ID_Solicitud_Presupuesto);
               const solicitudId = presupuesto.ID_Solicitud_Presupuesto._id || presupuesto.ID_Solicitud_Presupuesto;
               
               const response = await obtenerSolicitudPorIdRequest(solicitudId);
               console.log(response.data);
                return response.data.data; 
              })
            );
            setSolicitudes(solicitudes);
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
                solicitudes.map(async (solicitud) => {
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
          if (solicitudes.length > 0) {
            fetchCliente();
          }
        }, [solicitudes]);   
  // Calcular las solicitudes que se mostrarán en la página actual
  const indexOfLastProyecto = currentPage * itemsPerPage;
  const indexOfFirstProyecto = indexOfLastProyecto - itemsPerPage;
  const currentProyectos = proyectos.slice(indexOfFirstProyecto, indexOfLastProyecto);
  console.log(currentProyectos);
  const totalPages = Math.ceil(proyectos.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDropdown = (id) => {
    if (isOpen === id) {
      setIsOpen(null); // Cierra el menú si ya está abierto
    } else {
      setIsOpen(id); // Abre el menú para el proyecto específico
    }
  };

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          
            <div>
              <h1 className="text-3xl font-bold mb-6">Proyectos Asignados</h1>
              <p className="mb-8 text-zinc-600">En este módulo podrá visualizar los proyectos que se le ha asignado.</p>
            </div>
            <table className="shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Nombre del Proyecto</th>
                  <th scope="col" className="px-6 py-3">Nombre del cliente</th>
                  <th scope="col" className="px-6 py-3">Dirección</th>
                  <th className="py-3 px-6 text-left">Estado</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentProyectos.map((proyecto) => {
                  const presupuesto = presupuestos.find(s => s && s._id === proyecto.ID_Presupuesto_Proyecto);
                   const solicitud = solicitudes.find(s => s && s._id === presupuesto.ID_Solicitud_Presupuesto);
                   const clientes = solicitud && solicitud.cliente ? cliente[solicitud.cliente._id] : null;
                return(
                <tr key={proyecto._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{proyecto.ID_Proyecto}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white"> {proyecto.Nombre_Proyecto} </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white"> {proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.cliente.nombre} {proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.cliente.apellidos}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white"> {proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.direccion}, {proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.distrito} </td>
                    <td className="py-3 px-6">{proyecto.Estado}</td>                                 
                    <td className="px-6 py-4 text-gray-900 dark:text-white">  

                    <div class="btn-group dropdown d-inline-block mb-3 mr-2">
                        <button className="btn btn-outline-secondary border-2 py-2 px-6 dropdown-toggle rounded-lg bg-blue-400 text-cyan-50 font-semibold" aria-haspopup="true"
                         aria-expanded={isOpen} type="button" onClick={() => toggleDropdown(proyecto._id)}>OPCIONES</button>
                      {isOpen === proyecto._id && (
                        <div class="dropdown-menu" className="absolute mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                          <Link to={`/ver_proyectos/${proyecto._id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Ver</Link>
                      <Link to={`/editar_incidencias_tecnico/${proyecto._id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Registrar incidencias
                      </Link>
                      <Link to={`/editar_proyectos/${proyecto._id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Editar
                      </Link>
                          <Link to={`/visualizar_presupuesto/${proyecto.ID_Presupuesto_Proyecto._id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Detalle Presupuesto</Link>
                        </div>)}
                      </div> 
                      
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
  );
};

export default GestionarProyectosTecnico;
