import React, { useEffect, useState } from 'react';
import { listarPresupuestosRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link } from 'react-router-dom';

const GestionarPresupuestosA = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAlmacenes, setFilteredAlmacenes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const response = await listarPresupuestosRequest(headers);
        setPresupuestos(response.data.data);
        setFilteredAlmacenes(response.data.data);
      } catch (error) {
        console.error('Error al listar los presupuestos:', error.response ? error.response.data : error.message);
      }
    };

    fetchPresupuestos();
  }, []);

  const indexOfLastPresupuesto = currentPage * itemsPerPage;
  const indexOfFirstPresupuesto = indexOfLastPresupuesto - itemsPerPage;
  const currentPresupuestos = filteredAlmacenes.slice(indexOfFirstPresupuesto, indexOfLastPresupuesto);
  const totalPages = Math.ceil(filteredAlmacenes.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleFilter = () => {
    setFilteredAlmacenes(
      presupuestos.filter((presupuesto) =>
        presupuesto.ID_Solicitud_Presupuesto.vendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1);
  };

  console.log(filteredAlmacenes);
  const handleReset = () => {
    setSearchTerm('');
    setFilteredAlmacenes(presupuestos);
    setCurrentPage(1);
  };

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1 overflow-y-auto h-[calc(100vh-1rem)]">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6 mx-20 mt-20">
                <h1 className="text-3xl font-bold mb-6">Gestor de Presupuestos</h1>
                <p className="mb-5 text-zinc-600">Listado de presupuestos registrados</p>
                {/* Fila para el filtro, input y botones */}
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Nombre del vendedor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-md shadow-sm flex-1"
              />
              <button
                onClick={handleFilter}
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Filtrar
              </button>
              <button
                onClick={handleReset}
                className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Resetear
              </button>
                <Link to="/registro_presupuestos">
                  <button className="text-white bg-green-700 hover:bg-green-900 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2">
                    Crear Presupuesto
                  </button>
                </Link>
              </div>

              {/* Tabla para PC */}
              <table className="hidden md:block overflow-hidden rounded-lg shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Nombre del cliente</th>
                    <th className="px-6 py-3">Nombre del vendedor</th>
                    <th className="px-6 py-3">Costo Materiales</th>
                    <th className="px-6 py-3">Pago Total</th>
                    <th className="px-6 py-3">Aprobado</th>
                    <th className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  { currentPresupuestos.length > 0 ? (
                  currentPresupuestos.map((presupuesto) => (
                    <tr key={presupuesto._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4  dark:text-white">{presupuesto.ID_Solicitud_Presupuesto?.id}</td>
                      <td className="px-6 py-4  dark:text-white">{presupuesto.ID_Solicitud_Presupuesto?.cliente.nombre} {presupuesto.ID_Solicitud_Presupuesto?.cliente.apellidos}</td>
                      <td className="px-6 py-4  dark:text-white">{presupuesto.ID_Solicitud_Presupuesto.vendedor.nombre} {presupuesto.ID_Solicitud_Presupuesto.vendedor.apellidos}</td>
                      <td className="px-6 py-4  dark:text-white">{presupuesto?.Costo_Materiales}</td>
                      <td className="px-6 py-4  dark:text-white">{presupuesto?.Pago_Total.toFixed(2)}</td>
                      <td className="px-6 py-4  dark:text-white">{presupuesto?.estado_2}</td>
                      <td className="px-6 py-4  dark:text-white">
                        <Link to={`/visualizar_presupuesto/${presupuesto._id}`} className="font-medium bg-blue-500 text-white px-4 py-2 rounded mr-3 hover:bg-blue-600">Ver</Link>
                        <Link to={`/editar_presupuesto/${presupuesto._id}`} className="font-medium bg-amber-300 text-white px-4 py-2 rounded hover:bg-amber-400">Editar</Link>
                      </td>
                    </tr>
                  ))) : (
                    <tr>
                      <td colSpan="5" className="py-3 px-6 text-center">No se encontraron presupuestos.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Vista para móviles */}
              <div className="space-y-6 md:hidden">
                { currentPresupuestos.length > 0 ? (
                currentPresupuestos.map((presupuesto) => (
                  <div key={presupuesto._id} className="bg-white p-4 space-y-3 rounded-lg shadow">
                    <div className="text-sm font-bold">{`ID Solicitud: ${presupuesto.ID_Solicitud_Presupuesto?.id}`}</div>
                    <div className="text-sm text-gray-700">{`Vendedor: ${presupuesto.ID_Solicitud_Presupuesto.vendedor.nombre} ${presupuesto.ID_Solicitud_Presupuesto.vendedor.apellidos}`}</div>
                    <div className="text-sm text-gray-700">{`Cliente: ${presupuesto.ID_Solicitud_Presupuesto?.cliente.nombre} ${presupuesto.ID_Solicitud_Presupuesto?.cliente.apellidos}`}</div>
                    <div className="text-sm text-gray-700">{`Costo Materiales: ${presupuesto?.Costo_Materiales}`}</div>
                    <div className="flex pt-2 items-center justify-center">
                      <Link to={`/visualizar_presupuesto/${presupuesto._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">Ver</Link>
                      <Link to={`/editar_presupuesto/${presupuesto._id}`} className="font-medium text-green-600 dark:text-green-500 hover:underline">Editar</Link>
                    </div>
                  </div>
                ))) : (
                  <div className="text-center py-3">No se encontraron presupuestos.</div>
                )}
              </div>


              {/* Paginación */}
              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-l-lg bg-gray-200 hover:bg-gray-300">
                  Anterior
                </button>
                <span className="px-4 py-2">{`Página ${currentPage} de ${totalPages}`}</span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-r-lg bg-gray-200 hover:bg-gray-300">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
          </div>
  );
};

export default GestionarPresupuestosA;
