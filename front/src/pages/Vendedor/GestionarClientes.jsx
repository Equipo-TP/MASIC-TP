import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    setRefresh((prev) => !prev);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClienteSelect = async (cliente) => {
    try {
      const data = await obtenerClienteConSolicitudesRequest(cliente._id);
      setSelectedCliente(cliente);
      setSolicitudes(data.data.data || []);
      console.log(data);
    } catch (error) {
      console.error('Error al obtener las solicitudes del cliente:', error);
    }
  };

  const closeModal = () => {
    setSelectedCliente(null);
    setSolicitudes([]);
  };

  const filteredClients = clientes.filter((cliente) =>
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

          {/* Tabla para pantallas grandes */}
          <table className="hidden md:table min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="w-full bg-gray-300 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nombre y Apellido</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Teléfono</th>
                <th className="py-3 px-6 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredClients.length > 0 ? (
                filteredClients.map((cliente) => (
                  <tr key={cliente._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6">{`${cliente.nombre} ${cliente.apellidos}`}</td>
                    <td className="py-3 px-6">{cliente.email}</td>
                    <td className="py-3 px-6">{cliente.telefono}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleClienteSelect(cliente)}
                        className="text-blue-500 hover:underline mr-4"
                      >
                        Ver
                      </button>
                      <Link to={`/editar_cliente/${cliente._id}`} className="text-blue-500 hover:underline">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-3 px-6 text-center">No se encontraron clientes.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Vista para pantallas pequeñas */}
          <div className="space-y-4 md:hidden overflow-y-auto max-h-96">
            {filteredClients.length > 0 ? (
              filteredClients.map((cliente) => (
                <div key={cliente._id} className=" bg-white p-4 rounded-lg shadow">
                  <div className="text-sm font-bold">{`${cliente.nombre} ${cliente.apellidos}`}</div>
                  <div className="text-sm">Email: {cliente.email}</div>
                  <div className="text-sm">Teléfono: {cliente.telefono}</div>
                  <div className="pt-2 flex space-x-2">
                    <button
                      onClick={() => handleClienteSelect(cliente)}
                      className="bg-blue-500 text-black px-4 py-2 rounded"
                    >
                      Ver
                    </button>
                    <Link to={`/editar_cliente/${cliente._id}`} className="bg-green-500 text-black px-4 py-2 rounded">
                      Editar
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3">No se encontraron clientes.</div>
            )}
          </div>

          {/* Modal para ver detalles del cliente */}
          {selectedCliente && (
            <ModalCliente cliente={selectedCliente} solicitudes={solicitudes} onClose={closeModal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionarClientes;
