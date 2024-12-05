import React, { useState, useEffect } from 'react';
import { inventarioAlmacenRequest, registrarMovimientoRequest, eliminarInventarioRequest } from '../../api/auth';
import { useParams, useNavigate } from 'react-router-dom';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const InventarioMaterial = () => {
    const { id } = useParams();
    const [movimientos, setMovimientos] = useState([]);
    const [cantidad, setCantidad] = useState('');
    const [fechaMov, setFechaMov] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [alerta, setAlerta] = useState('');
    const [tipoIngreso, setTipoIngreso] = useState('');
    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [optionsVisible, setOptionsVisible] = useState(false); // Estado para mostrar las opciones del menú

    const navigate = useNavigate();

    // Fetch de movimientos al cargar el componente
    useEffect(() => {
        fetchMovimientos();
        fetchProyectos();
    }, []);

    const fetchMovimientos = async () => {
        try {
            const response = await inventarioAlmacenRequest(id);
            if (response.data.data.length === 0) {
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

    // Fetch de proyectos
    const fetchProyectos = async () => {
        try {
            const response = await fetch('/api/proyectos'); // Reemplazar por el endpoint real
            const data = await response.json();
            setProyectos(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleAgregarMovimiento = async () => {
        if (cantidad === '' || fechaMov === '' || (tipoIngreso === 'Compra' && descripcion === '') || (tipoIngreso === 'Sobrantes' && proyectoSeleccionado === '')) {
            setAlerta('Por favor, complete todos los campos.');
            return;
        }
        if (cantidad <= 0) {
            setAlerta('La cantidad ingresada debe ser un número positivo')
            return;
        }

        const newMovimiento = {
            cantidad: parseInt(cantidad),
            fecha_mov: new Date(new Date(fechaMov).getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
            id_material: id,
            tipo_ingreso: tipoIngreso,
            descripcion: tipoIngreso === 'Compra' ? descripcion : '', // Solo agregar descripción si es compras
            proyecto_id: tipoIngreso === 'Sobrantes' ? proyectoSeleccionado : '' // Si es sobrante, incluir el proyecto
        };

        try {
            await registrarMovimientoRequest(newMovimiento);
            fetchMovimientos();
            setCantidad('');
            setFechaMov('');
            setDescripcion('');
            setProyectoSeleccionado('');
            setTipoIngreso('');
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
                            await eliminarInventarioRequest(movimientoId);
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

    const handleToggleOptions = () => {
        setOptionsVisible(!optionsVisible);
    };

    return (
        <div className="flex">
            <MenuSideBar open={drawerOpen} />
            <div className="flex-1">
                <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Inventario de Material</h1>
                        <button 
                            onClick={() => navigate('/gestionar_almacen')}
                            className="text-blue-500 hover:text-blue-700 font-medium text-lg"
                        >
                            Regresar &gt;
                        </button>
                    </div>

                    <p className="text-gray-600">Este módulo lista todos los ingresos de stock de materiales.</p>
                    
                    {alerta && <div className="mb-4 text-red-600 font-semibold">{alerta}</div>}
                    
                    <div className="flex space-x-4 mb-6">
                        <select 
                            value={tipoIngreso} 
                            onChange={(e) => setTipoIngreso(e.target.value)} 
                            className="border p-2 rounded-md w-full"
                        >
                            <option value="">Seleccione tipo de ingreso</option>
                            <option value="Compra">Compras</option>
                            <option value="Sobrantes">Sobrantes</option>
                        </select>

                        {tipoIngreso === 'Compra' && (
                            <input 
                                type="text" 
                                placeholder="Descripción del ingreso" 
                                value={descripcion} 
                                onChange={(e) => setDescripcion(e.target.value)} 
                                className="border p-2 rounded-md w-full"
                            />
                        )}

                        {tipoIngreso === 'Sobrantes' && (
                            <select 
                                value={proyectoSeleccionado} 
                                onChange={(e) => setProyectoSeleccionado(e.target.value)} 
                                className="border p-2 rounded-md w-full"
                            >
                                <option value="">Selecciona un proyecto</option>
                                {proyectos.map((proyecto) => (
                                    <option key={proyecto.id} value={proyecto.id}>
                                        {proyecto.nombre}
                                    </option>
                                ))}
                            </select>
                        )}

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
                                    <th scope="col" className="px-6 py-3">Cantidad</th>
                                    <th scope="col" className="px-6 py-3">Fecha de Movimiento</th>
                                    <th scope="col" className="px-6 py-3">Descripción</th>  
                                    <th scope="col" className="px-6 py-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movimientos.length > 0 ? (
                                    movimientos.map((movimiento) => (
                                        <tr key={movimiento._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                <span style={{ color: movimiento.tipo_ingreso === 'entrada' ? 'green' : 'red' }}>
                                                    {movimiento.cantidad}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">{new Date(movimiento.fecha_mov).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">{movimiento?.tipo_ingreso+': ' + movimiento.descripcion || movimiento.proyecto_id}</td>
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

                    <div className="mt-4">
                        <button onClick={handleToggleOptions} className="bg-gray-200 p-2 rounded-md">
                            Opciones
                        </button>
                        {optionsVisible && (
                            <div className="absolute bg-white shadow-md rounded-md mt-2">
                                <button onClick={() => navigate('/inventario')}>Inventario</button>
                                <button onClick={() => navigate('/movimientos')}>Movimientos</button>
                                <button onClick={() => handleEliminar()}>Eliminar</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventarioMaterial;