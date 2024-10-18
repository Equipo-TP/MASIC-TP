import React, { useEffect, useState } from 'react';
import {listarPresupuestosRequest, obtenerSolicitudPorIdRequest, obtener_cliente_por_idRequest, obtener_usuario_por_idRequest } from '../../api/auth'; // Asegúrate de que este request esté en auth.js
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link } from 'react-router-dom';

const GestionarPresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [presupuestos2, setPresupuestos2] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cliente, setCliente] = useState('');
  const [nombreVendedor, setNombreVendedor] = useState('');
  const [Solicitud, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
       // const prep = response.data.data;
        console.log(response.data.data);
      /*  const solicitudes = await Promise.all(
          prep.map(async (presupuesto) => {
            const solicitudRes = await obtenerSolicitudPorIdRequest(presupuesto.ID_Solicitud_Presupuesto._id);
            const solicitud = solicitudRes.data.data;
            console.log(solicitudRes.data.data)
            const clienteRes = await obtener_cliente_por_idRequest(solicitudRes.data.data.cliente._id);
            const cliente = clienteRes.data.data;
            const vendedorRes = await obtener_cliente_por_idRequest(solicitudRes.data.data.cliente._id);
            const vendedor = clienteRes.data.data;
            return { solicitud, cliente, vendedor };
          })
        );*/
        setPresupuestos(response.data.data);
        //setSolicitudes(solicitudes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al listar los presupuestos:', error.response ? error.response.data : error.message);
      }
    };

    fetchPresupuestos();
  }, []);
 /* useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const solicitudes = await Promise.all(
          presupuestos.map(async (presupuesto) => {
            const solicitudRes = await obtenerSolicitudPorIdRequest(presupuesto.ID_Solicitud_Presupuesto);
            const solicitud = solicitudRes.data.data;
            const clienteRes = await obtener_cliente_por_idRequest(solicitud.cliente._id);
            const cliente = clienteRes.data.data;
            return { solicitud, cliente };
          })
        );
        setSolicitudes(solicitudes);
        console.log(presupuestos)
        console.log(Solicitud)
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener la solicitud:', error);
      }
    };
  
    if (presupuestos2.length > 0) {
      fetchSolicitudes();
    }
  }, [presupuestos2]); */
  
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
                  
                  <th scope="col" className="px-6 py-3">ID Solicitud</th>
                  <th scope="col" className="px-6 py-3">Nombre del cliente</th>
                  <th scope="col" className="px-6 py-3">Nombre del vendedor</th>
                  <th scope="col" className="px-6 py-3">Costo Materiales</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentPresupuestos.map((presupuestos, index) =>{ 
                
                // Obtiene el cliente si la solicitud es válida
               // const clientes = solicitud && solicitud.cliente ? cliente[solicitud.cliente._id] : null;

                  return(
                  <tr key={presupuestos._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuestos.ID_Solicitud_Presupuesto?.id}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuestos.ID_Solicitud_Presupuesto?.cliente.nombre} {presupuestos.ID_Solicitud_Presupuesto?.cliente.apellidos}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuestos.ID_Solicitud_Presupuesto.vendedor.nombre} {presupuestos.ID_Solicitud_Presupuesto.vendedor.apellidos}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{presupuestos?.Costo_Materiales}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">  
                      <Link to={`/ver_presupuesto/${presupuestos._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">
                        Ver
                      </Link>
                      <Link to={`/editar_presupuesto/${presupuestos._id}`} className="font-medium text-green-600 dark:text-green-500 hover:underline mr-4">
                        Editar
                      </Link>
                    </td>
                  </tr> 
                )})}
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
