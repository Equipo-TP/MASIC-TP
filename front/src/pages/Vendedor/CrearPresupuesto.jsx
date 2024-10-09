import React, { useState, useEffect } from 'react';
import { registrarPresupuestoRequest, listarTarifasRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

const CrearPresupuesto = () => {
  const [presupuesto, setPresupuesto] = useState({
    ID_Presupuesto: '',
    Tiempo: '',
    Transporte_Personal: '',
    Costo_Transporte: '',
    Materiales: '',
    Costo_Materiales: '',
    Cantidad: '',
    DescripcionLuminaria: '',
    PrecioLuminaria: ''
  });

  const [tarifas, setTarifas] = useState([]); // Inicializa como un array vacío
  const [selectedTarifa, setSelectedTarifa] = useState(null);

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const response = await listarTarifasRequest();
        // Asegúrate de que `response.data` sea un array antes de asignarlo
        if (Array.isArray(response.data)) {
          setTarifas(response.data);
        } else {
          setTarifas([]); // Si no es un array, asigna un array vacío
        }
      } catch (error) {
        console.error('Error al listar tarifas', error);
        setTarifas([]); // En caso de error, mantén tarifas como un array vacío
      }
    };
    fetchTarifas();
  }, []);

  const handleInputChange = (e) => {
    setPresupuesto({
      ...presupuesto,
      [e.target.name]: e.target.value
    });
  };

  const handleTarifaChange = (e) => {
    const tarifa = tarifas.find(t => t.ID_tarifa === e.target.value);
    if (tarifa) {
      setSelectedTarifa(tarifa);
      setPresupuesto({
        ...presupuesto,
        DescripcionLuminaria: tarifa.Descripcion,
        PrecioLuminaria: tarifa.Precio
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarPresupuestoRequest(presupuesto);
      alert('Presupuesto registrado con éxito');
      // Aquí puedes redirigir a la página que necesites
    } catch (error) {
      console.error('Error al registrar presupuesto', error);
      alert('Hubo un error al registrar el presupuesto');
    }
  };

  return (
    <div className="bg-white border-4 rounded-lg shadow relative m-10">
      <div className="flex items-start justify-between p-5 border-b rounded-t">
        <h3 className="text-xl font-semibold">Formulario de Presupuesto</h3>
        <button
          type="button"
          onClick={() => {
            navigate('/gestionar_presupuestos'); // Redirige a la ruta deseada
          }}
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
  
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="ID_Presupuesto" className="text-sm font-medium text-gray-900 block mb-2">
                ID Presupuesto
              </label>
              <input
                type="text"
                name="ID_Presupuesto"
                value={presupuesto.ID_Presupuesto}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              />
            </div>
  
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Tiempo" className="text-sm font-medium text-gray-900 block mb-2">
                Fecha (Tiempo)
              </label>
              <input
                type="date"
                name="Tiempo"
                value={presupuesto.Tiempo}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              />
            </div>
  
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Transporte_Personal" className="text-sm font-medium text-gray-900 block mb-2">
                Transporte Personal
              </label>
              <input
                type="text"
                name="Transporte_Personal"
                value={presupuesto.Transporte_Personal}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              />
            </div>
  
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Costo_Transporte" className="text-sm font-medium text-gray-900 block mb-2">
                Costo Transporte
              </label>
              <input
                type="number"
                name="Costo_Transporte"
                value={presupuesto.Costo_Transporte}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              />
            </div>
  
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Materiales" className="text-sm font-medium text-gray-900 block mb-2">
                Materiales
              </label>
              <input
                type="text"
                name="Materiales"
                value={presupuesto.Materiales}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              />
            </div>
  
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Costo_Materiales" className="text-sm font-medium text-gray-900 block mb-2">
                Costo Materiales
              </label>
              <input
                type="number"
                name="Costo_Materiales"
                value={presupuesto.Costo_Materiales}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              />
            </div>
  
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="TipoLuminaria" className="text-sm font-medium text-gray-900 block mb-2">
                Tipo de Luminaria
              </label>
              <select
                onChange={handleTarifaChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              >
                <option value="">Selecciona una luminaria</option>
                {Array.isArray(tarifas) &&
                  tarifas.map((tarifa) => (
                    <option key={tarifa.ID_tarifa} value={tarifa.ID_tarifa}>
                      {tarifa.Descripcion}
                    </option>
                  ))}
              </select>
            </div>
  
            {selectedTarifa && (
              <>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="DescripcionLuminaria" className="text-sm font-medium text-gray-900 block mb-2">
                    Descripción Luminaria
                  </label>
                  <input
                    type="text"
                    name="DescripcionLuminaria"
                    value={presupuesto.DescripcionLuminaria}
                    readOnly
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  />
                </div>
  
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="PrecioLuminaria" className="text-sm font-medium text-gray-900 block mb-2">
                    Precio Luminaria
                  </label>
                  <input
                    type="number"
                    name="PrecioLuminaria"
                    value={presupuesto.PrecioLuminaria}
                    readOnly
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  />
                </div>
              </>
            )}
  
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Cantidad" className="text-sm font-medium text-gray-900 block mb-2">
                Cantidad
              </label>
              <input
                type="number"
                name="Cantidad"
                value={presupuesto.Cantidad}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              />
            </div>
          </div>
  
          <button
            type="submit"
            className="mt-4 bg-green-800 text-white font-bold py-2 px-4 rounded hover:bg-green-900"
          >
            Registrar Presupuesto
          </button>
        </form>
      </div>
    </div>
  );
  
}
export default CrearPresupuesto;
