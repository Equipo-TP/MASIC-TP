import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import axios from 'axios';

const InfoSolicitud = () => {
  const { id } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para controlar la apertura del sidebar
  const navigate = useNavigate();

  // Función para obtener la solicitud por ID
  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const response = await axios.get(`/api/obtener_solicitud_por_id/${id}`);
        setSolicitud(response.data.data);
      } catch (error) {
        console.error('Error al obtener la solicitud:', error);
      }
    };

    fetchSolicitud();
  }, [id]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Alterna el estado del sidebar
  };

  // Función para actualizar el estado de la solicitud usando el controlador editar_solicitud
  const updateSolicitudEstado = async (nuevoEstado) => {
    try {
      const confirmacion = window.confirm(`¿Estás seguro de que quieres marcar esta solicitud como ${nuevoEstado}?`);
      if (confirmacion) {
        const dataActualizada = {
          ...solicitud,  // Mantiene los mismos datos actuales de la solicitud
          estado_2: nuevoEstado,  // Actualiza el campo estado_2
        };
  
        // Ajustar la URL para que incluya el prefijo /api
        const response = await axios.put(`/api/editar_solicitud/${id}`, dataActualizada);
  
        if (response.status === 200) {
          setSolicitud(response.data.data);  // Actualiza el estado en el frontend
          alert(`La solicitud ha sido marcada como ${nuevoEstado}`);
        } else {
          alert('Error al actualizar la solicitud.');
        }
      }
    } catch (error) {
      console.error(`Error al actualizar la solicitud a ${nuevoEstado}:`, error);
      alert('Hubo un problema al actualizar la solicitud.');
    }
  };
  

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          { /*solicitud ? ( */
            <div className="bg-white shadow-md rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-4">Detalles de la Solicitud</h1>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>ID Cliente:</strong> {solicitud.cliente}</div>
                <div><strong>Vendedor:</strong> {solicitud.vendedor}</div>
                <div><strong>Cliente:</strong> {solicitud.cliente}</div>
                <div><strong>Características:</strong> {solicitud.caracteristicas_obra}</div>
                <div><strong>Descripción:</strong> {solicitud.descripcion_servicio}</div>
                <div><strong>Fecha de registro:</strong> {new Date(solicitud.createdAt).toLocaleDateString()}</div>
                <div><strong>Estado actual:</strong> {solicitud.estado_2}</div>
              </div>

              {/* Mostrar botones solo si el estado es Pendiente */}
              {solicitud.estado_2 === 'Pendiente' && (
                <div className="mt-6 flex gap-4">
                  {/* Botón para rechazar */}
                  <button
                    onClick={() => updateSolicitudEstado('Rechazado')}
                    className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                  >
                    ✖ Rechazar
                  </button>

                  {/* Botón para aprobar */}
                  <button
                    onClick={() => updateSolicitudEstado('Aprobado')}
                    className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                  >
                    ✔ Aprobar
                  </button>
                </div>
              )}

              {/* Botón para volver a la página anterior */}
              <button
                onClick={() => navigate('/gestion_solicitud')}
                className="mt-6 text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
              >
                Volver
              </button>
            </div>
         /* ) : (
            <p>Cargando datos de la solicitud...</p>
          ) */}
        </div>
      </div>
    </div>
  );
};

export default InfoSolicitud;
