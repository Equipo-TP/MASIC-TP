import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Box, TextField, Button, Typography, Grid, Paper, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerTarifaRequest, editarTarifaRequest } from '../../api/auth';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

function EditTarifaPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tarifa, setTarifa] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga para mostrar el spinner mientras se cargan los datos
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: tarifa,
  });

  useEffect(() => {
    const obtTarifa = async () => {
      try {
        const res = await obtenerTarifaRequest(id); // API para obtener datos de la tarifa
        const tarifaData = res.data.data;
        setTarifa(tarifaData);
        reset(tarifaData); // Resetea el formulario con los datos obtenidos
        setLoading(false); // Termina la carga
      } catch (error) {
        console.error(`Error obteniendo la tarifa con id ${id}`, error);
        setLoading(false);
        setSnackbarMessage('Error al cargar datos de la tarifa');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };
    obtTarifa();
  }, [id, reset]);

  const generateNextOrderNumber = () => {
    if (tarifa) {
      return tarifa.orden + 1;
    }
    return 1; // Si no hay tarifas, empieza desde 1
  };

  const onSubmit = async (data) => {
    try {
      await editarTarifaRequest(id, data); // API para actualizar la tarifa
      setSnackbarMessage('Tarifa actualizada correctamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate('/gestionar_tarifas');
    } catch (error) {
      console.error('Error actualizando tarifa:', error);
      setSnackbarMessage('Error al actualizar tarifa');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('¿Estás seguro de que deseas cancelar? Todos los cambios no guardados se perderán.');
    if (confirmCancel) {
      navigate('/gestionar_tarifas');
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
          <Typography variant="h4" gutterBottom>Editar Tarifa</Typography>
          <Paper elevation={3} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tipo de Luminaria"
                    defaultValue={tarifa?.tipo_luminaria || ''}
                    {...register('tipo_luminaria', { required: 'El tipo de luminaria es requerido' })}
                    error={!!errors.tipo_luminaria}
                    helperText={errors.tipo_luminaria ? errors.tipo_luminaria.message : ''}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Precio"
                    defaultValue={tarifa?.precio || ''}
                    {...register('precio', { required: 'El precio es requerido' })}
                    error={!!errors.precio}
                    helperText={errors.precio ? errors.precio.message : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    defaultValue={tarifa?.descripcion || ''}
                    {...register('descripcion', { required: 'La descripción es requerida' })}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion ? errors.descripcion.message : ''}
                  />
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

export default EditTarifaPage;
