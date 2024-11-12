import React, { useEffect, useState } from 'react';
import { obtenerSolicitudPorIdRequest } from '../../api/auth'; // Asegúrate de que esta función esté disponible en tu API
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { editarSolicitudRequest } from '../../api/auth'; // Función para editar la solicitud

const EditarSolicitud = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID de la solicitud desde los parámetros de la URL
    const { name } = useAuth();
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const estados_1 = ['Enviado', 'Cancelado'];



    // Cargar los datos de la solicitud cuando el componente se monta
    useEffect(() => {
        const fetchSolicitud = async () => {
            try {
                const response = await obtenerSolicitudPorIdRequest(id); // Asegúrate de que esta función retorne la solicitud
                setSolicitud(response.data.data); // Suponiendo que la respuesta contiene la solicitud en data
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener la solicitud:', error);
                // Manejo de errores si es necesario
                setLoading(false);
            }
        };

        fetchSolicitud();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSolicitud((prev) => ({ ...prev, [name]: value })); // Actualizar el estado con el nuevo valor
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editarSolicitudRequest(id, solicitud); // Asegúrate de que esta función esté implementada
            navigate('/gestionar_solicitudes'); // Redirige a la ruta deseada después de editar
        } catch (error) {
            console.error('Error al editar la solicitud:', error);
            // Manejo de errores si es necesario
        }
    };

    if (loading) {
        return <div>Cargando solicitud...</div>; // Indicador de carga
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border-4 rounded-lg shadow relative m-10 p-6 space-y-6">

            {/* Titulo y boton */}
            <div className="flex items-start justify-between border-b rounded-t">
                <h3 className="text-xl font-semibold">Editar Solicitud</h3>
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
            
            {/* Parámetros de la Solicitud */}
            <div className="p-6 space-y-6 max-h-[72vh] overflow-y-scroll">
                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Vendedor
                        </label>
                        <input
                            type="text"
                            value={name}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            ID de Solicitud
                        </label>
                        <input
                            type="text"
                            value={solicitud.id}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Cliente
                        </label>
                        <input
                            type="text"
                            value={solicitud.cliente.nombre + (solicitud.cliente.apellidos ? " " + solicitud.cliente.apellidos : "")}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Dirección
                        </label>
                        <input
                            name="direccion"
                            value={solicitud.direccion}
                            onChange={handleChange} // Llama a handleChange
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Distrito
                        </label>
                        <input
                            name="distrito"
                            value={solicitud.distrito}
                            onChange={handleChange} // Llama a handleChange
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Características de la obra
                        </label>
                        <textarea
                            name="caracteristicas_obra"
                            value={solicitud.caracteristicas_obra}
                            onChange={handleChange} // Llama a handleChange
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Descripción del servicio
                        </label>
                        <textarea
                            name="descripcion_servicio"
                            value={solicitud.descripcion_servicio}
                            onChange={handleChange} // Llama a handleChange
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Observaciones
                        </label>
                        <textarea
                            name="observaciones"
                            value={solicitud.observaciones}
                            onChange={handleChange} // Llama a handleChange
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Estado
                        </label>
                        <select
                            value={solicitud.estado_1}
                            onChange={(e) => setSolicitud({ ...solicitud, estado_1: e.target.value })}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                        >
                            {estados_1.map((estado, index) => (
                                <option key={index} value={estado}>
                                    {estado}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Estado #2
                        </label>
                        <input
                            type="text"
                            value={solicitud.estado_2}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                </div>
            </div>
            
            {/* Boton de enviado */}
            <div className="flex justify-end">
                <button type="submit" className="bg-green-800 text-white font-semibold py-2 px-4 rounded-lg">
                    Guardar Cambios
                </button>
            </div>

        </form>
    );
};

export default EditarSolicitud;
