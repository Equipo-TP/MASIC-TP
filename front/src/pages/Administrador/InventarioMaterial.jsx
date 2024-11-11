import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GestionarAlmacen = () => {
  const [materiales, setMateriales] = useState([]);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: '',
    categoria: '',
    stock: 0,
    unidad_medida: ''
  });
  const [movimiento, setMovimiento] = useState({ cantidad: 0, fecha_mov: new Date() });
  const [mostrarModal, setMostrarModal] = useState(false);

  // Obtener todos los materiales al cargar el componente
  useEffect(() => {
    listarMateriales();
  }, []);

  // Función para listar todos los materiales
  const listarMateriales = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/listar_materiales');
      setMateriales(res.data.data);
    } catch (error) {
      console.error('Error al listar materiales:', error);
    }
  };

  // Función para manejar el cambio de los inputs del formulario
  const handleInputChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  // Función para manejar el cambio del movimiento (ingreso/egreso)
  const handleMovimientoChange = (e) => {
    setMovimiento({
      ...movimiento,
      [e.target.name]: e.target.value
    });
  };

  // Registrar un nuevo material
  const registrarMaterial = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/registro_material', formulario);
      listarMateriales(); // Actualiza la lista
      setFormulario({ nombre: '', categoria: '', stock: 0, unidad_medida: '' }); // Limpia el formulario
    } catch (error) {
      console.error('Error al registrar el material:', error);
    }
  };

  // Editar un material
  const editarMaterial = async () => {
    try {
      await axios.put(`http://localhost:8000/api/editar_material/${materialSeleccionado._id}`, formulario);
      listarMateriales(); // Actualiza la lista
      setMaterialSeleccionado(null);
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al editar el material:', error);
    }
  };

  // Eliminar un material
  const eliminarMaterial = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/eliminar_material/${id}`);
      listarMateriales(); // Actualiza la lista
    } catch (error) {
      console.error('Error al eliminar el material:', error);
    }
  };

  // Registrar un movimiento (ingreso o egreso)
  const registrarMovimiento = async (id) => {
    try {
      await axios.post('http://localhost:8000/api/registrar_movimiento', {
        _id: id,
        cantidad: parseFloat(movimiento.cantidad),
        fecha_mov: movimiento.fecha_mov
      });
      listarMateriales(); // Actualiza la lista
      setMovimiento({ cantidad: 0, fecha_mov: new Date() }); // Limpia el formulario de movimiento
    } catch (error) {
      console.error('Error al registrar el movimiento:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Almacén</h1>

      {/* Formulario para registrar un nuevo material */}
      <form onSubmit={registrarMaterial} className="mb-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Material"
          value={formulario.nombre}
          onChange={handleInputChange}
          required
          className="border p-2 mr-2"
        />
        <input
          /*type="text"
          name="categoria"
          placeholder="Categoría"
          value={formulario.categoria}
          onChange={handleInputChange}
          required
          className="border p-2 mr-2"*/
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formulario.stock}
          onChange={handleInputChange}
          required
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="unidad_medida"
          placeholder="Unidad de Medida"
          value={formulario.unidad_medida}
          onChange={handleInputChange}
          required
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Registrar Material</button>
      </form>

      {/* Tabla de materiales */}
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Categoría</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Unidad de Medida</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((material) => (
            <tr key={material._id}>
              <td className="border px-4 py-2">{material.nombre}</td>
              <td className="border px-4 py-2">{material.categoria}</td>
              <td className="border px-4 py-2">{material.stock}</td>
              <td className="border px-4 py-2">{material.unidad_medida}</td>
              <td className="border px-4 py-2">
                <button onClick={() => { setMaterialSeleccionado(material); setMostrarModal(true); }} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Editar</button>
                <button onClick={() => eliminarMaterial(material._id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                <button onClick={() => registrarMovimiento(material._id)} className="bg-yellow-500 text-white px-2 py-1 rounded ml-2">Registrar Movimiento</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar material */}
      {mostrarModal && materialSeleccionado && (
        <ModalProducto
          producto={materialSeleccionado}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default GestionarAlmacen;
