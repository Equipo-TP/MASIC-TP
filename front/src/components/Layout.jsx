// Llamar componentes MenuSideBar y NavBar, para ver como sería ver juntos y poder llamar solo este archivo

import React, { useState } from 'react';
import NavBar from './NavBar';
import MenuSideBar from './MenuSideBar';

function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
      <MenuSideBar open={drawerOpen} />
      {/* Otros componentes */}
    </div>
  );
}

export default Layout;
