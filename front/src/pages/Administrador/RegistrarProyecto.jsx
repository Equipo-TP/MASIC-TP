import React, { useState } from 'react';
import { crearProyectoRequest } from '../../api/auth'; // Importa tu función de API para crear un proyecto

const RegistrarProyecto = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [clienteID, setClienteID] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [fechaTrabajo, setFechaTrabajo] = useState(''); // Para la matriz de fechas
  const [tiempoTrabajo, setTiempoTrabajo] = useState(''); // Para la matriz de tiempos

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nuevoProyecto = {
      nombre,
      descripcion,
      clienteID,
      ubicacion,
      tipo,
      estado,
      fechaTrabajo: fechaTrabajo.split(','), // Convierte la cadena en un array
      tiempoTrabajo: tiempoTrabajo.split(','), // Convierte la cadena en un array
    };

    try {
      await crearProyectoRequest(nuevoProyecto);
      alert('Proyecto creado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      alert('Hubo un error al crear el proyecto');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre del Proyecto</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        {/*  <div className="mb-4">
              <label htmlFor="solicitud" className="text-sm font-medium text-gray-900 block mb-2">
                Selecciona un presupuesto
              </label>
              <select
                name="solicitud"
                id="solicitud"
                value={nuevoPresupuesto.solicitud}
                onChange={handleSolicitudChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              >
                <option value="">Seleccione un presupuesto</option>
                {solicitudes.map(nuevaSolicitud => (
                  <option key={nuevaSolicitud._id} value={nuevaSolicitud._id}>
                    {nuevaSolicitud.id}  / {nuevaSolicitud.cliente.nombre} {nuevaSolicitud.cliente.apellidos}
                  </option>
                ))}
              </select>
              
            </div>  */}
          <div className="mb-4">
            <label className="block text-gray-700">Presupuesto</label>
            <input
              type="text"
              value={clienteID}
              onChange={(e) => setClienteID(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Cliente</label>
            <input
              type="text"
              value={clienteID}
              onChange={(e) => setClienteID(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Ubicación</label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Tipo</label>
            <input
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Estado</label>
            <input
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Fecha de Trabajo (separada por comas)</label>
            <input
              type="text"
              value={fechaTrabajo}
              onChange={(e) => setFechaTrabajo(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ejemplo: 2024-10-01,2024-10-02"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Tiempo de Trabajo (separado por comas)</label>
            <input
              type="text"
              value={tiempoTrabajo}
              onChange={(e) => setTiempoTrabajo(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ejemplo: 4,6"
            />
          </div>


          <div className="flex justify-end">
          <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Visualizar Imagenes
            </button>
          
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarProyecto;
