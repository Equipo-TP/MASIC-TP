import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearProyectoRequest, listarPresupuestosAprobados } from '../../api/auth';
import AsignarMaterial from './AsignarMaterial';

const RegistrarProyecto = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [presupuestos, setPresupuestos] = useState([]);
  const [clienteNombre, setClienteNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [datosFormulario, setDatosFormulario] = useState({});

  useEffect(() => {
    const cargarPresupuestos = async () => {
      try {
        const respuesta = await listarPresupuestosAprobados();
        console.log(respuesta.data);
        if (Array.isArray(respuesta.data.data)) {
          setPresupuestos(respuesta.data.data);
      } else {
          console.error('La respuesta no es un array:', respuesta.data.data);
      }
      } catch (error) {
        console.error('Error al cargar los presupuestos aprobados:', error);
      }
    };

    cargarPresupuestos();
  }, []);

  // Función para manejar el envío de datos desde el modal
  const handleNuevoMaterialSubmit = (data) => {
    setDatosFormulario(data); // Almacena los datos del modal en el estado del formulario
    console.log('Datos del formulario:', data);
    setIsModalOpen(false); // Cierra el modal
};

  const handlePresupuestoChange = (e) => {
    const presupuestoID = e.target.value;
    setPresupuesto(presupuestoID);

    const presupuestoSeleccionado = presupuestos.find((pres) => pres._id === presupuestoID);
    console.log(presupuestoSeleccionado);
    if (presupuestoSeleccionado) {
      setClienteNombre(presupuestoSeleccionado.ID_Solicitud_Presupuesto.cliente.nombre);
      setDireccion(presupuestoSeleccionado.Transporte_Personal);
    } else {
      setClienteNombre('');
      setDireccion('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoProyecto = {
      Nombre_Proyecto: nombre,
      Descripcion: descripcion,
      ID_Presupuesto_Proyecto: presupuesto,
      clienteNombre,
      direccion,
      Observacion: observaciones,
    };

    try {
      console.log('Datos del proyecto:', nuevoProyecto);
      await crearProyectoRequest(nuevoProyecto);
      alert('Proyecto creado exitosamente');
      navigate(-1); // Regresa a la página anterior después de crear el proyecto
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      alert('Hubo un error al crear el proyecto');
    }
  };

  const handleCancelar = () => {
    navigate(-1); // Regresa a la página anterior al cancelar
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Registrar Proyecto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-700">Nombre del proyecto</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full p-2 border rounded h-20"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Presupuesto</label>
              <select
                value={presupuesto}
                onChange={handlePresupuestoChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccione un presupuesto</option>
                {presupuestos.map((presupuesto) => (
                  <option key={presupuesto._id} value={presupuesto._id}>
                    {presupuesto.ID_Presupuesto}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Cliente</label>
              <input
                type="text"
                value={clienteNombre}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700">Dirección</label>
              <input
                type="text"
                value={direccion}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700">Observaciones del proyecto</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full p-2 border rounded h-20"
              />
            </div>
            <div className="flex justify-between col-span-2">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(true)} // Abre el modal de Asignar Material
              >
                Asignar Material
              </button>
              {isModalOpen && (
                <AsignarMaterial onSubmit={handleNuevoMaterialSubmit} />
            )}

              <div>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </form>
        {/* Modal para Asignar Material */}
        <AsignarMaterial isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
};

export default RegistrarProyecto
