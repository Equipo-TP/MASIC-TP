import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crearProyectoRequest, listarPresupuestosAprobados, obtener_solicitud_por_idRequest,ver_proyecto_por_idRequest, obtenerPresupuestoIDRequest, listarAlmacenesRequest } from '../../api/auth';
import AsignarMaterial from './AsignarMaterial';

const VerProyecto = () => {
  const { id } = useParams(); // Obtener el ID del proyecto desde la URL
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState([]);
  const [solicitud, setSolicitud] = useState(null);
  const [cliente, NombreCliente] = useState(null);
  const [presupuesto, setPresupuesto] = useState(null); // Estado para almacenar el proyecto
  const [isLoading, setLoading] = useState(true);
  const [materiales, setMateriales] = useState([]);
  


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
      /*const response2 = await obtenerPresupuestoIDRequest(response.data.data.ID_Presupuesto_Proyecto._id , headers);
      setPresupuesto(response2.data.data);
      const solicitudResponse = await obtener_solicitud_por_idRequest(response2.data.data.ID_Solicitud_Presupuesto._id);
      setSolicitud(solicitudResponse.data.data);
      const clienteResponse = await obtener_cliente_por_idRequest(solicitudResponse.data.data.cliente._id);*/ 
      const response3 = await listarAlmacenesRequest();
      console.log(response3.data.data)
        setMateriales(response3.data.data);
        console.log(response3.data.data);
    } catch (err) {
      console.error('Error al obtener el proyecto:', err);
      alert('No se pudo cargar el proyecto.');
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };

  fetchProyecto();
}, [id]);
console.log(proyecto);

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
  <div className="bg-white border-4 rounded-lg shadow-md w-3/5 p-6 h-[calc(100vh-50px)] overflow-y-auto">
    {/* Header */}
    <div className="flex items-center justify-between border-b pb-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Detalles del Proyecto</h2>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-red-500 hover:text-red-700 transition"
      >
        X
      </button>
    </div>

    {/* Contenido */}
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Cliente */}
        <div>
          <label className="block text-gray-700 font-medium">Cliente</label>
          <input
            type="text"
            value={
              proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.cliente?.nombre +
              " " +
              proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.cliente?.apellidos || ''
            }
            className="w-full p-3 border rounded-lg bg-gray-100"
            readOnly
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-gray-700 font-medium">Dirección</label>
          <input
            type="text"
            value={proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.direccion || ''}
            className="w-full p-3 border rounded-lg bg-gray-100"
            readOnly
          />
        </div>

        {/* Nombre del Proyecto */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Nombre del proyecto</label>
          <input
            type="text"
            value={proyecto.Nombre_Proyecto || ''}
            className="w-full p-3 border rounded-lg bg-gray-50"
            readOnly
          />
        </div>

        {/* Descripción */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Descripción</label>
          <textarea
            value={proyecto.Descripcion || ''}
            className="w-full p-3 border rounded-lg h-28 bg-gray-50 resize-none"
            readOnly
          />
        </div>

        {/* Costo Total */}
        <div>
          <label className="block text-gray-700 font-medium">Costo Total</label>
          <input
            type="text"
            value={proyecto.Costo_Total || ''}
            className="w-full p-3 border rounded-lg bg-gray-50"
            readOnly
          />
        </div>

        {/* Observaciones */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Observaciones del proyecto</label>
          <textarea
            value={proyecto.Observacion || ''}
            className="w-full p-3 border rounded-lg h-28 bg-gray-50 resize-none"
            readOnly
          />
        </div>

        {/* Materiales Asignados */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Materiales Asignados</label>
          <textarea
            className="w-full p-3 border rounded-lg h-40 bg-gray-100 resize-none"
            readOnly
            value={
              proyecto.GestionarMaterial && proyecto.GestionarMaterial.length > 0
                ? proyecto.GestionarMaterial
                    .map((material, index) => {
                      const materialEncontrado = materiales.find(
                        (item) => item._id === material.id_Material
                      );
                      console.log(materiales)
                      return `Material ${index + 1}: ${
                        materialEncontrado ? materialEncontrado.nombre : 'Desconocido'
                      }, Cantidad: ${material.Cantidad}`;
                    })
                    .join('\n')
                : 'No hay materiales asignados.'
            }
          />
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="mt-6 flex justify-end space-x-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Volver
      </button>
    </div>
  </div>
</div>

  );
};

export default VerProyecto
