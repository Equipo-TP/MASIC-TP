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

      {/* Overlay para pantallas pequeñas */}
      {drawerOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
            drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={handleDrawerToggle}
        />
      )}
    </div>
  );
}

export default Layout;
