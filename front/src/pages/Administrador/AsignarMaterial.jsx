import React from 'react';

const AsignarMaterial = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Asignar Material</h2>
        
        {/* Formulario de asignación de materiales */}
        <div className="space-y-4">
          <label className="block text-gray-700">Material</label>
          <input type="text" className="w-full p-2 border rounded" />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-gray-700">Categoría</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-gray-700">Stock</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-gray-700">Unidad de medida</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
          </div>
          
          <label className="block text-gray-700">Cantidad usada en el proyecto</label>
          <input type="text" className="w-full p-2 border rounded" />
          
          <label className="block text-gray-700">Lista de Materiales en proyecto</label>
          <textarea className="w-full p-2 border rounded h-20" />
          
          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
              Volver
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignarMaterial;
