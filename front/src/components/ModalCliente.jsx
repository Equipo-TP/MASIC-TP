import React from 'react';

const ModalCliente = ({ cliente, solicitudes, onClose }) => {
  if (!cliente) return null;
  console.log(solicitudes);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-2">Detalles del Cliente</h1>
        <p className="mb-1"><strong>Nombre:</strong> {cliente.nombre}</p>
        <p className="mb-1"><strong>Apellidos:</strong> {cliente.apellidos}</p>
        <p className="mb-1"><strong>Email:</strong> {cliente.email}</p>
        <p className="mb-1"><strong>Teléfono:</strong> {cliente.telefono}</p>
        
        {/* Mostrar solicitudes */}
        <h2 className="text-lg font-bold mt-4">Solicitudes</h2>
        <ul className="list-disc ml-5">
          {solicitudes.length > 0 ? (
            solicitudes.map((solicitud) => (
              <li key={solicitud._id}>{solicitud.descripcion_servicio}{'         '+solicitud.id}{'         '+solicitud.estado_2}</li>
              // id es codigo de solicitud     // estado_2 es el estado de aceptación por el administrados el estado_1 segun la vendedora
            ))
          ) : (
            <li>No hay solicitudes disponibles.</li>
          )}
        </ul>

        <button 
          onClick={onClose} 
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalCliente;
