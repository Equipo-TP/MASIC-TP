import React, { useEffect, useState } from 'react';
import { obtenerUsuarioRequest, actualizarUsuarioRequest } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import MenuSideBar from '../../components/MenuSideBar'; // Sidebar
import NavBar from '../../components/NavBar'; // Navbar
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';

const EditarUsuario = () => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue } = useForm();
  const [usuario, setUsuario] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para abrir/cerrar el sidebar

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await obtenerUsuarioRequest(user._id); // Obtener los datos del usuario
        setUsuario(response.data);
        setValue('nombre', response.data.nombre);
        setValue('apellidos', response.data.apellidos);
        setValue('telefono', response.data.telefono);
        setValue('email', response.data.email);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    fetchUsuario();
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      await actualizarUsuarioRequest(user._id, data); // Actualizar los datos del usuario
      alert('Información actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Alterna el estado del sidebar
  };

  if (!usuario) return <div>Cargando...</div>; // Muestra mientras carga

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          <Typography variant="h4" component="h1" gutterBottom>
            Editar Perfil
          </Typography>
          <Paper elevation={6} className="p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('nombre')}
              />
              <TextField
                label="Apellidos"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('apellidos')}
              />
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('telefono')}
              />
              <TextField
                label="Correo Electrónico"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('email')}
                disabled // No editable
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="mt-4"
              >
                Actualizar Información
              </Button>
            </form>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default EditarUsuario;
