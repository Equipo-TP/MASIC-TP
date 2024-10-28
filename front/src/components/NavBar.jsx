import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Tooltip, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NavBar({ onDrawerToggle, drawerOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, role, name, logout} = useAuth();
  const navigate = useNavigate();  // Hook para redireccionar

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMiPerfil = () => {
    navigate('/mi_perfil')
    console.log(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login_user'); // Redirige a la página de inicio de sesión después de cerrar sesión
    };
    
  return (
    <AppBar
      position="fixed"
      sx={{
        width: drawerOpen ? 'calc(100% - 300px)' : 'calc(100% - 70px)', // Ancho dinámico
        ml: drawerOpen ? '300px' : '70px', // Margen izquierdo dinámico
        backgroundColor: '#004d40',
        height: '64px',
        transition: 'width 0.3s ease, margin-left 0.3s ease',
        // Cambiar estilos cuando la resolución es menor a 768px
        '@media (max-width: 767px)': {
          width: drawerOpen ? 'calc(100% - 300px)' : '100%', // Ancho total cuando el tamaño es menor a 768px
          ml: '0px', // Sin margen izquierdo
        },
      }}
    >
      
      <Toolbar>
        {/* Ícono del menú */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Espacio flexible para alinear a la derecha */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Información del usuario y logo a la derecha */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
            {name ? `${name}`: ''} / {role ? `${role}`: ''}
          </Typography>
          <Tooltip title="Abrir menú de usuario">
            <IconButton
              edge="end"
              color="inherit"
              aria-label="user-menu"
              onClick={handleMenuClick}
              sx={{ ml: 2 }}
            >
              <AccountCircleIcon sx={{ fontSize: 36 }} /> {/* Tamaño más grande */}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          mt: '6px', // Ajusta esto según la altura de tu AppBar
          '& .MuiMenu-paper': {
            marginTop: '8px', // Espacio entre el AppBar y el menú
          },
        }}
      >
        <MenuItem onClick={handleMiPerfil}>Perfil</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
      </Menu>
    </AppBar>
  );
}

export default NavBar;
