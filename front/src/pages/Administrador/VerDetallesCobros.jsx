import React, { useState, useEffect } from 'react';
import { ver_proyecto_por_idRequest, actualizarProyectoCobrosRequest, eliminarPagoProyectoRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { useParams, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const VerDetallesPagosCuenta = () => {
  const { id } = useParams(); // ID del proyecto recibido como parámetro
  const navigate = useNavigate();

  const [proyecto, setProyecto] = useState(null); // Información del proyecto
  const [monto, setMonto] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [alerta, setAlerta] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchProyecto();
  }, []);

  const fetchProyecto = async () => {
    try {
      const response = await ver_proyecto_por_idRequest(id);
      setProyecto(response.data.data); // Guardamos los datos del proyecto
      setAlerta('');
    } catch (error) {
      console.error('Error fetching project details:', error);
      setAlerta('Error al cargar los detalles del proyecto.');
    }
  };

  const handleRegistrarPago = async () => {
    if (!monto) {
      setAlerta('Por favor, complete todos los campos.');
      return;
    }
    try {
      const nuevoPago = {
        monto: parseFloat(monto),
        porcentaje: parseFloat(((monto / proyecto.Costo_Total) * 100).toFixed(2)), // Porcentaje redondeado a 2 decimales
        observaciones,
      };

      const response = await actualizarProyectoCobrosRequest(id, nuevoPago);
      setProyecto(response.data.data); // Actualizamos los datos del proyecto tras registrar el pago
      setMonto('');
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
              await eliminarPagoProyectoRequest(id, pagoId); // Elimina el pago específico
              fetchProyecto(); // Refresca los datos del proyecto
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

  if (!proyecto) {
    return (
      <div className="flex">
        <MenuSideBar open={drawerOpen} />
        <div className="flex-1">
          <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
          <div className="p-6">
            <p>Cargando detalles del proyecto...</p>
          </div>
        </div>
      </div>
    );
  }

  const { pagos, estadodeCobro, Nombre_Proyecto } = proyecto;

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6 relative">
          <button
          onClick={() => navigate(-1)}
          className="absolute top-0 right-0 text-blue-500 hover:text-blue-700 font-medium text-lg"
          >
            Regresar &gt;
            </button>
            <h1 className="text-3xl font-bold text-left my-6">Detalles - Pagos del Proyecto: {proyecto?.Nombre_Proyecto}</h1>
            
          {alerta && <div className="mb-4 text-red-600 font-semibold">{alerta}</div>}

          {/* Formulario para registrar pagos solo si no está completamente cobrado */}
          {estadodeCobro !== 'Cobrado Completamente' && (
            <div>
              <div className="flex space-x-4 mb-6">
                <input
                  type="number"
                  placeholder="Monto"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="border p-2 rounded-md w-full"
                />
                <button
                  onClick={handleRegistrarPago}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
                >
                  Registrar Pago
                </button>
              </div>
              <textarea
                placeholder="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="border p-2 rounded-md w-full mb-6"
              />
            </div>
          )}

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">S/.{pago.monto}</td>
                      <td className="px-6 py-4">{parseFloat(pago.porcentaje).toFixed(2)}%</td>
                      <td className="px-6 py-4">{new Date(pago.fecha).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{pago.observaciones || 'N/A'}</td>
                      <td className="px-6 py-4">
                        {estadodeCobro !== 'Cobrado Completamente' && (
                          <button
                            onClick={() => handleEliminarPago(pago._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        )}
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
