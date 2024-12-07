import React, { useState } from 'react';

const LayoutNotas = () => {
  const [notas, setNotas] = useState([]); // Lista de notas
  const [notaActual, setNotaActual] = useState(''); // Nota que el usuario está escribiendo
  const [mostrarNotas, setMostrarNotas] = useState(false); // Controla si se muestran las notas guardadas

  // Manejar el cambio en el campo de texto
  const handleNotaChange = (e) => {
    setNotaActual(e.target.value);
  };

  // Guardar la nota actual en la lista de notas
  const handleGuardarNota = () => {
    if (notaActual.trim() !== '') {
      setNotas([...notas, notaActual]);
      setNotaActual(''); // Limpiar el campo de texto
    }
  };

  // Alternar la visualización de las notas guardadas
  const handleToggleNotas = () => {
    setMostrarNotas(!mostrarNotas);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto mt-4">
      {/* Encabezado con el número de notas */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Notas guardadas: {notas.length}
        </h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleToggleNotas}
        >
          {mostrarNotas ? 'Ocultar notas' : 'Ver notas'}
        </button>
      </div>

      {/* Campo de entrada de texto */}
      <textarea
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 mb-4"
        rows="3"
        placeholder="Escribe tu nota aquí..."
        value={notaActual}
        onChange={handleNotaChange}
      ></textarea>

      {/* Botón para guardar la nota */}
      <button
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={handleGuardarNota}
      >
        Guardar Nota
      </button>

      {/* Mostrar las notas guardadas */}
      {mostrarNotas && (
        <div className="mt-4 bg-white p-4 border border-gray-200 rounded shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tus Notas:</h3>
          <ul className="list-disc pl-5">
            {notas.map((nota, index) => (
              <li key={index} className="text-gray-600 mb-1">
                {nota}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LayoutNotas;
