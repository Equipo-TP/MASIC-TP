import React from 'react';
import { listarAlmacenesRequest } from '../../api/auth';
import { useState, useEffect } from 'react';

const AsignarMaterial = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [materiales, setMateriales] = useState([]);

      // Función para cargar la lista de clientes
      const fetchMateriales = async () => {
        try {
            const response = await listarAlmacenesRequest();
            if (Array.isArray(response.data.data)) {
                setMateriales(response.data.data);
            } else {
                console.error('La respuesta no es un array:', response.data.data);
                setMateriales([]);
            }
        } catch (error) {
            console.error('Error al listar materiales:', error);
        }
    };

    // Cargar la lista de clientes cuando el componente se monta
    useEffect(() => {
        fetchMateriales(); // Carga la lista de clientes al montar el componente
    }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Asignar Material</h2>
        
        {/* Formulario de asignación de materiales */}
        <div className="space-y-4">
          <label className="block text-gray-700">Material</label>
          <select name="material" id="material"
                onChange={handleClienteChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required>
                    <option value="">Seleccione un material</option>
                                {materiales.map(material => (
                                    <option key={material._id} value={material._id}>
                                        {material.nombre}
                                    </option>
                                ))}
                                <option value="nuevo">Nuevo Material</option>
            </select>
          
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
