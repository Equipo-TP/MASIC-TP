import React, { useState } from 'react';

const ModalCliente = ({ cliente, solicitudes, onClose }) => {
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para controlar el menú desplegable

  if (!cliente) return null;

  // Función para alternar el menú desplegable
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Detalles del Cliente</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <p className="text-gray-700"><strong>Nombre:</strong> {cliente.nombre}</p>
          <p className="text-gray-700"><strong>Apellidos:</strong> {cliente.apellidos}</p>
          <p className="text-gray-700"><strong>Email:</strong> {cliente.email}</p>
          <p className="text-gray-700"><strong>Teléfono:</strong> {cliente.telefono}</p>
        </div>
        
        {/* Mostrar solicitudes */}
        <div 
          className="flex items-center cursor-pointer bg-sky-900 hover:bg-sky-800 transition-colors rounded-lg p-3 mb-4" 
          onClick={toggleMenu}
        >
          <h2 className="text-lg font-semibold text-white flex-1">{menuAbierto ? "Ocultar Solicitudes" : "Solicitudes"}</h2>
          {/* Icono de flecha */}
          <span className={`ml-2 transform ${menuAbierto ? "rotate-180" : "rotate-0"} transition-transform text-white`}>
            ▼
          </span>
        </div>

        {/* Condicional para desplegar solicitudes en forma de tabla */}
        {menuAbierto && (
          <div className="mt-4 overflow-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700">ID</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700">Descripción</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.length > 0 ? (
                  solicitudes.map((solicitud) => (
                    <tr key={solicitud._id} className="bg-white hover:bg-gray-50">
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
          className="mt-6 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalCliente;
