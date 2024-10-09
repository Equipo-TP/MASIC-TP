import React, { useEffect, useState } from 'react';
import { listarPresupuestosRequest } from '../../api/auth'; // Asegúrate de que este request esté en auth.js
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link } from 'react-router-dom';

const GestionarPresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const itemsPerPage = 5; // Número máximo de presupuestos por página

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const response = await listarPresupuestosRequest(headers);
        setPresupuestos(response.data.data);
      } catch (error) {
        console.error('Error al listar los presupuestos:', error.response ? error.response.data : error.message);
      }
    };

    fetchPresupuestos();
  }, []);

  // Calcular los presupuestos que se mostrarán en la página actual
  const indexOfLastPresupuesto = currentPage * itemsPerPage;
  const indexOfFirstPresupuesto = indexOfLastPresupuesto - itemsPerPage;
  const currentPresupuestos = presupuestos.slice(indexOfFirstPresupuesto, indexOfLastPresupuesto);
  const totalPages = Math.ceil(presupuestos.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
          <div className="relative overflow-x-auto sm:rounded-lg">
            <div className='select-none flex items-center justify-between mb-4'>
              <h1 className="text-3xl font-bold mb-2">Gestor de Presupuestos</h1>
              <div className="flex justify-end mb-4">
                <Link to="/registro_presupuestos">
                  <button className="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2">
                    Crear Presupuesto
                  </button>
                </Link>
              </div>  
            </div>
            <table className="shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Solicitud</th>
                  <th scope="col" className="px-6 py-3">IGV</th>
                  <th scope="col" className="px-6 py-3">Tiempo</th>
                  <th scope="col" className="px-6 py-3">Costo Materiales</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentPresupuestos.map((presupuesto) => (
                  <tr key={presupuesto._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.id}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.ID_Solicitud_Presupuesto}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.IGV}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.Tiempo}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.Costo_Materiales}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">  
                      <Link to={`/ver_presupuesto/${presupuesto._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">
                        Ver
                      </Link>
                      <Link to={`/editar_presupuesto/${presupuesto._id}`} className="font-medium text-green-600 dark:text-green-500 hover:underline mr-4">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
};

export default GestionarPresupuestos;
