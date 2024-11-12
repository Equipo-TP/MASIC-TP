import React, { useState, useEffect } from 'react';
import { inventarioAlmacenRequest, registrarMovimientoRequest } from '../../api/auth';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const InventarioMaterial = () => {
    const { id } = useParams();
    const [movimientos, setMovimientos] = useState([]);
    const [cantidad, setCantidad] = useState('');
    const [fechaMov, setFechaMov] = useState('');
    const [alerta, setAlerta] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Hook para navegar entre rutas
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovimientos();
    }, []);

    const fetchMovimientos = async () => {
        try {
            const response = await inventarioAlmacenRequest(id);
            if (response.data.data.length === 0) {
                console.log(response);
                setAlerta('No hay movimientos de inventario registrados.');
            } else {
                setMovimientos(response.data.data);
                setAlerta('');
            }
        } catch (error) {
            console.error('Error fetching movements:', error);
            setAlerta('Error al cargar los movimientos de inventario.');
        }
    };

    const handleAgregarMovimiento = async () => {
        if (cantidad === '' || fechaMov === '') {
            setAlerta('Por favor, complete todos los campos.');
            return;
        }
        try {
            const newMovimiento = {
                cantidad: parseInt(cantidad),
                fecha_mov: fechaMov,
                id_material: id
            };
            console.log(newMovimiento);
            await registrarMovimientoRequest(newMovimiento);
            console.log('HOLA');
            fetchMovimientos();
            setCantidad('');
            setFechaMov('');
            setAlerta('');
        } catch (error) {
            console.error('Error adding movement:', error);
            setAlerta('Error al registrar el movimiento de inventario.');
        }
    };

    const handleEliminarMovimiento = (movimientoId) => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de que deseas eliminar este movimiento de inventario?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:8000/api/eliminar_movimiento/${movimientoId}`);
                            fetchMovimientos();
                        } catch (error) {
                            console.error('Error deleting movement:', error);
                            setAlerta('Error al eliminar el movimiento de inventario.');
                        }
                    },
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
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
                        <h1 className="text-3xl font-bold">Inventario de Material</h1>
                        {/* Botón de regresar */}
                        <button 
                            onClick={() => navigate('/gestionar_almacen')}
                            className="text-blue-500 hover:text-blue-700 font-medium text-lg"
                        >
                            Regresar &gt;
                        </button>
                    </div>
                    
                    <p className="text-gray-600">Este módulo lista todos los productos de la tienda.</p>
                    
                    {alerta && <div className="mb-4 text-red-600 font-semibold">{alerta}</div>}
                    
                    <div className="flex space-x-4 mb-6">
                        <input 
                            type="number" 
                            placeholder="Cantidad" 
                            value={cantidad} 
                            onChange={(e) => setCantidad(e.target.value)} 
                            className="border p-2 rounded-md w-full"
                        />
                        <input 
                            type="date" 
                            value={fechaMov} 
                            onChange={(e) => setFechaMov(e.target.value)} 
                            className="border p-2 rounded-md w-full"
                        />
                        <button 
                            onClick={handleAgregarMovimiento} 
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
                        >
                            Ingresar
                        </button>
                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">ID</th>
                                    <th scope="col" className="px-6 py-3">Cantidad</th>
                                    <th scope="col" className="px-6 py-3">Fecha de Movimiento</th>
                                    <th scope="col" className="px-6 py-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movimientos.length > 0 ? (
                                    movimientos.map((movimiento) => (
                                        <tr key={movimiento._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">{movimiento._id}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">{movimiento.cantidad}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">{new Date(movimiento.fecha_mov).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                <button 
                                                    onClick={() => handleEliminarMovimiento(movimiento._id)} 
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center">No hay movimientos de inventario.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Cantidad</th>
                        <th>Fecha de Movimiento</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {movimientos.length > 0 ? (
                        movimientos.map((movimiento) => (
                            <tr key={movimiento._id}>
                                <td>{movimiento.cantidad}</td>
                                <td>{new Date(movimiento.fecha_mov).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEliminarMovimiento(movimiento._id)} style={{ color: 'red' }}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay movimientos de inventario.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventarioMaterial;
