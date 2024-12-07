import React, { useEffect, useState } from 'react';
import { listarAlmacenesRequest, eliminarAlmacenRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const GestionarAlmacen = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAlmacenes, setFilteredAlmacenes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(null); // Estado para manejar el dropdown

  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        const response = await listarAlmacenesRequest();
        setAlmacenes(response.data.data);
        setFilteredAlmacenes(response.data.data);
      } catch (error) {
        console.error('Error al listar los almacenes:', error);
      }
    };

    fetchAlmacenes();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación de almacén',
      message: '¿Estás seguro de que deseas eliminar este almacén?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await eliminarAlmacenRequest(id);
              setAlmacenes(almacenes.filter((almacen) => almacen._id !== id));
              setFilteredAlmacenes(filteredAlmacenes.filter((almacen) => almacen._id !== id));
            } catch (error) {
              console.error('Error al eliminar el almacén:', error);
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
    setFilteredAlmacenes(
      almacenes.filter((almacen) =>
        almacen.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilteredAlmacenes(almacenes);
    setCurrentPage(1);
  };

  const toggleDropdown = (id) => {
    if (isOpen === id) {
      setIsOpen(null); // Cierra el menú si ya está abierto
    } else {
      setIsOpen(id); // Abre el menú para el almacén específico
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlmacenes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAlmacenes.length / itemsPerPage);

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
        <div className="p-6 mx-20 mt-20 relative overflow-hidden overflow-y-auto h-[calc(100vh-1rem)] ml-0">
            <h1 className="text-3xl font-bold mb-2">Gestionar Almacén</h1>
            <p className="mb-6 text-zinc-700">Este módulo lista todos los materiales de la empresa.</p>

            {/* Fila para el filtro, input y botones */}
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Nombre del almacén"
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
              <Link to="/registro_almacen">
                <button className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                  Crear Material
                </button>
              </Link>
            </div>

            {/* Tabla de Almacenes */}
            <table className="shadow-md w-full overflow-hidden rounded-lg text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3">Disponible</th>
                  <th scope="col" className="px-6 py-3">Stock</th>
                  <th scope="col" className="px-6 py-3">Fecha de Registro</th>
                  <th scope="col" className="px-6 py-3">Unidad de Medida</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody >
                {currentItems.length > 0 ? (
                  currentItems.map((almacen, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{almacen.nombre}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{almacen.stock}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{almacen.stock_fisico}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{almacen.fecha_registro}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{almacen.unidad_medida}</td>

                      <td className="px-6 py-3 text-gray-900 dark:text-white">
                        {/* Botón de opciones */}
                        <div className="btn-group dropdown d-inline-block mb-3 mr-2">
                          <button
                            type="button" aria-expanded={isOpen} aria-haspopup="true"
                            className="inline-flex items-center justify-center w-full rounded-lg border border-gray-300 bg-gradient-to-r from-gray-200 to-gray-300 px-5 py-2 font-semibold text-gray-800 shadow-md hover:from-gray-300 hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-500 transition-all duration-300"
                            id="options-menu-button"
                            onClick={() => toggleDropdown(almacen._id)}
                          >
                            Opciones
                          </button>
                          {isOpen === almacen._id && (
                            <div
                               class="dropdown-menu" className="absolute mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10"
                            >
                                <Link
                                  to={`/inventario_almacen/${almacen._id}`}
                                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                                >
                                  Inventario
                                </Link>
                                <Link
                                  to={`/movimientos_almacen/${almacen._id}`}
                                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                                >
                                  Movimientos
                                </Link>
                                <button
                                  onClick={() => handleDelete(almacen._id)}
                                  className="block px-4 py-2 text-sm text-red-600 dark:text-red-500"
                                >
                                  Eliminar
                                </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No se encontraron almacenes.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
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
  );
};

export default GestionarAlmacen;
