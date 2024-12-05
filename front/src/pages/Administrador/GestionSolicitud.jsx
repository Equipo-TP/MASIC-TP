import React, { useEffect, useState } from 'react';
import { listarSolicitudesAdminRequest, actualizarEstadoSolicitudRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link, useNavigate } from 'react-router-dom';

const GestionSolicitud = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const response = await listarSolicitudesAdminRequest();
                setSolicitudes(response.data.data);
            } catch (error) {
                console.error('Error al listar las solicitudes:', error);
            }
        };
        fetchSolicitudes();
    }, []);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const indexOfLastSolicitud = currentPage * itemsPerPage;
    const indexOfFirstSolicitud = indexOfLastSolicitud - itemsPerPage;
    const currentSolicitudes = solicitudes.slice(indexOfFirstSolicitud, indexOfLastSolicitud);
    const totalPages = Math.ceil(solicitudes.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flex">
            <MenuSideBar open={drawerOpen} />
            <div className="flex-1 overflow-y-auto h-[calc(100vh-1rem)]">
                <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
                <div className="p-6 mx-20 mt-20">
                    <h1 className="text-3xl font-bold mb-6">Gestión de Solicitud</h1>
                    <p className="mb-8 text-zinc-600">En este módulo podrá visualizar y gestionar los estados de las solicitudes de servicio recibidas.</p>
                    {/* Tabla para pantallas grandes */}
                    <table className="hidden overflow-hidden rounded-lg md:block shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Característica</th>
                                <th className="px-6 py-3">Descripción</th>
                                <th className="px-6 py-3">Revisión</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            { currentSolicitudes.length > 0 ? (
                            currentSolicitudes.map((solicitud) => (
                                <tr key={solicitud._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{solicitud.id}</td>
                                    <td className="px-6 py-4">{solicitud.caracteristicas_obra}</td>
                                    <td className="px-6 py-4">{solicitud.descripcion_servicio}</td>
                                    <td className={`px-6 py-4 ${
    solicitud.estado_2 === "Pendiente" ? "text-red-500 font-semibold" : ""
  }`}>{solicitud.estado_2}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                            onClick={() => navigate(`/info_solicitud/${solicitud._id}`)}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            )) ) : (
                                <tr>
                                  <td colSpan="5" className="py-3 px-6 text-center">No se encontraron solicitudes.</td>
                                </tr>
                              )}
                        </tbody>
                    </table>

                    {/* Tabla para pantallas pequeñas */}
                    <div className="space-y-4 md:hidden">
                        { currentSolicitudes.length > 0 ? (
                        currentSolicitudes.map((solicitud) => (
                            <div key={solicitud._id} className="bg-white p-4 rounded-lg shadow">
                                <div className="text-sm font-bold">ID: {solicitud.id}</div>
                                <div className="text-sm">Característica: {solicitud.caracteristicas_obra}</div>
                                <div className="text-sm">Estado: {solicitud.estado_2}</div>
                                <div className="pt-2">
                                    <button
                                        className="bg-blue-500 text-black px-4 py-2 rounded"
                                        onClick={() => navigate(`/info_solicitud/${solicitud._id}`)}
                                    >
                                        Ver
                                    </button>
                                </div>
                            </div>
                        )) ) : (
                            <div className="text-center py-3">No se encontraron solicitudes.</div>
                          )}
                    </div>

                    {/* Paginación */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-l-lg bg-gray-200 hover:bg-gray-300"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2">{`Página ${currentPage} de ${totalPages}`}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-r-lg bg-gray-200 hover:bg-gray-300"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionSolicitud;
