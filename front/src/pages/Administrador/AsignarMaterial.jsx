import React, { useState, useEffect } from "react";
import { listarAlmacenesRequest } from "../../api/auth"; // Ajusta la ruta según tu proyecto
import { useNavigate } from 'react-router-dom';

const AsignarMaterial = ({ isOpen, onSubmit, onClose }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const [materiales, setMateriales] = useState([]); // Lista de materiales desde la API
  const [nuevoProyecto, setNuevoProyecto] = useState({
      GestionarMaterial: [],
  });

  useEffect(() => {
      const fetchMateriales = async () => {
          try {
              const response = await listarAlmacenesRequest();
              setMateriales(response.data.data || []);
          } catch (error) {
              console.error("Error al listar materiales:", error);
          }
      };
      fetchMateriales();
  }, []);

  const handleMaterialChange = (index, e) => {
      const { name, value } = e.target;

      setNuevoProyecto((prevState) => {
          const updatedMateriales = [...prevState.GestionarMaterial];
          updatedMateriales[index] = {
              ...updatedMateriales[index],
              [name]: value,
          };
          return { ...prevState, GestionarMaterial: updatedMateriales };
      });
  };

  const handleCantidadChange = (index, e) => {
      const { name, value } = e.target;

      setNuevoProyecto((prevState) => {
          const updatedMateriales = [...prevState.GestionarMaterial];
          updatedMateriales[index] = {
              ...updatedMateriales[index],
              [name]: value,
          };
          return { ...prevState, GestionarMaterial: updatedMateriales };
      });
  };

  const agregarMaterial = () => {
      setNuevoProyecto((prevState) => ({
          ...prevState,
          GestionarMaterial: [
              ...prevState.GestionarMaterial,
              { id_Material: "", Cantidad: "" },
          ],
      }));
  };

  // Al hacer clic en el botón de asignar material, llama a onSubmit con los datos seleccionados
  const handleAsignarMaterial = () => {
    if (onSubmit) {
      onSubmit(nuevoProyecto.GestionarMaterial); // Pasamos la lista de materiales al padre
      alert("Material asignado correctamente"); // Muestra un mensaje de éxito
    }
    onClose(); // Cierra el modal
  };

  // Generar la lista de materiales en formato de texto
  const generarListaMateriales = () => {
    return nuevoProyecto.GestionarMaterial.map((material, index) => {
      const materialSeleccionado = materiales.find(
          (item) => item._id === material.id_Material
      );
      const nombreMaterial = materialSeleccionado
          ? materialSeleccionado.nombre
          : "No Seleccionado";
      return `Material ${index + 1}: ${nombreMaterial} - Cantidad: ${
          material.Cantidad || "0"
      }`;
  }).join("\n");
  };


  return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white border-4 rounded-lg shadow p-5 w-1/3">
          <div className="flex items-start justify-between pb-5 border-b rounded-t">
              <h2 className="text-2xl font-bold">Asignar Material</h2>
              <button
          type="button"
          onClick={onClose}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
          </button>
          </div>
              <form>
                  {nuevoProyecto.GestionarMaterial.map((material, index) => (
                      <div key={index} className="my-4">
                          <label htmlFor={`id_Material_${index}`} >Material</label>
                          <select
                              name="id_Material"
                              value={material.id_Material}
                              onChange={(e) => handleMaterialChange(index, e)}
                              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 my-3"
                          >
                              <option value="">Seleccione un material</option>
                              {materiales.map((materialItem) => (
                                  <option key={materialItem._id} value={materialItem._id}>
                                      {materialItem.nombre}
                                  </option>
                              ))}
                          </select>
                          <label htmlFor={`Cantidad_${index}`}>Cantidad</label>
                          <input
                              type="number"
                              name="Cantidad"
                              value={material.Cantidad}
                              onChange={(e) => handleCantidadChange(index, e)}
                              className="shadow appearance-none border rounded w-full py-2 my-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                      </div>
                  ))}
                  <button type="button" onClick={agregarMaterial} className="w-full bg-cyan-600 text-white py-2 rounded mb-4">
                      Agregar Otro Material
                  </button>
                  {/* Textarea para mostrar la lista de materiales */}
                  <label
                        htmlFor="ListaMateriales"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Lista de Materiales Seleccionados
                    </label>
                    <textarea
                        id="ListaMateriales"
                        value={generarListaMateriales()}
                        readOnly
                        rows="5"
                        className="shadow-sm bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    ></textarea>


                  <button onClick={handleAsignarMaterial} className="w-full bg-green-600 text-white py-2 rounded my-3">
                      Asignar Material
                  </button>
              </form>
          </div>
      </div>
  );
};

export default AsignarMaterial;
