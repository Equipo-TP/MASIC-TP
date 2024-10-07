import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, TextField, Typography, Grid, Paper, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerUserRequest } from '../../api/auth';
import Button from '@mui/material/Button';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

function VerUsuarioPage() {
  const { id } = useParams(); // Obtener el ID del usuario de la URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga para mostrar el spinner mientras se cargan los datos
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Obtener datos del usuario
  useEffect(() => {
    const obtUsuario = async () => {
      try {
        const res = await obtenerUserRequest(id); // API para obtener datos del usuario
        const userData = res.data.data;
        setUser(userData);
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
  }, [id]);

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
          <Typography variant="h4" gutterBottom>Ver Usuario</Typography>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={user?.nombre || ''}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellidos"
                  value={user?.apellidos || ''}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email || ''}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="DNI"
                  value={user?.dni || ''}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={user?.telefono || ''}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Rol"
                    value={user?.rol || ''}
                    InputProps={{
                    readOnly: true,
                    }}
                />
                </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" color="secondary" onClick={() => navigate('/gestionar_usuarios')}>
                  Volver
                </Button>
              </Grid>
            </Grid>
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

export default VerUsuarioPage;
