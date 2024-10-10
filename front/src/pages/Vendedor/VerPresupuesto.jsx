import React, { useEffect, useState } from 'react';
import { obtenerPresupuestoRequest, editarPresupuestoRequest} from '../../api/auth'; // Asegúrate de que esta función esté disponible en tu API
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { confirmAlert } from 'react-confirm-alert';

const VerPresupuesto = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { name } = useAuth();
    const [presupuesto, setPresupuesto] = useState(null);

    useEffect(() => {
        const fetchPresupuesto = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };
                const response = await obtenerPresupuestoRequest(id, headers);
                setPresupuesto(response.data.data); 
            } catch (error) {
                console.error('Error al obtener el presupuesto:', error);
            }
        };

        fetchPresupuesto();
    }, [id]);

    const actualizarEstado = async (nuevoEstado) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await editarPresupuestoRequest(id, { estado_2: nuevoEstado }, headers);
            if (response.data && response.data.data) {
                setPresupuesto(prev => ({
                    ...prev,
                    estado_2: response.data.data.estado_2 || nuevoEstado
                }))
            } else {
                console.error('No se recibió una respuesta válida de la API:', response);
            }
        } catch (error) {
            console.error('Error al actualizar el estado del presupuesto:', error);
        }
    };

    const manejarAprobacion = () => {
        actualizarEstado('Aprobado');
        alert("Presupuesto aprobado con éxito")
        navigate('/gestionar_presupuestos');
    };

    const manejarRechazo = () => {
        actualizarEstado('Rechazado');
        alert("Presupuesto rechazado")
        navigate('/gestionar_presupuestos');

    };

    if (!presupuesto) {
        return <div>Cargando presupuesto...</div>;
    }

    return (
        <div className="bg-white border-4 rounded-lg shadow relative m-10">
            <div className="flex items-start justify-between p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold">Detalles del Presupuesto</h3>
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
                            ID de Presupuesto
                        </label>
                        <input
                            type="text"
                            value={presupuesto.ID_Presupuesto}
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
                            value={presupuesto.ID_Solicitud_Presupuesto}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            IGV
                        </label>
                        <input
                            type="number"
                            value={presupuesto.IGV}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Materiales
                        </label>
                        <input
                            type="text"
                            value={presupuesto.Materiales}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Transporte Personal
                        </label>
                        <input
                            type="text"
                            value={presupuesto.Transporte_Personal}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Costo Materiales
                        </label>
                        <input
                            type="number"
                            value={presupuesto.Costo_Materiales}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Costo Transporte
                        </label>
                        <input
                            type="number"
                            value={presupuesto.Costo_Transporte}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Sub Neto
                        </label>
                        <input
                            type="number"
                            value={presupuesto.Sub_Neto}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Pago Total
                        </label>
                        <input
                            type="number"
                            value={presupuesto.Pago_Total}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-sm font-medium text-gray-900 block mb-2">
                            Estado de Presupuesto
                        </label>
                        <input
                            type="text"
                            value={presupuesto.estado_2 || ''}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            disabled // Solo lectura
                        />
                    </div>

                    {presupuesto.estado_2 === 'Pendiente' && (
                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={manejarAprobacion}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Aprobado
                            </button>
                            <button
                                onClick={manejarRechazo}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Rechazado
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerPresupuesto;
