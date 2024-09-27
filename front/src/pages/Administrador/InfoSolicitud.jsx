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

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const response = await axios.get(`/api/solicitudes/obtener_solicitud_por_id/${id}`);
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

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          {solicitud ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-4">Detalles de la Solicitud</h1>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>ID Cliente:</strong> {solicitud.cliente}</div>
                <div><strong>Vendedor:</strong> {solicitud.vendedor}</div>
                <div><strong>Cliente:</strong> {solicitud.cliente}</div>
                <div><strong>Caracteristicas:</strong> {solicitud.caracteristicas_obra}</div>
                <div><strong>Descripcion:</strong> {solicitud.descripcion_servicio}</div>
                <div><strong>Fecha de registro:</strong> {solicitud.createdAt}</div>
                {/* Agrega más detalles según tus variables */}
              </div>
              <button
                onClick={() => navigate('/gestion_solicitudes')}
                className="mt-6 text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
              >
                Volver
              </button>
            </div>
          ) : (
            <p>Cargando datos de la solicitud...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoSolicitud;
