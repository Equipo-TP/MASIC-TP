import React, { useEffect, useState } from 'react';
import { obtenerPresupuestoIDRequest, editarPresupuestoRequest, obtener_solicitud_por_idRequest, obtener_cliente_por_idRequest} from '../../api/auth'; // Asegúrate de que esta función esté disponible en tu API
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { confirmAlert } from 'react-confirm-alert';
import { useForm } from 'react-hook-form';
const EditarPresupuesto = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { name } = useAuth();
    const [presupuesto, setPresupuesto] = useState(null);
    const [solicitud, setSolicitud] = useState(null);
    const [nombreCliente, setNombreCliente] = useState('');

    const { register, formState: { errors } } = useForm({
        defaultValues: presupuesto,
      });
      
    useEffect(() => {
        const fetchPresupuesto = async () => {
            try {
                //llama token por seguridad
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }; 
                //llama obtener presupuesto por ID
                const response = await obtenerPresupuestoIDRequest(id, headers);
                setPresupuesto(response.data.data);

                //llama obtener solicitud por ID
                const solicitudResponse = await obtener_solicitud_por_idRequest(response.data.data.ID_Solicitud_Presupuesto._id);
                setSolicitud(solicitudResponse.data.data);
          
                //llama obtener cliente por ID
                const clienteResponse = await obtener_cliente_por_idRequest(solicitudResponse.data.data.cliente._id); 
                setNombreCliente(clienteResponse.data.data);
                

            } catch (error) {
                console.error('Error al obtener el presupuesto:', error);
            }
        };
        fetchPresupuesto();
    }, [id]);
    const actualizarPresupuesto = async (nuevoEstado) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await editarPresupuestoRequest(id, { estado_2: nuevoEstado }, headers);
            console.log(response);
            if (response.data && response.data.data) {
                setPresupuesto(prev => ({
                    ...prev,
                    estado_2: response.data.data.estado_2 || nuevoEstado
                }));
            } else {
                console.error('No se recibió una respuesta válida de la API:', response);
            }
        } catch (error) {
            console.error('Error al actualizar el estado del presupuesto:', error);
        }
    };
    
    //metodo para actualizar el estado del presupuesto
    const actualizarEstado = async (nuevoEstado) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await editarPresupuestoRequest(id, { estado_2: nuevoEstado }, headers);
            console.log(response)
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            await editarPresupuestoRequest(id, solicitud, headers); // Asegúrate de que esta función esté implementada
            navigate('/gestionar_presupuestos'); // Redirige a la ruta deseada después de editar
        } catch (error) {
            console.error('Error al editar la solicitud:', error);
            // Manejo de errores si es necesario
        }
    };
    return (
        <form onSubmit={handleSubmit} className='h-5/6'> 
            <div className="bg-white border-4 rounded-lg shadow relative m-10 mb-10 h-[calc(100vh-120px)] overflow-y-auto ">
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
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del vendedor</label>
                        <input
                            type="text"
                                name="nombre"
                                defaultValue={name}
                                {...register('name')}
                                error={!!errors.name}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            </div>
                        <div className="col-span-6 sm:col-span-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del cliente</label>
                        <input
                            type="text"
                                name="nombre"
                                defaultValue={nombreCliente.nombre}
                                {...register('nombre')}
                                error={!!errors.nombre}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Apellido del cliente</label>
                        <input
                            type="text"
                                name="apellidos"
                                defaultValue={nombreCliente.apellidos}
                                {...register('apellidos')}
                                error={!!errors.apellidos}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            </div>

                        <div className="col-span-6 sm:col-span-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">ID_Presupuesto</label>
              <input
                type="text"
                name="ID_Presupuesto"
                defaultValue={presupuesto.ID_Presupuesto}
                {...register('ID_Presupuesto')}
                error={!!errors.ID_Presupuesto}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">ID_Solicitud</label>
              <input
                type="text"
                name="ID_Solicitud"
                defaultValue={presupuesto.ID_Solicitud_Presupuesto}
                {...register('ID_Solicitud_Presupuesto')}
                error={!!errors.ID_Solicitud_Presupuesto}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
                        

                        <div className="col-span-6 sm:col-span-3">
                            <label className="text-sm font-medium text-gray-900 block mb-2">
                                Fecha
                            </label>
                            <input
                                type="text"
                                value={new Date(presupuesto.createdAt).toLocaleDateString()}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                disabled
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">Transporte Personal</label>
              <input
                type="text"
                name="Transporte_Personal"
                defaultValue={presupuesto.Transporte_Personal}
                {...register('Transporte_Personal')}
                error={!!errors.Transporte_Personal}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>


                        <div className="col-span-6 sm:col-span-6">
                            <h3 className="text-xl font-semibold mt-6">Instalaciones</h3>
                            {presupuesto.instalaciones && presupuesto.instalaciones.length > 0 ? (
                                <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-300 px-4 py-2">Tipo Luminaria</th>
                                            <th className="border border-gray-300 px-4 py-2">Cantidad</th>
                                            <th className="border border-gray-300 px-4 py-2">Costo Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {presupuesto.instalaciones.map((instalacion, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-4 py-2">{instalacion.tipo_luminaria.tipo_luminaria}</td>
                                                <td className="border border-gray-300 px-4 py-2">{instalacion.cantidad} UND</td>
                                                <td className="border border-gray-300 px-4 py-2">$ {instalacion.costo_total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div>No hay instalaciones disponibles.</div>
                            )}
                        </div>

                       
                        <div className="col-span-6 sm:col-span-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">Materiales</label>
              <input
                type="text"
                name="Materiales"
                defaultValue={presupuesto.Materiales}
                {...register('Materiales')}
                error={!!errors.Materiales}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">Costo Materiales</label>
              <input
                type="text"
                name="Costo_Materiales"
                defaultValue={presupuesto.Costo_Materiales}
                {...register('Costo_Materiales')}
                error={!!errors.Costo_Materiales}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">Transporte de  Personal a {presupuesto.Transporte_Personal}</label>
              <input
                type="text"
                name="Costo_Transporte"
                defaultValue={presupuesto.Costo_Transporte}
                {...register('Costo_Transporte')}
                error={!!errors.Costo_Transporte}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            

                        <div className="col-span-6 sm:col-span-3">
                            <label className="text-sm font-medium text-gray-900 block mb-2">
                                Sub Neto 
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900">$</span>
                                <input
                                    type="number"
                                    value={presupuesto.Sub_Neto}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-6" // Añade padding izquierdo para el símbolo
                                    disabled 
                                />
                            </div>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label className="text-sm font-medium text-gray-900 block mb-2">
                                IGV (18%) 
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900">$</span>
                                <input
                                    type="number"
                                    value={presupuesto.IGV}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-6"
                                    disabled 
                                />
                            </div>
                            
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label className="text-sm font-medium text-gray-900 block mb-2">
                                Pago Total
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900">$</span>
                                <input
                                    type="number"
                                    value={presupuesto.Pago_Total}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-6"
                                    disabled 
                                />
                            </div>
                        </div>
                        
                        <div className="col-span-6 sm:col-span-3">
                            <label className="text-sm font-medium text-gray-900 block mb-2">
                                Estado de Presupuesto
                            </label>
                            <input
                                type="text"
                                value={presupuesto.estado_2 || ''}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                disabled
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
            <div className="flex justify-end">
                <button type="submit" className="bg-green-800 text-white font-semibold py-2 px-4 rounded-lg">
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
};

export default EditarPresupuesto;
