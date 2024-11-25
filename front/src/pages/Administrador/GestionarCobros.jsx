import React, { useEffect, useState } from 'react';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { listarCobrosRequest, eliminarCobroRequest } from '../../api/auth';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const GestionarCobros = () => {
  const [cobros, setCobros] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCobros, setFilteredCobros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchCobros = async () => {
      try {
        const response = await listarCobrosRequest();
        setCobros(response.data.data);
        setFilteredCobros(response.data.data);
      } catch (error) {
        console.error('Error al listar los cobros:', error);
      }
    };

    fetchCobros();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación de cobro',
      message: '¿Estás seguro de que deseas eliminar este cobro?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await eliminarCobroRequest(id);
              const updatedCobros = cobros.filter((cobro) => cobro._id !== id);
              setCobros(updatedCobros);
              setFilteredCobros(updatedCobros);
            } catch (error) {
              console.error('Error al eliminar el cobro:', error);
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

  const handleFilter = () => {
    const filtered = cobros.filter((cobro) =>
      cobro.vendedora.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCobros(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilteredCobros(cobros);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCobros.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCobros.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <h1 className="text-3xl font-bold mb-2">Control de estado de cobro</h1>
            <p className="mb-6">Este módulo lista todos los cobros de la empresa.</p>

            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Nombre de la vendedora"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-md shadow-sm flex-1"
              />
              <button
                onClick={handleFilter}
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Filtrar
              </button>
              <button
                onClick={handleReset}
                className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Resetear
              </button>
              <Link to="/registro_cobro">
                <button className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2">
                  Registrar Cobro
                </button>
              </Link>
            </div>

            <table className="shadow-md w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Vendedora</th>
                  <th scope="col" className="px-6 py-3">Cliente</th>
                  <th scope="col" className="px-6 py-3">Servicio</th>
                  <th scope="col" className="px-6 py-3">Total Cobrado</th>
                  <th scope="col" className="px-6 py-3">Saldo Restante</th>
                  <th scope="col" className="px-6 py-3">Estado</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((cobro, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{cobro.vendedora}</td>
                      <td className="px-6 py-4">{cobro.cliente}</td>
                      <td className="px-6 py-4">{cobro.servicio}</td>
                      <td className="px-6 py-4">S/.{cobro.totalCobrado}</td>
                      <td className="px-6 py-4">S/.{cobro.saldoRestante}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span
                            className={`mr-2 ${getEstadoClass(cobro.estado)}`}
                          >
                            {cobro.estado}
                          </span>
                          {cobro.estado !== 'Cobrado Completamente' && (
                            <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${getProgressBarClass(cobro)}`}
                            style={{ width: `${getProgressPercentage(cobro)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/cobros/detalles/${cobro._id}`}>
                          <button className="text-blue-600 hover:underline">
                            Ver Detalles
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(cobro._id)}
                          className="ml-2 text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      No se encontraron cobros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Anterior
              </button>
              <p>
                Página {currentPage} de {totalPages}
              </p>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function getEstadoClass(estado) {
    switch (estado) {
      case 'Cobrado Completamente':
        return 'text-green-500';
      case 'Por Cobrar':
        return 'text-red-500';
      case 'Saldo Parcial':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  }

  function getProgressBarClass(cobro) {
    switch (cobro.estado) {
      case 'Cobrado Completamente':
        return 'bg-green-500';
      case 'Saldo Parcial':
        return 'bg-yellow-500';
      case 'Por Cobrar':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  function getProgressPercentage(cobro) {
    const total = cobro.totalCobrado + cobro.saldoRestante;
    return Math.round((cobro.totalCobrado / total) * 100);
  }
};

export default GestionarCobros;
