import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

const RegistrarUsuario = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    dni: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    rol: '' // Valor inicial vacío
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    dni: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    rol: ''
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

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      rol: value
    });
    validateField('rol', value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        setErrors({
          ...errors,
          nombre: value.trim() === '' ? 'Nombre requerido' : ''
        });
        break;
      case 'apellidos':
        setErrors({
          ...errors,
          apellidos: value.trim() === '' ? 'Apellidos requeridos' : ''
        });
        break;
      case 'email':
        setErrors({
          ...errors,
          email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email inválido'
        });
        break;
      case 'dni':
        setErrors({
          ...errors,
          dni: /^\d{8}$/.test(value) ? '' : 'DNI debe tener exactamente 8 dígitos numéricos'
        });
        break;
      case 'telefono':
        setErrors({
          ...errors,
          telefono: /^\d{9}$/.test(value) ? '' : 'Teléfono debe tener exactamente 9 dígitos numéricos'
        });
        break;
      case 'password':
        setErrors({
          ...errors,
          password: value.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres'
        });
        break;
      case 'confirmPassword':
        setErrors({
          ...errors,
          confirmPassword: value === formData.password ? '' : 'Las contraseñas no coinciden'
        });
        break;
      case 'rol':
        setErrors({
          ...errors,
          rol: value.trim() === '' ? 'Rol requerido' : ''
        });
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};
    
    // Validar cada campo si está vacío
    Object.keys(formData).forEach(field => {
      if (formData[field].trim() === '') {
        newErrors[field] = 'Campo requerido';
        valid = false;
      } else {
        newErrors[field] = '';
      }
    });

    // Validar los campos existentes (como email o contraseñas)
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
      if (errors[field]) valid = false; // Si hay errores, no es válido
    });

    setErrors(newErrors); // Actualizar los errores en el estado
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:8000/api/registro_usuario', formData);
        console.log('Usuario registrado con éxito:', response.data);
        if (response.data.data) {
          setSnackbarMessage('Usuario registrado con éxito!');
          setSnackbarSeverity('success');
          navigate('/gestionar_usuarios');
        } else {
          alert('Ya existe un usuario registrado con los mismos datos');
        }
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        setSnackbarMessage('Error al registrar el usuario.');
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
        nombre: '',
        apellidos: '',
        email: '',
        dni: '',
        telefono: '',
        password: '',
        confirmPassword: '',
        rol: ''
      });
      navigate('/gestionar_usuarios');
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
            Registrar Nuevo Usuario
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
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    error={!!errors.apellidos}
                    helperText={errors.apellidos}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="DNI"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    error={!!errors.dni}
                    helperText={errors.dni}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.rol}>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      name="rol"
                      label="Rol"
                      value={formData.rol}
                      onChange={handleRoleChange}
                    >
                      <MenuItem value="" disabled>
                        Selecciona un rol
                      </MenuItem>
                      <MenuItem value="usuario">Usuario</MenuItem>
                      <MenuItem value="administrador">Administrador</MenuItem>
                      <MenuItem value="tecnico">Técnico</MenuItem>
                    </Select>
                    {errors.rol && (
                      <Typography variant="caption" color="error">
                        {errors.rol}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                </Grid>
              </Grid>
              <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}> 
                <Button type="submit" variant="contained" color="primary">
                  Registrar
                </Button>
                <Button onClick={handleCancel} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                  Cancelar
                </Button>
              </Box>
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
};

export default RegistrarUsuario;
