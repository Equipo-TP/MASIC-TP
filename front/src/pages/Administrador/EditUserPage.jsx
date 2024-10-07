import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Box, TextField, Button, Typography, Grid, Paper, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerUserRequest, editarUserRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

function EditUserPage() {
  const { id } = useParams(); // Obtener el ID del usuario de la URL
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga para mostrar el spinner mientras se cargan los datos
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: user,
  });
  
  // Obtener datos del usuario
  useEffect(() => {
    const obtUsuario = async () => {
      try {
        const res = await obtenerUserRequest(id); // API para obtener datos del usuario
        const userData = res.data.data;
        setUser(userData);
        reset(userData); // Resetea el formulario con los datos obtenidos
        setLoading(false); // Termina la carga
      } catch (error) {
        console.error(`Error obteniendo el usuario con id ${id}`, error);
        setLoading(false);
        setSnackbarMessage('Error al cargar datos del usuario');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };
    obtUsuario();
  }, [id, reset]);

  // Manejo del envío del formulario
  const onSubmit = async (data) => {
    try {
      await editarUserRequest(id, data); // API para actualizar el usuario
      setSnackbarMessage('Usuario actualizado correctamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate('/gestionar_usuarios');
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      setSnackbarMessage('Error al actualizar usuario');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('¿Estás seguro de que deseas cancelar? Todos los cambios no guardados se perderán.');
    if (confirmCancel) {
      navigate('/gestionar_usuarios');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Si está cargando, mostrar un spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <MenuSideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <NavBar />
        <Box sx={{ width: '100%', maxWidth: '900px', p: 2 }}>
          <Typography variant="h4" gutterBottom>Editar Usuario</Typography>
          <Paper elevation={3} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    defaultValue={user?.nombre || ''}
                    {...register('nombre', {
                      required: 'El nombre es requerido',
                      minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' },
                    })}
                    error={!!errors.nombre}
                    helperText={errors.nombre ? errors.nombre.message : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellidos"
                    defaultValue={user?.apellidos || ''}
                    {...register('apellidos', {
                      required: 'El apellido es requerido',
                      minLength: { value: 2, message: 'El apellido debe tener al menos 2 caracteres' },
                    })}
                    error={!!errors.apellidos}
                    helperText={errors.apellidos ? errors.apellidos.message : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={user?.email || ''}
                    {...register('email', {
                      required: 'El email es requerido',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Formato de email inválido' },
                    })}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="DNI"
                    defaultValue={user?.dni || ''}
                    {...register('dni', {
                      required: 'El DNI es requerido',
                      pattern: { value: /^[0-9]{8,10}$/, message: 'Formato de DNI inválido, debe tener entre 8 y 10 dígitos' },
                    })}
                    error={!!errors.dni}
                    helperText={errors.dni ? errors.dni.message : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    defaultValue={user?.telefono || ''}
                    {...register('telefono', {
                      required: 'El teléfono es requerido',
                      pattern: { value: /^[0-9]+$/, message: 'Solo se permiten números' },
                      minLength: { value: 9, message: 'El teléfono debe tener al menos 9 dígitos' },
                    })}
                    error={!!errors.telefono}
                    helperText={errors.telefono ? errors.telefono.message : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.rol}>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      defaultValue={user?.rol || ''}
                      {...register('rol', { required: 'El rol es requerido' })}
                    >
                      <MenuItem value="Administrador">Administrador</MenuItem>
                      <MenuItem value="Vendedor">Vendedor</MenuItem>
                      <MenuItem value="Tecnico">Técnico</MenuItem>
                    </Select>
                    {errors.rol && <Typography color="error">{errors.rol.message}</Typography>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="contained" color="primary" type="submit">
                    Guardar Cambios
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditUserPage;
