import React, { useState, useEffect } from 'react';
import { obtenerPagosRequest, registrarPagoRequest, eliminarPagoRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const VerDetallesPagosCuenta = () => {
  const [pagos, setPagos] = useState([]);
  const [monto, setMonto] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [fecha, setFecha] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [alerta, setAlerta] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    try {
      const response = await obtenerPagosRequest();
      setPagos(response.data.data);
      setAlerta('');
    } catch (error) {
      console.error('Error fetching payments:', error);
      setAlerta('Error al cargar los pagos.');
    }
  };

  const handleRegistrarPago = async () => {
    if (!monto || !porcentaje || !fecha) {
      setAlerta('Por favor, complete todos los campos.');
      return;
    }
    try {
      const nuevoPago = {
        monto: parseFloat(monto),
        porcentaje: parseFloat(porcentaje),
        fecha,
        observaciones,
      };
      await registrarPagoRequest(nuevoPago);
      fetchPagos();
      setMonto('');
      setPorcentaje('');
      setFecha('');
      setObservaciones('');
      setAlerta('');
    } catch (error) {
      console.error('Error registering payment:', error);
      setAlerta('Error al registrar el pago.');
    }
  };

  const handleEliminarPago = (pagoId) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este pago?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await eliminarPagoRequest(pagoId);
              fetchPagos();
            } catch (error) {
              console.error('Error deleting payment:', error);
              setAlerta('Error al eliminar el pago.');
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
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
            <h1 className="text-3xl font-bold">VER DETALLES - Pagos a Cuenta</h1>
            <button 
              onClick={() => window.history.back()} 
              className="text-blue-500 hover:text-blue-700 font-medium text-lg"
            >
              Regresar &gt;
            </button>
          </div>

          {alerta && <div className="mb-4 text-red-600 font-semibold">{alerta}</div>}

          <div className="flex space-x-4 mb-6">
            <input
              type="number"
              placeholder="Monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
            <input
              type="number"
              placeholder="Porcentaje"
              value={porcentaje}
              onChange={(e) => setPorcentaje(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
            <button
              onClick={handleRegistrarPago}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
            >
              Ingresar
            </button>
          </div>
          <textarea
            placeholder="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="border p-2 rounded-md w-full mb-6"
          />

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Monto</th>
                  <th scope="col" className="px-6 py-3">Porcentaje</th>
                  <th scope="col" className="px-6 py-3">Fecha</th>
                  <th scope="col" className="px-6 py-3">Observaciones</th>
                  <th scope="col" className="px-6 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pagos.length > 0 ? (
                  pagos.map((pago) => (
                    <tr
                      key={pago._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4">S/.{pago.monto}</td>
                      <td className="px-6 py-4">{pago.porcentaje}%</td>
                      <td className="px-6 py-4">{new Date(pago.fecha).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{pago.observaciones || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEliminarPago(pago._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      No hay pagos registrados.
                    </td>
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

export default VerDetallesPagosCuenta;
