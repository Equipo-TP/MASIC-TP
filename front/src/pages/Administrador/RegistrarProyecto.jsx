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
    }
  };

  const handleCancelar = () => {
    navigate(-1); 
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
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full p-2 border rounded h-20"
                required
              />
              {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion}</p>}
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
              {errors.observaciones && <p className="text-red-500 text-sm">{errors.observaciones}</p>}
            </div>
            <div className="flex justify-between col-span-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-gray-500 text-white px-4 py-2 m-4 rounded"
              >
                Asignar Material
              </button>
              <AsignarMaterial
                isOpen={isModalOpen}
                onSubmit={handleNuevoMaterialSubmit}
                onClose={() => setIsModalOpen(false)}
              />

              <textarea
                className="w-full p-2 border rounded-lg mr-3"
                rows="5"
                readOnly
                value={gestionarMaterial.map((material, index) => {
                  const materialEncontrado = materiales.find((item) => item._id === material.id_Material);
                  return `Material ${index + 1}: ${materialEncontrado ? materialEncontrado.nombre: 'Desconocido'}, Cantidad: ${material.Cantidad}`;
                }).join("\n")}
              />

              <div className="block w-full">
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
      </div>
    </div>
  );
};

export default RegistrarProyecto;
