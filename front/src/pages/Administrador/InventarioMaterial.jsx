import React, { useState, useEffect } from 'react';
import { inventarioAlmacenRequest } from '../../api/auth';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InventarioMaterial = () => {
    const { id } = useParams();
    const [movimientos, setMovimientos] = useState([]);
    const [cantidad, setCantidad] = useState('');
    const [fechaMov, setFechaMov] = useState('');
    const [alerta, setAlerta] = useState('');

    useEffect(() => {
        fetchMovimientos();
    }, []);

    const fetchMovimientos = async () => {
        try {
            const response = await inventarioAlmacenRequest(id);
            if (response.data.length === 0) {
                setAlerta('No hay movimientos de inventario registrados.');
            } else {
                setMovimientos(response.data);
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
            await axios.post('http://localhost:8000/api/registrar_movimiento', newMovimiento);
            fetchMovimientos();
            setCantidad('');
            setFechaMov('');
            setAlerta('');
        } catch (error) {
            console.error('Error adding movement:', error);
            setAlerta('Error al registrar el movimiento de inventario.');
        }
    };

    // Handle deleting an inventory movement
    const handleEliminarMovimiento = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/eliminar_movimiento/${id}`);
            fetchMovimientos(); // Refresh list after deletion
        } catch (error) {
            console.error('Error deleting movement:', error);
            setAlerta('Error al eliminar el movimiento de inventario.');
        }
    };

    return (
        <div>
            <h2>Inventario de Material</h2>
            <div className="alerta">{alerta && <p>{alerta}</p>}</div>
            <div className="input-group">
                <input 
                    type="number" 
                    placeholder="Cantidad" 
                    value={cantidad} 
                    onChange={(e) => setCantidad(e.target.value)} 
                />
                <input 
                    type="date" 
                    placeholder="Fecha de Movimiento" 
                    value={fechaMov} 
                    onChange={(e) => setFechaMov(e.target.value)} 
                />
                <button onClick={handleAgregarMovimiento}>Ingresar</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cantidad</th>
                        <th>Fecha de Movimiento</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {movimientos.length > 0 ? (
                        movimientos.map((movimiento) => (
                            <tr key={movimiento._id}>
                                <td>{movimiento._id}</td>
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
