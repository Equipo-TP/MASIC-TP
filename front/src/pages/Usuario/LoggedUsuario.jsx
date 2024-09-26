import React, { useState } from 'react';
import { Box } from '@mui/material';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';

export function LoggedUsuario() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <MenuSideBar open={drawerOpen} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: drawerOpen ? 300 : 70 }}>
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
        <Box sx={{ mt: 8 }}>
          <div>Usuario logeado con éxito!</div>
        </Box>
      </Box>
    </Box>
  );
}

export default LoggedUsuario;