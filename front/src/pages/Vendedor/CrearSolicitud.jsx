import React, { useState, useEffect } from 'react';
import { listarClientesRequest, obtenerClientePorIdRequest, registroClienteRequest, registroSolicitudRequest } from '../../api/auth'; // Asegúrate de importar correctamente tus funciones
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SolicitudForm = () => {
    const navigate = useNavigate();
    const { user, name } = useAuth();
    const [clientes, setClientes] = useState([]);
    const [nuevaSolicitud, setNuevaSolicitud] = useState({
        vendedor: user.data._id, // Aquí se guarda el ID del vendedor
        cliente: '',
        caracteristicas_obra: '',
        descripcion_servicio: '',
        observaciones: '',
        estado_1: 'Enviado',
        estado_2: 'Pendiente',
        presupuesto: '',
    });

    const [nuevoCliente, setNuevoCliente] = useState(false); // Para manejar la creación de un nuevo cliente
    const [datosNuevoCliente, setDatosNuevoCliente] = useState({
        nombre: '',
        apellidos: '',
        tipo: 'Persona Natural',
        ruc: '',
        email: '',
        telefono: '',
    });
     // Para manejar los datos de un nuevo cliente

    // Función para cargar la lista de clientes
    const fetchClientes = async () => {
        try {
            const response = await listarClientesRequest();
            if (Array.isArray(response.data.data)) {
                setClientes(response.data.data);
            } else {
                console.error('La respuesta no es un array:', response.data.data);
                setClientes([]);
            }
        } catch (error) {
            console.error('Error al listar clientes:', error);
        }
    };

    // Cargar la lista de clientes cuando el componente se monta
    useEffect(() => {
        fetchClientes(); // Carga la lista de clientes al montar el componente
    }, []);

    // Manejar el cambio del combobox de clientes
    const handleClienteChange = async (e) => {
        const selectedId = e.target.value;
        setNuevaSolicitud({ ...nuevaSolicitud, cliente: selectedId });
    
        if (selectedId === 'nuevo') {
            setNuevoCliente(true);
            setDatosNuevoCliente({
                nombre: '',
                apellidos: '',
                tipo: 'Persona Natural',
                email: '',
                telefono: ''
            });
        } else {
            const response = await obtenerClientePorIdRequest(selectedId);
            setNuevoCliente(false);
            setNuevaSolicitud({ ...nuevaSolicitud, cliente: selectedId });
        }
    };
    


    // Manejar el cambio de input de la solicitud y los datos del nuevo cliente
    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (nuevoCliente && name in datosNuevoCliente) {
            setDatosNuevoCliente({
                ...datosNuevoCliente,
                [name]: value,
            });
        } else {
            setNuevaSolicitud({
                ...nuevaSolicitud,
                [name]: value,
            });
        }
    };

    //Ingreso de nuevo cliente
    const handleNuevoClienteSubmit = async (e) => {
        e.preventDefault();
        try {
            const clienteResponse = await registroClienteRequest(datosNuevoCliente);
            const nuevoClienteId = clienteResponse.data._id;
            setNuevaSolicitud({ ...nuevaSolicitud, cliente: nuevoClienteId });
            alert('Nuevo cliente registrado con éxito.');
            setNuevoCliente(false); // Oculta el formulario de nuevo cliente
            setDatosNuevoCliente({ // Reinicia los campos del nuevo cliente
                nombre: '',
                apellidos: '',
                tipo: 'Persona Natural',
                ruc: '',
                email: '',
                telefono: '',
            });
        } catch (error) {
            console.error('Error al registrar el nuevo cliente:', error);
            alert('Hubo un error al registrar el nuevo cliente.');
        }
        fetchClientes();
    };
    

    // Manejar el registro de la solicitud
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Registrar la solicitud
            await registroSolicitudRequest(nuevaSolicitud);
            alert('Solicitud registrada');
        } catch (error) {
            console.error('Error al registrar:', error);
            alert('Hubo un error al registrar la solicitud.');
        }
    };
    
    
    return (
        <div className="bg-white border-4 rounded-lg shadow relative m-10">
            <div className="flex items-start justify-between p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold">Formulario de Solicitud</h3>
                <button
                    type="button"
                    onClick={() => {
                        navigate('/gestionar_solicitudes'); // Redirige a la ruta deseada
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
                            <label htmlFor="vendedor" className="text-sm font-medium text-gray-900 block mb-2">
                                Vendedor
                            </label>
                            <input
                                type="text"
                                name="vendedor"
                                id="vendedor"
                                value={name} // Mostrar nombre + apellido
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Nombre del vendedor"
                                disabled // Para que el campo sea solo lectura
                                required
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="cliente" className="text-sm font-medium text-gray-900 block mb-2">
                                Cliente
                            </label>
                            <select
                                name="cliente"
                                id="cliente"
                                value={nuevaSolicitud.cliente}
                                onChange={handleClienteChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                required
                            >
                                <option value="">Seleccione un cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente._id} value={cliente._id}>
                                        {cliente.nombre} {cliente.apellidos}
                                    </option>
                                ))}
                                <option value="nuevo">Nuevo Cliente</option>
                            </select>

                        </div>

                        {nuevoCliente && (
                            <>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="nombreCliente" className="text-sm font-medium text-gray-900 block mb-2">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="nombreCliente"
                                        value={datosNuevoCliente.nombre}
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
                                        value={datosNuevoCliente.apellidos}
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
                                        value={datosNuevoCliente.telefono}
                                        onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        required
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="emailCliente" className="text-sm font-medium text-gray-900 block mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="emailCliente"
                                        value={datosNuevoCliente.email}
                                        onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        required
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="tipoCliente" className="text-sm font-medium text-gray-900 block mb-2">
                                        Tipo de Cliente
                                    </label>
                                    <select
                                        name="tipo"
                                        id="tipoCliente"
                                        value={datosNuevoCliente.tipo}
                                        onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                    >
                                        <option value="Persona Natural">Persona Natural</option>
                                        <option value="Empresa">Empresa</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="ruc" className="block mb-2 text-sm font-medium text-gray-900">
                                        RUC
                                    </label>
                                    <input
                                        type="text"
                                        id="ruc"
                                        value={datosNuevoCliente.ruc}
                                        onChange={(e) => setDatosNuevoCliente({ ...datosNuevoCliente, ruc: e.target.value })}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleNuevoClienteSubmit}
                                    className="mt-4 bg-green-800 text-white font-bold py-2 px-4 rounded hover:bg-green-900"
                                >
                                    Registrar Nuevo Cliente
                                </button>

                            </>
                        )}

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="caracteristicas_obra" className="text-sm font-medium text-gray-900 block mb-2">
                                Características de la obra
                            </label>
                            <textarea
                                name="caracteristicas_obra"
                                id="caracteristicas_obra"
                                value={nuevaSolicitud.caracteristicas_obra}
                                onChange={handleInputChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                required
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="descripcion_servicio" className="text-sm font-medium text-gray-900 block mb-2">
                                Descripción del servicio
                            </label>
                            <textarea
                                name="descripcion_servicio"
                                id="descripcion_servicio"
                                value={nuevaSolicitud.descripcion_servicio}
                                onChange={handleInputChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                required
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="observaciones" className="text-sm font-medium text-gray-900 block mb-2">
                                Observaciones
                            </label>
                            <textarea
                                name="observaciones"
                                id="observaciones"
                                value={nuevaSolicitud.observaciones}
                                onChange={handleInputChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="presupuesto" className="text-sm font-medium text-gray-900 block mb-2">
                                Presupuesto
                            </label>
                            <input
                                type="number"
                                name="presupuesto"
                                id="presupuesto"
                                value={nuevaSolicitud.presupuesto}
                                onChange={handleInputChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-green-800 text-white font-bold py-2 px-4 rounded hover:bg-green-900"
                    >
                        Registrar Solicitud
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SolicitudForm;
