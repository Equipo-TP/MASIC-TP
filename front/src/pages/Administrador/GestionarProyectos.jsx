import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { listarClientesRequest, obtenerClienteConSolicitudesRequest } from '../../api/auth'; 
import MenuSideBar from '../../components/MenuSideBar'; 
import NavBar from '../../components/NavBar'; 
import ModalCliente from '../../components/ModalCliente';

const GestionarProyectos = () => {
  const [clientes, setClientes] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const listarClientes = async () => {
      try {
        const data = await listarClientesRequest();
        setClientes(data.data.data); 
      } catch (error) {
        console.error('Error al listar los clientes:', error);
      }
    };

    listarClientes();
  }, [refresh]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); 
  };

  const handleRefresh = () => {
    setRefresh(prev => !prev); 
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); 
  };

  const handleClienteSelect = async (cliente) => {
    try {
      const data = await obtenerClienteConSolicitudesRequest(cliente._id); 
      setSelectedCliente(cliente); 
      setSolicitudes(data.data.data || []); 
    } catch (error) {
      console.error('Error al obtener las solicitudes del cliente:', error);
    }
  };

  const filteredClients = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} /> 
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} /> 
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Lista de Proyectos</h1>

          <div className="flex justify-end mb-4">
            <button 
              onClick={() => navigate('/registrar_proyecto')} 
              className="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Crear Proyecto
            </button>
          </div> 

          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="w-full bg-gray-300 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nombre del proyecto</th>
                <th className="py-3 px-6 text-left">Nombre del cliente</th>                
                <th className="py-3 px-6 text-left">Ubicación</th>
                <th className="py-3 px-6 text-left">Estado</th> 
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredClients.length > 0 ? (
                filteredClients.map((cliente) => (
                  <tr key={cliente._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6">{cliente.nombre}</td>
                    <td className="py-3 px-6">{cliente.apellidos}</td>
                    <td className="py-3 px-6">{cliente.email}</td>
                    <td className="py-3 px-6">{cliente.telefono}</td>
                    <td className="py-3 px-6">
                      <button 
                        onClick={() => navigate(`/info_solicitud/${solicitud._id}`)} 
                        className="text-green-500 hover:underline mr-4"
                      >
                        Ver
                      </button>
                      <button 
                        onClick={() => navigate(`/info_solicitud/${solicitud._id}`)} 
                        className="text-red-500 hover:underline mr-4"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-3 px-6 text-center">No se encontraron proyectos.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Modal para ver detalles del cliente */}
          {selectedCliente && (
            <ModalCliente cliente={selectedCliente} solicitudes={solicitudes} onClose={closeModal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionarProyectos;
