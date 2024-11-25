import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

const RegistrarCobros = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [vendedora, setVendedora] = useState('');
  const [cliente, setCliente] = useState('');
  const [servicio, setServicio] = useState('');
  const [totalCobrado, setTotalCobrado] = useState(0);
  const [saldoRestante, setSaldoRestante] = useState(0);
  const [estado, setEstado] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState(new Date().toISOString());
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const registrarCobro = async () => {
    if (!vendedora || !cliente || !servicio || totalCobrado <= 0 || saldoRestante < 0 || !estado) {
      setSnackbarMessage('Complete todos los campos correctamente');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    const data = {
      vendedora,
      cliente,
      servicio,
      totalCobrado,
      saldoRestante,
      estado,
      fecha_registro: fechaRegistro,
    };

    try {
      await axios.post('http://localhost:8000/api/cobro/registro_cobro', data);
      setSnackbarMessage('Cobro registrado correctamente');
      setSnackbarSeverity('success');
      setVendedora('');
      setCliente('');
      setServicio('');
      setTotalCobrado(0);
      setSaldoRestante(0);
      setEstado('');
      setFechaRegistro(new Date().toISOString());
      setOpenSnackbar(true);

      // Redirigir automáticamente a la página de gestionar cobros
      setTimeout(() => {
        navigate('/gestionar_estado_cobro');
      }, 1500); // Espera 1.5 segundos antes de redirigir
    } catch (error) {
      console.error('Error al registrar el cobro:', error.response?.data || error.message);
      setSnackbarMessage('Error al registrar el cobro');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('¿Estás seguro de que deseas cancelar el registro? Todos los datos no guardados se perderán.');
    if (confirmCancel) {
      setVendedora('');
      setCliente('');
      setServicio('');
      setTotalCobrado(0);
      setSaldoRestante(0);
      setEstado('');
      navigate('/gestionar_estado_cobro');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleFechaChange = (e) => {
    const selectedDate = e.target.value;
    const currentTime = new Date().toISOString().substring(11, 19);
    setFechaRegistro(`${selectedDate}T${currentTime}`);
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
            Registrar Nuevo Cobro
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
                    label="Vendedora"
                    value={vendedora}
                    onChange={(e) => setVendedora(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cliente"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Servicio"
                    value={servicio}
                    onChange={(e) => setServicio(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Cobrado"
                    type="number"
                    value={totalCobrado}
                    onChange={(e) => setTotalCobrado(Number(e.target.value))}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Saldo Restante"
                    type="number"
                    value={saldoRestante}
                    onChange={(e) => setSaldoRestante(Number(e.target.value))}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button variant="contained" color="primary" onClick={registrarCobro}>
                    Registrar Cobro
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

export default RegistrarCobros;
