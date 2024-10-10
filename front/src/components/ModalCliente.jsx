import React, { useState } from 'react';

const ModalCliente = ({ cliente, solicitudes, onClose }) => {
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para controlar el menú desplegable

  if (!cliente) return null;

  // Función para alternar el menú desplegable
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-700">Detalles del Cliente</h1>
        <p className="mb-1 text-gray-600"><strong>Nombre:</strong> {cliente.nombre}</p>
        <p className="mb-1 text-gray-600"><strong>Apellidos:</strong> {cliente.apellidos}</p>
        <p className="mb-1 text-gray-600"><strong>Email:</strong> {cliente.email}</p>
        <p className="mb-1 text-gray-600"><strong>Teléfono:</strong> {cliente.telefono}</p>
        
        {/* Mostrar solicitudes */}
        <div
          className="mt-4 flex items-center cursor-pointer hover:text-blue-500 transition-colors"
          onClick={toggleMenu}  // Al hacer clic alterna el menú
        >
          <h2 className="text-xl font-bold text-gray-700">
            {menuAbierto ? "Ocultar solicitudes" : "Mostrar solicitudes"}
          </h2>
          {/* Icono de flecha */}
          <span className={`ml-2 transform ${menuAbierto ? "rotate-180" : "rotate-0"} transition-transform`}>
            ▼
          </span>
        </div>

        {/* Condicional para desplegar solicitudes en forma de tabla */}
        {menuAbierto && (
          <div className="mt-4 overflow-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2 text-left">ID</th>
                  <th className="border border-gray-300 p-2 text-left">Descripción</th>
                  <th className="border border-gray-300 p-2 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.length > 0 ? (
                  solicitudes.map((solicitud) => (
                    <tr key={solicitud._id} className="bg-white hover:bg-gray-100">
                      <td className="border border-gray-300 p-2">{solicitud.id}</td>
                      <td className="border border-gray-300 p-2">{solicitud.descripcion_servicio}</td>
                      <td className="border border-gray-300 p-2">{solicitud.estado_2}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border border-gray-300 p-2 text-center text-gray-600">
                      No hay solicitudes disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <button 
          onClick={onClose} 
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalCliente;
