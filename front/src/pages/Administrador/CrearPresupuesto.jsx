import React, { useState, useEffect } from 'react';
import { obtenerSolicitudPorIdRequest, listarSolicitudesRequest, registrarPresupuestoRequest, listarTarifasRequest } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { presupuestoSchema } from '../../Schemas/AUTH';
import AddIcon from '@mui/icons-material/Add';

const CrearPresupuesto = () => {
  const navigate = useNavigate();
 
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState({
      ID_Solicitud_Presupuesto: '', // ID de la solicitud seleccionada
      Transporte_Personal: '',
      Costo_Transporte: '',
      Materiales: '',
      Costo_Materiales: '',
      instalaciones: [{ // Añadimos aquí el array de instalaciones
        tipo_luminaria: '',
        cantidad: '',
    }],
  });

    const [solicitudes, setSolicitudes] = useState([]);  // Lista de solicitudes para el menú desplegable
    const [ luminaria, setLuminaria] = useState([]); // Lista de tipos de luminarias a instalar par el menú desplegable
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState('');  // Solicitud seleccionada
    const [nuevaSolicitud, setNuevaSolicitud] = useState(false); // Para manejar la creación de un nuevo presupuesto basado en una solicitud existente
    const [datosNuevaSolicitud, setDatosNuevaSolicitud] = useState({
        caracteristicas_obra: '',
        descripcion_servicio: '',
        observaciones: '',
        estado_1: 'Enviado',
        estado_2: 'Pendiente',
    });

    const [errores, setErrores] = useState({});

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
    // Función para listar todas las solicitudes
    const fetchTarifas = async () => {
      try {
          const response = await listarTarifasRequest();
          if (Array.isArray(response.data.data)) {
              setLuminaria(response.data.data);
          } else {
              console.error('La respuesta no es un array:', response.data.data);
          }
      } catch (error) {
          console.error('Error al listar solicitudes', error);
      }
  };

    // Cargar las solicitudes y las luminarias cuando el componente se monta
    useEffect(() => {
        fetchSolicitudes();
        fetchTarifas();
    }, []);

 

  const handleSolicitudChange = async (e) => {
    const selectedId = e.target.value;
    setNuevoPresupuesto({ ...nuevoPresupuesto, solicitud: selectedId });

    if (selectedId !== 'nuevo') {
      try {
        const response = await obtenerSolicitudPorIdRequest(selectedId);
        const solicitud = response.data.data; // Asumiendo que aquí tienes la solicitud seleccionada
        setSolicitudSeleccionada(solicitud);
  
        // Actualiza los campos del formulario con los datos de la solicitud seleccionada
        setNuevoPresupuesto({
          ...nuevoPresupuesto,
          ID_Solicitud_Presupuesto: solicitud._id ,
          Transporte_Personal: solicitud.distrito || '',
          Costo_Transporte: solicitud.distrito || '',
          Materiales: solicitud.materiales || '',
          Costo_Materiales: solicitud.costo_materiales || '',
          instalaciones: [{
            tipo_luminaria: solicitud.tipo_luminaria || '',
            cantidad: solicitud.cantidad || '',
          }],
        });
      } catch (error) {
        console.error('Error al obtener la solicitud:', error);
      }
    } else {
      setNuevaSolicitud(true);
    }
};

// Función para agregar una nueva instalación
const handleAddLuminaria = () => {
  setNuevoPresupuesto((prevPresupuesto) => ({
    ...prevPresupuesto,
    instalaciones: [...prevPresupuesto.instalaciones, { tipo_luminaria: "", cantidad: 1 }]
  }));
};

// Función para manejar cambios en los campos de las instalaciones
const handleLuminariaChange = (index, e) => {
  const { name, value } = e.target;

  let newValue = value;
  if (name === "cantidad") {
    newValue = parseInt(value, 10);
    if (newValue < 1) {
      setErrores((prevErrores) => ({
        ...prevErrores,
        [`instalaciones[${index}].cantidad`]: "La cantidad no puede ser menor a 1",
      }));
    } else {
      setErrores((prevErrores) => {
        const { [`instalaciones[${index}].cantidad`]: _, ...rest } = prevErrores;
        return rest;
      });
    }
  }

  const nuevasInstalaciones = [...nuevoPresupuesto.instalaciones];
  nuevasInstalaciones[index] = {
    ...nuevasInstalaciones[index],
    [name]: newValue,
  };
  setNuevoPresupuesto({ ...nuevoPresupuesto, instalaciones: nuevasInstalaciones });
};

const handleInputChange = (e) => {
  const { name, value } = e.target;

  // Convertir los valores a números si es necesario
  let newValue = value;
  if (name === "Costo_Transporte" || name === "Costo_Materiales") {
    newValue = parseFloat(value); // Convierte el valor a número flotante
  }

  if (nuevaSolicitud && name in datosNuevaSolicitud) {
    setDatosNuevaSolicitud({
      ...datosNuevaSolicitud,
      [name]: newValue,
    });
  } else {
    setNuevoPresupuesto({
      ...nuevoPresupuesto,
      [name]: newValue,
    });
  }
};


const validarDatos = () => {
  try {
    presupuestoSchema.parse(nuevoPresupuesto);
    setErrores({});
    return true; // Los datos son válidos
  } catch (error) {
    if (error.errors) {
      const erroresMapeados = error.errors.reduce((acc, curr) => {
        acc[curr.path.join('.')] = curr.message;
        return acc;
      }, {});
      setErrores(erroresMapeados);
    }
    return false; // Los datos no son válidos
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validarDatos()) {
    alert('Corrige los errores antes de continuar.');
    console.log(errores);
    return;
  }

  try {
    await registrarPresupuestoRequest(nuevoPresupuesto);
    alert('Presupuesto registrado');
  } catch (error) {
    console.error('Error al registrar el presupuesto:', error);
    alert('Hubo un error al registrar el presupuesto.');
  }
};

  return (
    <div className="bg-white border-4 rounded-lg shadow relative m-10 h-[calc(100vh-70px)] overflow-y-auto">
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
            <div className="col-span-6 sm:col-span-6">
              <label htmlFor="solicitud" className="text-sm font-medium text-gray-900 block mb-2">
                Selecciona una Solicitud
              </label>
              <select
                name="solicitud"
                id="solicitud"
                value={nuevoPresupuesto.solicitud}
                onChange={handleSolicitudChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              >
                <option value="">Seleccione una solicitud</option>
                {solicitudes.map(nuevaSolicitud => (
                  <option key={nuevaSolicitud._id} value={nuevaSolicitud._id}>
                    {nuevaSolicitud.id}  / {nuevaSolicitud.cliente.nombre} {nuevaSolicitud.cliente.apellidos}
                  </option>
                ))}
              </select>
              
            </div>

            {solicitudSeleccionada && (

              <>
              
              <div className="col-span-6">
              <hr className="mb-6"/>
              <h5 className="text-xl font-semibold">Detalles de la Solicitud</h5>
              </div>

                <div className="col-span-6 sm:col-span-2">
                  <label htmlFor="cliente_nombre" className="text-sm font-medium text-gray-900 block mb-2">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    name="cliente_nombre"
                    value={solicitudSeleccionada.cliente.nombre + " " + solicitudSeleccionada.cliente.apellidos}
                    readOnly
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label htmlFor="vendedor_nombre" className="text-sm font-medium text-gray-900 block mb-2">
                    Nombre del Vendedor
                  </label>
                  <input
                    type="text"
                    name="vendedor_nombre"
                    value={solicitudSeleccionada.vendedor.nombre + " " + solicitudSeleccionada.vendedor.apellidos}
                    readOnly
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
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
                <div className="col-span-3">
                  <label htmlFor="caracteristicas_obra" className="text-sm font-medium text-gray-900 block mb-2">
                    Descripción de servicio
                  </label>
                  <textarea
                    name="caracteristicas_obra"
                    value={solicitudSeleccionada.descripcion_servicio}
                    readOnly
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  />
                </div>

                <div className="col-span-3">
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
                <hr className="mt-6 col-span-6"/>
              </>
            )}
             <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Transporte_Personal" className="text-sm font-medium text-gray-900 block mb-2">
                Distrito
              </label>
              <input
                type="text"
                name="transporte_personal"
                id="Transporte_Personal"
                value={nuevoPresupuesto.Transporte_Personal}
                onChange={handleSolicitudChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              />
              {errores.Transporte_Personal && (
                <p className="text-red-500 text-sm mt-1">{errores.Transporte_Personal}</p>
              )}
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
              {errores.Costo_Transporte && (
                <p className="text-red-500 text-sm mt-1">{errores.Costo_Transporte}</p>
              )}
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
              {errores.Materiales && (
                <p className="text-red-500 text-sm mt-1">{errores.Materiales}</p>
              )}
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
              {errores.Costo_Materiales && (
                <p className="text-red-500 text-sm mt-1">{errores.Costo_Materiales}</p>
              )}
            </div>


            {nuevoPresupuesto.instalaciones.map((instalacion, index) => (
            <React.Fragment key={index}>
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor={`tipo_luminaria_${index}`} className="text-sm font-medium text-gray-900 block mb-2">
                  Tipo de Luminaria
                </label>
                <select
                  name="tipo_luminaria"
                  id={`tipo_luminaria_${index}`}
                  value={instalacion.tipo_luminaria}
                  onChange={(e) => handleLuminariaChange(index, e)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  required
                >
                  <option value="">Seleccione un tipo de luminaria a instalar</option>
                  {luminaria.map(tipoluminaria => (
                    <option key={tipoluminaria._id} value={tipoluminaria._id}>
                      {tipoluminaria.tipo_luminaria}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor={`cantidad_${index}`} className="text-sm font-medium text-gray-900 block mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={instalacion.cantidad}
                  onChange={(e) => handleLuminariaChange(index, e)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  required
                />
                {errores[`instalaciones.${index}.cantidad`] && (
                  <p className="text-red-500 text-sm mt-1">{errores[`instalaciones.${index}.cantidad`]}</p>
                )}

              </div>
            </React.Fragment>
          ))}
          <button
            type="button"
            onClick={handleAddLuminaria}
            className="mt-6 w-full bg-green-700 hover:bg-gray-300 text-white font-medium py-2 px-2 rounded-lg shadow col-span-6 sm:col-span-2"
          >
            <AddIcon className="mr-2 " />
            Ingresar nuevo tipo de luminaria
          </button>

          </div>

          <button
            type="submit"
            className="mt-8 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg shadow h-14"
          >
            Registrar Presupuesto
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearPresupuesto;
