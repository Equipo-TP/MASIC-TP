import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

const RegistrarAlmacen = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState(0);
  const [unidadMedida, setUnidadMedida] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState(new Date().toISOString()); // Guarda la fecha y hora actual

  const [errors, setErrors] = useState({
    nombre: '',
    stock: '',
    unidadMedida: ''
  });

  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {
      nombre: '',
      stock: '',
      unidadMedida: ''
    };

    // Validaciones
    if (!nombre.trim()) {
      formIsValid = false;
      newErrors.nombre = 'Este campo es obligatorio y no puede contener solo espacios';
    }
    if (stock === '' || stock <= 0) {
      formIsValid = false;
      newErrors.stock = 'El stock debe ser un número positivo';
    }
    if (!unidadMedida.trim()) {
      formIsValid = false;
      newErrors.unidadMedida = 'Este campo es obligatorio y no puede contener solo espacios';
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const registrarMaterial = async () => {
    if (!validateForm()) {
      return;
    }

    const data = {
      nombre,
      stock,
      unidad_medida: unidadMedida,
      fecha_registro: fechaRegistro,
    };

    try {
      await axios.post('http://localhost:8000/api/registro_material', data);
      setSnackbarMessage('Material registrado correctamente');
      setSnackbarSeverity('success');
      setNombre('');
      setStock(0);
      setUnidadMedida('');
      setFechaRegistro(new Date().toISOString()); // Reinicia a la fecha y hora actual
      setOpenSnackbar(true);

      // Redirigir automáticamente a la página de gestionar_almacen
      setTimeout(() => {
        navigate('/gestionar_almacen');
      }, 1500); // Espera 1.5 segundos para mostrar la alerta antes de redirigir
    } catch (error) {
      console.error('Error al registrar el material:', error.response?.data || error.message);
      setSnackbarMessage('Error al registrar el material');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('¿Estás seguro de que deseas cancelar el registro? Todos los datos no guardados se perderán.');
    if (confirmCancel) {
      setNombre('');
      setStock(0);
      setUnidadMedida('');
      navigate('/gestionar_almacen');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleFechaChange = (e) => {
    const selectedDate = e.target.value;
    const currentTime = new Date().toISOString().substring(11, 19);
    setFechaRegistro(`${selectedDate}T${currentTime}`); // Combina la fecha seleccionada con la hora actual
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <MenuSideBar open={drawerOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: 'margin-left 0.3s ease',
          padding: '16px',
          overflowX: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <Box
          sx={{
            mt: 4,
            maxWidth: '1000px',
            width: '100%',
            p: 3,
            overflowX: 'hidden',
          }}
        >
          <Typography variant="h4" gutterBottom align="left">
            Registrar Nuevo Material
          </Typography>
          <Paper
            elevation={6}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(211, 211, 211, 0.2)',
              backdropFilter: 'blur(3px)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    error={Boolean(errors.nombre)}
                    helperText={errors.nombre}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    error={Boolean(errors.stock)}
                    helperText={errors.stock}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Unidad de Medida"
                    value={unidadMedida}
                    onChange={(e) => setUnidadMedida(e.target.value)}
                    error={Boolean(errors.unidadMedida)}
                    helperText={errors.unidadMedida}
                    required
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button variant="contained" color="primary" onClick={registrarMaterial}>
                    Registrar Material
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
    </Box>
  );
};

export default RegistrarAlmacen;
