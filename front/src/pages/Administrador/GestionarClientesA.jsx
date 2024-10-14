// src/pages/Vendedor/GestionarClientes.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { listarClientesRequest, obtenerClienteConSolicitudesRequest } from '../../api/auth'; 
import MenuSideBar from '../../components/MenuSideBar'; 
import NavBar from '../../components/NavBar'; 
import { Link } from 'react-router-dom'; 
import ModalCliente from '../../components/ModalCliente';

const GestionarClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null); // Estado para el cliente seleccionado
  const [solicitudes, setSolicitudes] = useState([]); // Nuevo estado para solicitudes
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
      const data = await obtenerClienteConSolicitudesRequest(cliente._id); // Obtener cliente con solicitudes
      setSelectedCliente(cliente); // Establece el cliente seleccionado
      setSolicitudes(data.data.data || []); // Establece las solicitudes obtenidas
      console.log(data);
    } catch (error) {
      console.error('Error al obtener las solicitudes del cliente:', error);
    }
  };


  const closeModal = () => {
    setSelectedCliente(null); 
    setSolicitudes([]); // Limpiar las solicitudes cuando se cierre el modal
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
          <h1 className="text-3xl font-bold mb-4">Lista de Clientes</h1>

          {/* Barra de búsqueda */}
          <div className="mb-4">
            <input 
              type="text" 
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar cliente por nombre"
              className="border rounded p-2 w-56"
            />
          </div>

          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="w-full bg-gray-300 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Apellidos</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Teléfono</th>
                <th className="py-3 px-6 text-left">Acciones</th>
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
                        onClick={() => handleClienteSelect(cliente)} 
                        className="text-blue-500 hover:underline mr-4"
                      >
                        Ver
                      </button>
                     
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-3 px-6 text-center">No se encontraron clientes.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Modal para ver detalles del cliente */}
          {selectedCliente && (
            <ModalCliente cliente={selectedCliente} solicitudes={solicitudes}  onClose={closeModal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionarClientes;
