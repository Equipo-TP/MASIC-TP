import React, { useState, useEffect } from 'react';
import { listarMovimientosRequest } from '../../api/auth';  // Asegúrate de tener el endpoint para obtener los movimientos
import { useNavigate } from 'react-router-dom';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

const Movimientos = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [alerta, setAlerta] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchMovimientos();
    }, []);

    const fetchMovimientos = async () => {
        try {
            const response = await obtenerMovimientosRequest();  // Llamada al API para obtener los movimientos
            if (response.data.length === 0) {
                setAlerta('No hay movimientos registrados.');
            } else {
                setMovimientos(response.data);
                setAlerta('');
            }
        } catch (error) {
            console.error('Error fetching movements:', error);
            setAlerta('Error al cargar los movimientos.');
        }
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div className="flex">
            <MenuSideBar open={drawerOpen} />
            <div className="flex-1">
                <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Movimientos de Inventario</h1>
                        <button 
                            onClick={() => navigate('/gestionar_almacen')}
                            className="text-blue-500 hover:text-blue-700 font-medium text-lg"
                        >
                            Regresar &gt;
                        </button>
                    </div>

                    <p className="text-gray-600">Este módulo lista todos los movimientos de inventario, tanto entradas como salidas.</p>
                    
                    {alerta && <div className="mb-4 text-red-600 font-semibold">{alerta}</div>}

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Tipo de Movimiento</th>
                                    <th scope="col" className="px-6 py-3">Descripción</th>
                                    <th scope="col" className="px-6 py-3">Fecha</th>
                                    <th scope="col" className="px-6 py-3">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movimientos.length > 0 ? (
                                    movimientos.map((movimiento) => (
                                        <tr key={movimiento._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                {movimiento.tipo_movimiento === 'entrada' ? 'Entrada' : 'Salida'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">{movimiento.descripcion || 'No disponible'}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">{new Date(movimiento.fecha_mov).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                <span style={{ color: movimiento.tipo_movimiento === 'entrada' ? 'green' : 'red' }}>
                                                    {movimiento.cantidad}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center">No hay movimientos registrados.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Movimientos;