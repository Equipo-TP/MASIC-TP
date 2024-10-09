import React, { useState, useEffect } from 'react';
import { obtenerSolicitudPorIdRequest, listarSolicitudesRequest, registrarPresupuestoRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';

const CrearPresupuesto = () => {
    const navigate = useNavigate();
  const [presupuesto, setPresupuesto] = useState({
    Transporte_Personal: '',
    Costo_Transporte: '',
    Materiales: '',
    Costo_Materiales: '',
    Cantidad: '',
    Tipo_Luminaria: ''
  });

  const [solicitudes, setSolicitudes] = useState([]);  // Lista de solicitudes para el menú desplegable
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);  // Solicitud seleccionada

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await listarSolicitudesRequest();
        if (Array.isArray(response.data)) {
          setSolicitudes(response.data);
        }
      } catch (error) {
        console.error('Error al listar solicitudes', error);
      }
    };
    fetchSolicitudes();
  }, []);

  const handleSolicitudChange = async (e) => {
    const solicitudId = e.target.value;
    try {
      const response = await obtenerSolicitudPorIdRequest(solicitudId);
      if (response.data) {
        setSolicitudSeleccionada(response.data);
        setPresupuesto({
          ...presupuesto,
          Transporte_Personal: response.data.distrito  // Llenar automáticamente con el "distrito"
        });
      }
    } catch (error) {
      console.error('Error al obtener solicitud por ID', error);
    }
  };

  const handleInputChange = (e) => {
    setPresupuesto({
      ...presupuesto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarPresupuestoRequest(presupuesto);
      alert('Presupuesto registrado con éxito');
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
          onClick={() => {navigate('/gestionar_presupuestos')}}
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
              <label htmlFor="solicitud" className="text-sm font-medium text-gray-900 block mb-2">
                Selecciona una Solicitud
              </label>
              <select
                onChange={handleSolicitudChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              >
                <option value="">Selecciona una solicitud</option>
                {solicitudes.map((solicitud) => (
                  <option key={solicitud._id} value={solicitud._id}>
                    {solicitud._id} / {solicitud.cliente_nombre}
                  </option>
                ))}
              </select>
            </div>

            {solicitudSeleccionada && (
              <>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="cliente_nombre" className="text-sm font-medium text-gray-900 block mb-2">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    name="cliente_nombre"
                    value={solicitudSeleccionada.cliente_nombre}
                    readOnly
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="vendedor_nombre" className="text-sm font-medium text-gray-900 block mb-2">
                    Nombre del Vendedor
                  </label>
                  <input
                    type="text"
                    name="vendedor_nombre"
                    value={solicitudSeleccionada.vendedor_nombre}
                    readOnly
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="estado_2" className="text-sm font-medium text-gray-900 block mb-2">
                    Estado 2
                  </label>
                  <input
                    type="text"
                    name="estado_2"
                    value={solicitudSeleccionada.estado_2}
                    readOnly
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="caracteristicas_obra" className="text-sm font-medium text-gray-900 block mb-2">
                    Características de la Obra
                  </label>
                  <textarea
                    name="caracteristicas_obra"
                    value={solicitudSeleccionada.caracteristicas_obra}
                    readOnly
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  />
                </div>
              </>
            )}

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Transporte_Personal" className="text-sm font-medium text-gray-900 block mb-2">
                Transporte Personal
              </label>
              <input
                type="text"
                name="Transporte_Personal"
                value={presupuesto.Transporte_Personal}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
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
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
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
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
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
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Tipo_Luminaria" className="text-sm font-medium text-gray-900 block mb-2">
                Tipo de Luminaria
              </label>
              <input
                type="text"
                name="Tipo_Luminaria"
                value={presupuesto.Tipo_Luminaria}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Cantidad" className="text-sm font-medium text-gray-900 block mb-2">
                Cantidad
              </label>
              <input
                type="number"
                name="Cantidad"
                value={presupuesto.Cantidad}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg shadow"
          >
            Crear Presupuesto
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearPresupuesto;
