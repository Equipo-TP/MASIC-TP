import React, { useEffect, useState } from 'react';
import { listarPresupuestosVendedoraRequest, obtenerSolicitudPorIdRequest, obtenerClientePorIdRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const GestionarPresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [Solicitud, setSolicitud] = useState([]);
  const [cliente, setCliente] = useState([]);
  const { name } = useAuth();
  const itemsPerPage = 5; // Número máximo de presupuestos por página

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const response = await listarPresupuestosVendedoraRequest(headers); //const response = await listarPresupuestosRequest(headers);
        setPresupuestos(response.data.data);
        console.log(presupuestos)
      } catch (error) {
        console.error('Error al listar los presupuestos:', error.response ? error.response.data : error.message);
      }
    };

    fetchPresupuestos();
  }, []);


  useEffect(() => {
    const fetchSolicitud = async () => {
        try {
          // Iterar sobre cada presupuesto y obtener su ID_Solicitud_Presupuesto
          presupuestos.forEach(async (presupuesto) => {
            const response = await obtenerSolicitudPorIdRequest(presupuesto.ID_Solicitud_Presupuesto);
            setSolicitud( response.data );
            console.log(response.data)
          });
        } catch (error) {
          console.error('Error al obtener la solicitud:', error);
        }
      };
    
      if (presupuestos.length > 0) {
        fetchSolicitud();
      }
    }, [presupuestos]);


useEffect(() => {
    const fetchCliente = async () => {
        try {
          // Iterar sobre cada presupuesto y obtener su ID_Solicitud_Presupuesto
          Solicitud.forEach(async (solicitud) => {
            const response = await obtenerClientePorIdRequest(solicitud.cliente);
            setCliente((prevClientes) => ({
              ...prevClientes,
              [solicitud.cliente]: response.data.data, 
            }));
            console.log(response.data.data)
            
          });
          console.log("Hola")
        } catch (error) {
          console.error('Error al obtener al cliente:', error);
        }
      };
    
      if (Solicitud.length > 0) {
        fetchCliente();
      }
    }, [Solicitud]);


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
              <h1 className="text-3xl font-bold mb-2">Gestor de Presupuestos de {name}</h1> 
            </div>
            <table className="shadow-md w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Cliente</th>
                  <th scope="col" className="px-6 py-3">Transporte Personal</th>
                  <th scope="col" className="px-6 py-3">Pago Total</th>
                  <th scope="col" className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {currentPresupuestos.map((presupuesto, solicitud) => (
                  <tr key={presupuesto._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.ID_Presupuesto}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{solicitud.cliente.nombre}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white"> {presupuesto.Transporte_Personal} </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuesto.Pago_Total}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">  
                      <Link to={`/ver_presupuesto/${presupuesto._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">
                        Ver
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
