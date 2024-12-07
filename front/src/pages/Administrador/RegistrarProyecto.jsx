import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearProyectoRequest, listarPresupuestosAprobados, listarAlmacenesRequest } from '../../api/auth';
import AsignarMaterial from './AsignarMaterial';

const RegistrarProyecto = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [presupuestos, setPresupuestos] = useState([]);
  const [clienteNombre, setClienteNombre] = useState('');
  const [pago_total, setPagoTotal] = useState('');
  const [direccion, setDireccion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [gestionarMaterial, setGestionarMaterial] = useState([]);
  const [materiales, setMateriales] = useState([]);
  
  // Estados para mensajes de error
  const [errors, setErrors] = useState({
    nombre: '',
    descripcion: '',
    observaciones: '',
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

  useEffect(() => {
    const cargarPresupuestos = async () => {
      try {
        const respuesta = await listarPresupuestosAprobados();
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

  const handlePresupuestoChange = (e) => {
    const presupuestoID = e.target.value;
    setPresupuesto(presupuestoID);

    const presupuestoSeleccionado = presupuestos.find((pres) => pres._id === presupuestoID);
    if (presupuestoSeleccionado) {
      setClienteNombre(presupuestoSeleccionado.ID_Solicitud_Presupuesto.cliente.nombre);
      setDireccion(presupuestoSeleccionado.Transporte_Personal);
      setPagoTotal(presupuestoSeleccionado.Pago_Total);
    } else {
      setClienteNombre('');
      setDireccion('');
    }
  };

  const handleNuevoMaterialSubmit = (materiales) => {
    setGestionarMaterial(materiales); 
    setIsModalOpen(false); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let formIsValid = true;
    let validationErrors = {};

    // Validación de los campos
    if (!nombre.trim()) {
      validationErrors.nombre = 'Por favor, ingrese el nombre del proyecto.';
      formIsValid = false;
    }

    // Validar que el nombre del proyecto no sea solo números o espacios
    const nombreRegex = /^(?!\s*$)(?![0-9]+$)[a-zA-Z0-9\s]+$/;
    if (nombre && !nombreRegex.test(nombre)) {
      validationErrors.nombre = 'El nombre del proyecto no debe ser solo números ni espacios.';
      formIsValid = false;
    }

    if (!descripcion.trim()) {
      validationErrors.descripcion = 'La descripción no puede estar vacía.';
      formIsValid = false;
    }

    if (!observaciones.trim()) {
      validationErrors.observaciones = 'Las observaciones no pueden estar vacías.';
      formIsValid = false;
    }

    // Si hay errores, actualizar el estado de errores y detener el envío del formulario
    setErrors(validationErrors);

    if (!formIsValid) return;

    const nuevoProyecto = {
      Nombre_Proyecto: nombre,
      Descripcion: descripcion,
      ID_Presupuesto_Proyecto: presupuesto,
      GestionarMaterial: gestionarMaterial, 
      Costo_Total: pago_total,
    };

    try {
      await crearProyectoRequest(nuevoProyecto);
      alert("Proyecto creado exitosamente");
      navigate(-1); 
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
      alert(error.response.data.message);
    }
  };

  const handleCancelar = () => {
    navigate(-1); 
  };

  return (
    <div className="bg-white border-4 rounded-lg shadow-md relative m-10 h-[calc(100vh-70px)] overflow-y-auto">
  <div className="flex items-start justify-between p-5 border-b rounded-t bg-gray-100">
    <h3 className="text-xl font-semibold text-gray-800">Registrar Proyecto</h3>
    <button
          type="button"
          onClick={() => {navigate('/gestionar_proyectos')}}
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
      <div className="grid grid-cols-2 gap-4">
        {/* Presupuesto */}
        <div>
          <label className="block text-gray-700 font-medium">Presupuesto</label>
          <select
            value={presupuesto}
            onChange={handlePresupuestoChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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

        {/* Cliente */}
        <div>
          <label className="block text-gray-700 font-medium">Cliente</label>
          <input
            type="text"
            value={clienteNombre}
            className="w-full p-3 border rounded-lg bg-gray-100"
            readOnly
          />
        </div>

        {/* Dirección */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Dirección</label>
          <input
            type="text"
            value={direccion}
            className="w-full p-3 border rounded-lg bg-gray-100"
            readOnly
          />
        </div>

        {/* Nombre del Proyecto */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Nombre del proyecto</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
        </div>

        {/* Descripción */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 border rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion}</p>}
        </div>

        {/* Observaciones */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Observaciones del proyecto</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full p-3 border rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.observaciones && <p className="text-red-500 text-sm">{errors.observaciones}</p>}
        </div>

        {/* Botón Asignar Material y TextArea */}
        <div className="flex flex-col w-full col-span-2 space-y-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Asignar Material
          </button>

          <AsignarMaterial
            isOpen={isModalOpen}
            onSubmit={handleNuevoMaterialSubmit}
            onClose={() => setIsModalOpen(false)}
          />

          <textarea
            className="w-full p-3 border rounded-lg bg-gray-50 h-36 resize-none focus:outline-none"
            rows="5"
            readOnly
            value={gestionarMaterial.map((material, index) => {
              const materialEncontrado = materiales.find((item) => item._id === material.id_Material);
              return `Material ${index + 1}: ${materialEncontrado ? materialEncontrado.nombre : 'Desconocido'}, Cantidad: ${material.Cantidad}`;
            }).join("\n")}
          />
        </div>
      </div>

      {/* Botones Crear y Cancelar */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Crear
        </button>
        <button
          type="button"
          onClick={handleCancelar}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default RegistrarProyecto;
