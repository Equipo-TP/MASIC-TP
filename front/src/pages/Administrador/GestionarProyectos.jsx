import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { listar_proyectosRequest, obtenerClienteConSolicitudesRequest } from '../../api/auth'; 
import MenuSideBar from '../../components/MenuSideBar'; 
import NavBar from '../../components/NavBar'; 
import ModalCliente from '../../components/ModalCliente';
import { Link } from 'react-router-dom';

const GestionarProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [isOpen, setIsOpen] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const listarProyectos = async () => {
      try {
        const data = await listar_proyectosRequest();
        setProyectos(data.data.data); 
        console.log(proyectos);
      } catch (error) {
        console.error('Error al listar los proyectos:', error);
      }
    };

    listarProyectos();
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

  const toggleDropdown = (id) => {
    if (isOpen === id) {
      setIsOpen(null); // Cierra el menú si ya está abierto
    } else {
      setIsOpen(id); // Abre el menú para el proyecto específico
    }
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

  const filteredClients = proyectos.filter(proyecto => 
    proyecto.Nombre_Proyecto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} /> 
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} /> 
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Gestionar Proyectos</h1>

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
                <th className="py-3 px-6 text-left">Acciones</th> 
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredClients.length > 0 ? (
                filteredClients.map((proyecto) => (
                  <tr key={proyecto._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6">{proyecto.ID_Proyecto}</td>
                    <td className="py-3 px-6">{proyecto.Nombre_Proyecto}</td>
                    <td className="py-3 px-6">{proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.cliente.nombre} {proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.cliente.apellidos}</td>
                    <td className="py-3 px-6">{proyecto.ID_Presupuesto_Proyecto?.ID_Solicitud_Presupuesto?.direccion}, {proyecto.ID_Presupuesto_Proyecto?.Transporte_Personal}</td>
                    <td className="py-3 px-6">
                      <div class="btn-group dropdown d-inline-block mb-3 mr-2">
                        <button className="btn btn-outline-secondary border-2 py-2 px-6 dropdown-toggle rounded-lg bg-gray-300" aria-haspopup="true"
                         aria-expanded={isOpen} type="button" onClick={() => toggleDropdown(proyecto._id)}>OPCIONES</button>
                      {isOpen === proyecto._id && (
                        <div class="dropdown-menu" className="absolute mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                          <Link to={`/asignar_tecnico/${proyecto._id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Ver</Link>
                          <Link to={`/asignar_tecnicos/${proyecto._id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Asignar técnico</Link>
                          <Link to={`/visualizar_presupuesto/${proyecto.ID_Presupuesto_Proyecto._id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Detalle Presupuesto</Link>
                        </div>)}
                      </div> 
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