import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

const RegistrarTarifa = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [formData, setFormData] = useState({
    tipo_luminaria: '',
    precio: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState({
    tipo_luminaria: '', 
    precio: '',
    descripcion: ''
  });
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'tipo_luminaria':
        setErrors((prevErrors) => ({
          ...prevErrors,
          tipo_luminaria: value.trim() === '' ? 'Tipo de luminaria requerido' : ''
        }));
        break;
      case 'precio':
        setErrors((prevErrors) => ({
          ...prevErrors,
          precio: /^\d+(\.\d{1,2})?$/.test(value) ? '' : 'Precio inválido, debe ser un número positivo'
        }));
        break;
      case 'descripcion':
        setErrors((prevErrors) => ({
          ...prevErrors,
          descripcion: value.trim() === '' ? 'Descripción requerida' : ''
        }));
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    let valid = true;
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
    });
    valid = Object.values(errors).every(error => error === '');
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:8000/api/registro_tarifa', formData);
        console.log('Tarifa registrada con éxito:', response.data);
        setSnackbarMessage('Tarifa registrada con éxito!');
        setSnackbarSeverity('success');
        navigate('/gestionar_tarifas');
      } catch (error) {
        console.error('Error al registrar la tarifa:', error.response?.data || error.message);
        setSnackbarMessage('Error al registrar la tarifa.');
        setSnackbarSeverity('error');
      } finally {
        setOpenSnackbar(true);
      }
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('¿Estás seguro de que deseas cancelar el registro? Todos los datos no guardados se perderán.');
    if (confirmCancel) {
      setFormData({
        tipo_luminaria: '',
        precio: '',
        descripcion: ''
      });
      navigate('/gestionar_tarifas');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <MenuSideBar open={drawerOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: drawerOpen ? '300px' : '70px',
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
            Registrar Nueva Tarifa
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
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tipo de Luminaria"
                    name="tipo_luminaria"
                    value={formData.tipo_luminaria}
                    onChange={handleInputChange}
                    error={!!errors.tipo_luminaria}
                    helperText={errors.tipo_luminaria}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Precio"
                    name="precio"
                    type="number"
                    value={formData.precio}
                    onChange={handleInputChange}
                    error={!!errors.precio}
                    helperText={errors.precio}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button variant="contained" color="primary" type="submit">
                    Registrar
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegistrarTarifa;
