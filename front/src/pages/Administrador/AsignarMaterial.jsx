import React from 'react';
import { listarAlmacenesRequest } from '../../api/auth';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';

const AsignarMaterial = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [materiales, setMateriales] = useState([]);
  const [nuevoMaterial, setNuevoMaterial] = useState(false);// Para manejar la creación de un nuevo material
  const [datosNuevoMaterial, setDatosNuevoMaterial] = useState({
    nombre: '',
    stock: '',
    unidad_medida: ''
  });
  const [nuevoProyecto, setNuevoProyecto] = useState({
    GestionarMaterial: [{
      id_Material:  '',
      Cantidad: '',
    }],
});

      // Función para cargar la lista de materiales
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

    // Cargar la lista de materiales cuando el componente se monta
    useEffect(() => {
        fetchMateriales(); // Carga la lista de materiales al montar el componente
    }, []);

    // Manejar el cambio del combobox de materiales
    const handleMaterialChange = async (e) => {
      console.log("Evento recibido:", e);
      const { target } = e || {};
       if (!target || !target.name || !target.value) {
        console.error("El evento no contiene las propiedades esperadas.");
        return;
    }

    const { name, value } = target;

    setNuevoProyecto((prevState) => {
        const newMaterials = [...prevState.GestionarMaterial];

        if (name === "id_Material") {
            if (value === "nuevo") {
                setNuevoMaterial(true);
                setDatosNuevoMaterial({
                    nombre: "",
                    stock: "",
                    unidad_medida: ""
                });
            } else {
                setNuevoMaterial(false);
                newMaterials[0] = {
                    ...newMaterials[0],
                    id_Material: value
                };
            }
        }

        if (name === "Cantidad") {
            newMaterials[0] = {
                ...newMaterials[0],
                Cantidad: value
            };
        }

        return {
            ...prevState,
            GestionarMaterial: newMaterials
        };
    });
  };

  const onSubmit = async (data) => {
    console.log(nuevoProyecto);
  }

  // Manejar el cambio de input de la solicitud y los datos del nuevo material
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (nuevoMaterial && name in datosNuevoMaterial) {
        setDatosNuevoMaterial({
            ...datosNuevoMaterial,
            [name]: value,
        });
    } else {
        setNuevoProyecto({
            ...nuevoProyecto,
            [name]: value,
        });
    }
};
//Ingreso de nuevo cliente
const handleNuevoMaterialSubmit = async (e) => {
    e.preventDefault();
    try {
        const clienteResponse = await await axios.post('http://localhost:8000/api/registro_material', datosNuevoMaterial);;
        const nuevoMaterialId = clienteResponse.data._id;
        setNuevoProyecto({ ...nuevoProyecto, GestionarMaterial: [{
          id_Material:  nuevoMaterialId
        }], });
        alert('Nuevo material registrado con éxito.');
        setNuevoCliente(false); // Oculta el formulario de nuevo cliente
        setDatosNuevoMaterial({
          nombre: '',
          stock: '',
          unidad_medida: ''
      });
    } catch (error) {
        console.error('Error al registrar el nuevo cliente:', error);
        alert('Hubo un error al registrar el nuevo cliente.');
    }
    fetchClientes();
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white border-4 rounded-lg shadow relative m-10 h-[calc(100vh-70px)] overflow-y-auto w-1/3">
        <h2 className="text-2xl font-bold mb-4">Asignar Material</h2>

        {/* Formulario de asignación de materiales */}
        <div className="space-y-4">

        {nuevoProyecto.GestionarMaterial.map((material, index) => (
            <React.Fragment key={index}>
              <div className="space-y-4">
                <label htmlFor={`id_Material_${index}`} className="text-sm font-medium text-gray-900 block mb-2">
                  Material
                </label>
                <select name="id_Material" id="id_Material"
                onChange={handleMaterialChange}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
              {nuevoMaterial && (
                            <>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="nombreCliente" className="text-sm font-medium text-gray-900 block mb-2">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="nombreCliente"
                                        value={datosNuevoMaterial.nombre}
                                        onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        required
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="apellidosCliente" className="text-sm font-medium text-gray-900 block mb-2">
                                        Apellidos
                                    </label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        id="apellidosCliente"
                                        value={datosNuevoMaterial.stock}
                                        onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        required
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="telefonoCliente" className="text-sm font-medium text-gray-900 block mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        name="telefono"
                                        id="telefonoCliente"
                                        value={datosNuevoMaterial.unidad_medida}
                                        onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        required
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <button
                                        type="button"
                                        onClick={handleNuevoMaterialSubmit}
                                        className="mt-4 bg-green-800 text-white font-bold py-2 px-4 rounded hover:bg-green-900"
                                    >
                                        Registrar Nuevo Material
                                    </button>
                                </div>
                                

                            </>
                        )}
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor={`Cantidad_${index}`} className="text-sm font-medium text-gray-900 block mb-2">
                  Cantidad usada en el proyecto
                </label>
                <input
                  type="number"
                  name="Cantidad"
                  value={material.Cantidad}
                  onChange={handleMaterialChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
            </React.Fragment>
          ))}
          <button
            type="button"
            /*onClick={handleAddLuminaria}*/
            className="mt-6 w-full bg-green-700 hover:bg-gray-300 text-white font-medium py-2 px-2 rounded-lg shadow col-span-6 sm:col-span-2"
          >
            <AddIcon className="mr-2 " />
            Ingresar nuevo tipo de luminaria
          </button>

          {/* */}
          <label className="block text-gray-700" >Cantidad usada en el proyecto</label>
          <input type="text" className="w-full p-2 border rounded" name="cantidad"
                /*value={GestionarMaterial.Cantidad}*/
                onChange={(e) => handleMaterialChange(index, e)} />
          
          <label className="block text-gray-700">Lista de Materiales en proyecto</label>
          <textarea className="w-full p-2 border rounded h-20" />
          
          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
              Volver
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded" type="button"
                    onClick={onSubmit}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignarMaterial;
