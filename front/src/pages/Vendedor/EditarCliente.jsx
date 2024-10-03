import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerClienteRequest, actualizarClienteRequest } from '../../api/auth'; // Asegúrate de que esta ruta sea correcta
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

const EditarCliente = () => {
  const { id } = useParams(); // Obtenemos el id de la URL
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para manejar el sidebar
  const navigate = useNavigate(); // Para redirigir después de actualizar
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: cliente,
  });

  // Obtener los datos del cliente al cargar el componente
  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const data = await obtenerClienteRequest(id);
        if (data && data.data) {
          const clienteData = data.data;
          // Si el cliente existe, llenamos el estado con sus datos
          setCliente(clienteData);
          reset(clienteData);
          console.log(data.data);
        } else {
          setError('No se encontraron datos del cliente.');
        }
      } catch (error) {
        setError('Error al obtener el cliente.');
        console.error('Error al obtener el cliente:', error);
      }
    };

    obtenerCliente();
  }, [id, reset]); // Solo se ejecuta cuando cambia el id

  // Actualizar el estado del cliente cada vez que cambia un input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  // Enviar los datos actualizados
  const onSubmit = async (data) => {
  //  e.preventDefault(); // Evita que el formulario recargue la página
    try {
      const actualizado = await actualizarClienteRequest(id, data); // Llamada para actualizar el cliente
     console.log(data);
     console.log(actualizado);
     navigate('/gestionar_clientes'); // Redirigir a la lista de clientes tras guardar
    } catch (error) {
      setError('Error al actualizar el cliente.');
      console.error('Error al actualizar el cliente:', error);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Alternar la visibilidad del sidebar
  };

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Editar Cliente</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>} {/* Mensaje de error */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {/* Campo Nombre */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
              <input
                type="text"
                name="nombre"
                defaultValue={cliente?.nombre || ''}
                {...register('nombre')}
                error={!!errors.nombre}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            {/* Campo Apellidos */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                defaultValue={cliente?.apellidos || ''}
                {...register('apellidos')}
                error={!!errors.apellidos}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            {/* Campo Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={cliente?.email || ''}
                {...register('email')}
                error={!!errors.email}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            {/* Campo Teléfono */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                defaultValue={cliente?.telefono || ''}
                {...register('telefono')}
                error={!!errors.telefono}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarCliente;
