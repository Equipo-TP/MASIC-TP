import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crearProyectoRequest, listarPresupuestosAprobados, ver_proyecto_por_idRequest, obtenerPresupuestoIDRequest } from '../../api/auth';


const VerProyecto = () => {
  const { id } = useParams(); // Obtener el ID del proyecto desde la URL
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState([]);
  const [solicitud, setSolicitud] = useState(null);
  const [cliente, NombreCliente] = useState(null);
  const [presupuesto, setPresupuesto] = useState(null); // Estado para almacenar el proyecto
  const [isLoading, setIsLoading] = useState(true);
  


useEffect(() => {
  const fetchProyecto = async () => {
    try {
             const token = localStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      };
      const response = await ver_proyecto_por_idRequest(id); // Llama a la API con el ID
      setProyecto(response.data.data); // Guarda los datos del proyecto en el estado
      const response2 = await obtenerPresupuestoIDRequest(response.data.data.ID_Presupuesto_Proyecto._id , headers);
      setPresupuesto(response2.data.data);
      const solicitudResponse = await obtener_solicitud_por_idRequest(response2.data.data.ID_Solicitud_Presupuesto._id);
      setSolicitud(solicitudResponse.data.data);
      const clienteResponse = await obtener_cliente_por_idRequest(solicitudResponse.data.data.cliente._id); 
      setNombreCliente(clienteResponse.data.data);
    } catch (err) {
      setError(err.message || 'Error al cargar el proyecto');
      console.error('Error al obtener el proyecto:', err);
      alert('No se pudo cargar el proyecto.');
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };

  fetchProyecto();
}, [id]);
console.log(proyecto);


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
              <label className="block text-gray-700">Costo Total</label>
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
                value={proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.cliente?.nombre + " " + proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.cliente?.apellidos || ''}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700">Dirección</label>
              <input
                type="text"
                value={proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.direccion || ''}
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
