import React, { useEffect, useState } from 'react';
import { listarSolicitudesRequest, actualizarEstadoSolicitudRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from 'react-router-dom';

const GestionSolicitud = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Número máximo de solicitudes por página
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const response = await listarSolicitudesRequest();
                setSolicitudes(response.data.data);
            } catch (error) {
                console.error('Error al listar las solicitudes:', error);
            }
        };

        fetchSolicitudes();
    }, []);

    /* const handleEstadoChange = async (id, nuevoEstado) => {
        try {
            await actualizarEstadoSolicitudRequest(id, nuevoEstado);
            setSolicitudes(solicitudes.map(solicitud =>
                solicitud._id === id ? { ...solicitud, estado_1: nuevoEstado } : solicitud
            ));
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    };*/

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

          // Calcular las solicitudes que se mostrarán en la página actual
  const indexOfLastSolicitud = currentPage * itemsPerPage;
  const indexOfFirstSolicitud = indexOfLastSolicitud - itemsPerPage;
  const currentSolicitudes = solicitudes.slice(indexOfFirstSolicitud, indexOfLastSolicitud);
  const totalPages = Math.ceil(solicitudes.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

    const renderSolicitudes = () => {
      if (solicitudes == null) {
        return (
          <div className="flex justify-center items-center mt-10">
          <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No existen solicitudes actualmente</h2>
            <p className="text-gray-500">No se han registrado solicitudes en el sistema por el momento.</p>
          </div>
        </div>
        );
      } else {
        //si el estado dos esta pendiente no se debe visualizar
        //poner botton en el check, x, y ver
        //quitar los botones cuando se presiona uno de ellos y de ahi aparesca el estado en el que esta 
        //QUE LOS BOTONES TENGAN EFECTO EN ESTADO_1 Y 2
        ///poner cliente y vendedora en ves de descripcion y caracteristica
        ///que los botones check y x esten en InfoSolicitud.jsx
        //mandar popup "estas seguro" cuando se busca aprobar o X 
        //usar comfirm alert
        return (
          <table className="shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Característica</th>
                <th className="px-6 py-3">Descripción</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentSolicitudes.map((solicitud) => (
                <tr key={solicitud._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">{solicitud.id}</td>
                  <td className="px-6 py-4">{solicitud.caracteristicas_obra}</td>
                  <td className="px-6 py-4">{solicitud.descripcion_servicio}</td>
                  <td className="px-6 py-4">{solicitud.estado_2}</td>
                  <td className="px-6 py-4">
                    <button
                      className="bg-blue-500 text-black px-4 py-2 rounded"
                      onClick={() => navigate(`/info_solicitud/${solicitud._id}`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
    };

  
    return (
      <div className="flex">
        <MenuSideBar open={drawerOpen} />
        <div className="flex-1">
          <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
          <div className="p-6">
        
            <h1 className="text-3xl font-bold mb-6">Gestión de Solicitud</h1>
            {/* Renderizar las solicitudes o mensaje */}
            {renderSolicitudes()}
          
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
  
  export default GestionSolicitud;