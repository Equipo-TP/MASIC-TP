import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crearProyectoRequest, listarPresupuestosAprobados, ver_proyecto_por_idRequest, obtenerPresupuestoIDRequest } from '../../api/auth';
import AsignarMaterial from './AsignarMaterial';

const VerProyecto = () => {
  const { id } = useParams(); // Obtener el ID del proyecto desde la URL
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [solicitud, setSolicitud] = useState(null);
  const [presupuesto, setPresupuesto] = useState(null); // Estado para almacenar el proyecto
  const [isLoading, setIsLoading] = useState(true);

  /*
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [solicitud, setSolicitud] = useState([]);
  const [clienteNombre, setClienteNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
*/

useEffect(() => {
  const fetchProyecto = async () => {
    try {
      const response = await ver_proyecto_por_idRequest(id);
      setProyecto(response.data.data); // Suponiendo que el proyecto se encuentra en `response.data.data`
      setIsLoading(false);

    } catch (error) {
      console.error('Error al obtener el proyecto:', error);
      alert('No se pudo cargar el proyecto.');
      navigate(-1); // Regresa a la página anterior si hay un error
    }
  };

  fetchProyecto();
}, [id, navigate]);
console.log(proyecto)
/*
useEffect(() => {
  const fetchPresupuesto = async () => {
    try {
      const response = await obtenerPresupuestoIDRequest(proyecto.ID_Presupuesto_Proyecto);
      setPresupuesto(response.data.data); // Suponiendo que el proyecto se encuentra en `response.data.data`
      setIsLoading(false);

    } catch (error) {
      console.error('Error al obtener el presupuesto:', error);
      alert('No se pudo cargar el presupuesto.');
      navigate(-1); // Regresa a la página anterior si hay un error
    }
  };

  fetchPresupuesto();
}, [proyecto, navigate]);

useEffect(() => {
  const fetchSolicitud = async () => {
    try {
      const response = await obtener_solicitud_por_idRequest(presupuesto.ID_Solicitud_Presupuesto);
      setSolicitud(response.data.data); // Suponiendo que el proyecto se encuentra en `response.data.data`
      setIsLoading(false);

    } catch (error) {
      console.error('Error al obtener la solicitud:', error);
      alert('No se pudo cargar la solicitud.');
      navigate(-1); // Regresa a la página anterior si hay un error
    }
  };

  fetchSolicitud();
}, [presupuesto, navigate]);
*/
if (isLoading) {
  return <div>Cargando proyecto...</div>;
}

if (!proyecto) {
  return <div>No se encontró el proyecto.</div>;
}
console.log(proyecto.nombre)
  const handlePresupuestoChange = (e) => {
    const presupuestoID = e.target.value;
    setPresupuesto(presupuestoID);

    const presupuestoSeleccionado = presupuestos.find((pres) => pres._id === presupuestoID);
    if (presupuestoSeleccionado) {
      setClienteNombre(presupuestoSeleccionado.cliente.nombre);
      setDireccion(presupuestoSeleccionado.cliente.direccion);
    } else {
      setClienteNombre('');
      setDireccion('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoProyecto = {
      nombre,
      descripcion,
      presupuesto,
      clienteNombre,
      direccion,
      observaciones,
    };

    try {
      await crearProyectoRequest(nuevoProyecto);
      alert('Proyecto creado exitosamente');
      navigate(-1); // Regresa a la página anterior después de crear el proyecto
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      alert('Hubo un error al crear el proyecto');
    }
  };

  const handleCancelar = () => {
    navigate(-1); // Regresa a la página anterior al cancelar
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Detalles del Proyecto</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-700">Nombre del proyecto</label>
              <input
                type="text"
                value={proyecto.Nombre_Proyecto || ''}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700">Descripción</label>
              <textarea
                value={proyecto.Descripcion || ''}
                className="w-full p-2 border rounded h-20"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700">Presupuesto</label>
              <input
                type="text"
                value={proyecto.Costo_Total || ''}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700">Cliente</label>
              <input
                type="text"
                value={solicitud.cliente || ''}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700">Dirección</label>
              <input
                type="text"
                value={solicitud.direccion || ''}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700">Observaciones del proyecto</label>
              <textarea
                value={proyecto.Observacion || ''}
                className="w-full p-2 border rounded h-20"
                readOnly
              />
            </div>
            <div className="flex justify-between col-span-2">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Volver
                </button>
              </div>
            </div>
          </div>
        
       {/* Modal para Asignar Material 
        <AsignarMaterial isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
      </div>
    </div>
  );
};

export default VerProyecto
