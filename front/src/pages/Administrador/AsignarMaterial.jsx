import React, { useState, useEffect } from "react";
import { listarAlmacenesRequest } from "../../api/auth"; // Ajusta la ruta según tu proyecto

const AsignarMaterial = ({ isOpen, onSubmit, onClose }) => {
  if (!isOpen) return null;

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
              <h2 className="text-2xl font-bold mb-4">Asignar Material</h2>
              <form>
                  {nuevoProyecto.GestionarMaterial.map((material, index) => (
                      <div key={index} className="mb-6">
                          <label htmlFor={`id_Material_${index}`}>Material</label>
                          <select
                              name="id_Material"
                              value={material.id_Material}
                              onChange={(e) => handleMaterialChange(index, e)}
                              className="block w-full"
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
                              className="block w-full"
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
