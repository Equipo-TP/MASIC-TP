import React, { useEffect, useState } from 'react';
import { editarUserRequest } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import MenuSideBar from '../../components/MenuSideBar'; // Sidebar
import NavBar from '../../components/NavBar'; // Navbar
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';


export function MiPerfil () {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { register, handleSubmit, setValue } = useForm();
  const [usuario, setUsuario] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para abrir/cerrar el sidebar

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setValue('rol', user.data.rol);
        setValue('nombre', user.data.nombre);
        setValue('apellidos', user.data.apellidos);
        setValue('dni', user.data.dni);
        setValue('telefono', user.data.telefono);
        setValue('email', user.data.email);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    fetchUsuario();
  }, [user, usuario, setValue]);

  const onSubmit = async (data) => {
    try {
      const res = await editarUserRequest(user.data._id, data); // Actualizar los datos del usuario
      setUser(res.data);
      alert('Información actualizada correctamente');
      navigate('/logged_user');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Alterna el estado del sidebar
  };

  //if (!user) return <div>Cargando...</div>; // Muestra mientras carga

  return (
    <div className="flex">
      <MenuSideBar open={drawerOpen} />
      <div className="flex-1">
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <div className="p-6">
          <Typography variant="h4" component="h1" gutterBottom>
            Mi Perfil
          </Typography>
          <Paper elevation={6} className="p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                label="Rol"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('rol')}
                disabled
              />
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('nombre')}
                disabled
              />
              <TextField
                label="Apellidos"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('apellidos')}
                disabled
              />
              <TextField
                label="Dni"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('dni')}
                disabled
              />
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('telefono')}
                //disabled
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
}

export default MiPerfil;
