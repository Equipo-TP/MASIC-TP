import React, { useState, useEffect } from 'react';
import { obtenerSolicitudPorIdRequest, listarSolicitudesRequest, registrarPresupuestoRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CrearPresupuesto = () => {
  const navigate = useNavigate();
  const { user, name } = useAuth();
 
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState({
      solicitud: '', // ID de la solicitud seleccionada
      transporte_personal: '',
      costo_transporte: '',
      materiales: '',
      costo_materiales: '',
      tipo_luminaria: '',
      cantidad: '',
  });

    const [solicitudes, setSolicitudes] = useState([]);  // Lista de solicitudes para el menú desplegable
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState('');  // Solicitud seleccionada
    const [nuevaSolicitud, setNuevaSolicitud] = useState(false); // Para manejar la creación de un nuevo presupuesto basado en una solicitud existente
    const [datosNuevaSolicitud, setDatosNuevaSolicitud] = useState({
        caracteristicas_obra: '',
        descripcion_servicio: '',
        observaciones: '',
        estado_1: 'Enviado',
        estado_2: 'Pendiente',
    });
    // Función para listar todas las solicitudes
    const fetchSolicitudes = async () => {
        try {
            const response = await listarSolicitudesRequest();
            if (Array.isArray(response.data.data)) {
                setSolicitudes(response.data.data);
            } else {
                console.error('La respuesta no es un array:', response.data.data);
            }
        } catch (error) {
            console.error('Error al listar solicitudes', error);
        }
    };

    // Cargar las solicitudes cuando el componente se monta
    useEffect(() => {
        fetchSolicitudes();
    }, []);

 

  const handleSolicitudChange = async (e) => {
    const selectedId = e.target.value;
    setNuevoPresupuesto({ ...nuevoPresupuesto, solicitud: selectedId });

    if (selectedId === 'nuevo') {
        setNuevaSolicitud(true);
        setDatosNuevaSolicitud({
            caracteristicas_obra: '',
            descripcion_servicio: '',
            observaciones: '',
            estado_1: 'Enviado',
            estado_2: 'Pendiente',
        });
    } else {
        const response = await obtenerSolicitudPorIdRequest(selectedId);
        setNuevaSolicitud(false);
        setNuevoPresupuesto({ ...nuevoPresupuesto, solicitud: selectedId });
    }
};
const handleSolicitudChange2 = (event) => {
  const selectedSolicitudId = event.target.value;
  const selectedSolicitud = solicitudes.find((sol) => sol._id === selectedSolicitudId);
  setNuevaSolicitud(selectedSolicitud);
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (nuevaSolicitud && name in datosNuevaSolicitud) {
        setDatosNuevaSolicitud({
            ...datosNuevaSolicitud,
            [name]: value,
        });
    } else {
        setNuevoPresupuesto({
            ...nuevoPresupuesto,
            [name]: value,
        });
    }
};

  const handleNuevaSolicitudSubmit = async (e) => {
    e.preventDefault();
    try {
        const solicitudResponse = await registroSolicitudRequest(datosNuevaSolicitud);
        const nuevaSolicitudId = solicitudResponse.data._id;
        setNuevoPresupuesto({ ...nuevoPresupuesto, solicitud: nuevaSolicitudId });
        alert('Nueva solicitud registrada con éxito.');
        setNuevaSolicitud(false); // Oculta el formulario de nueva solicitud
        setDatosNuevaSolicitud({ // Reinicia los campos de la nueva solicitud
            caracteristicas_obra: '',
            descripcion_servicio: '',
            observaciones: '',
            estado_1: 'Enviado',
            estado_2: 'Pendiente',
        });
    } catch (error) {
        console.error('Error al registrar la nueva solicitud:', error);
        alert('Hubo un error al registrar la nueva solicitud.');
    }
    fetchSolicitudes(); // Refresca la lista de solicitudes
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Registrar el presupuesto
        await registroPresupuestoRequest(nuevoPresupuesto);
        alert('Presupuesto registrado');
    } catch (error) {
        console.error('Error al registrar el presupuesto:', error);
        alert('Hubo un error al registrar el presupuesto.');
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
                name="solicitud"
                id="solicitud"
                value={nuevaSolicitud}
                onChange={handleSolicitudChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              >
                <option value="">Seleccione una solicitud</option>
                {solicitudes.map(nuevaSolicitud => (
                  <option key={nuevaSolicitud._id} value={nuevaSolicitud._id}>
                    {nuevaSolicitud.id} / {nuevaSolicitud.cliente}
                  </option>
                ))}
              </select>
              
            </div>

            {nuevaSolicitud && (

              <>
              

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="cliente_nombre" className="text-sm font-medium text-gray-900 block mb-2">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    name="cliente_nombre"
                    value={nuevaSolicitud.cliente_nombre}
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
                    value={nuevaSolicitud.vendedor_nombre}
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
                    value={nuevaSolicitud.estado_2}
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
                    value={nuevaSolicitud.caracteristicas_obra}
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
                id="Transporte_Personal"
                value={nuevoPresupuesto.Transporte_Personal}
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
                value={nuevoPresupuesto.Costo_Transporte}
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
                value={nuevoPresupuesto.Materiales}
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
                value={nuevoPresupuesto.Costo_Materiales}
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
                value={nuevoPresupuesto.Tipo_Luminaria}
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
                value={nuevoPresupuesto.Cantidad}
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
            Registrar Presupuesto
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearPresupuesto;
