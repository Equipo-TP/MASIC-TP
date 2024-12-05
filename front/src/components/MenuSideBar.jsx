import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import BudgetIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Storefront';
import ProjectIcon from '@mui/icons-material/Assignment';
import ClientIcon from '@mui/icons-material/People';
import PersonnelIcon from '@mui/icons-material/Work';
import RateIcon from '@mui/icons-material/LocalOffer';
import StateIcon from '@mui/icons-material/Assessment';
import CalendarIcon from '@mui/icons-material/CalendarToday';

const drawerWidth = 275;
const collapsedWidth = 70;

function MenuSideBar({ open }) {
  const navigate = useNavigate();
  const { role } = useAuth(); // Obtén el rol del usuario desde AuthContext

  // Definir los ítems del menú y los roles permitidos para cada uno
  const menuItems = [
    { icon: <GroupIcon />, text: 'Ver solicitudes', path: '/gestion_solicitud', roles: ['Administrador'] },
    { icon: <BudgetIcon />, text: 'Gestionar presupuestos', path: '/gestionar_presupuestos', roles: ['Administrador'] },
    { icon: <BudgetIcon />, text: 'Gestionar presupuestos', path: '/visualizar_presupuestos', roles: ['Vendedor'] },
    { icon: <ProjectIcon />, text: 'Gestionar proyectos', path: '/gestionar_proyectos', roles: ['Administrador'] },
    { icon: <ClientIcon />, text: 'Gestionar clientes', path: '/gestionar_clientes', roles: ['Vendedor'] },
    { icon: <RateIcon />, text: 'Gestionar tarifas', path: '/gestionar_tarifas', roles: ['Administrador'] },
    { icon: <ProjectIcon />, text: 'Gestionar proyectos', path: '/gestionar_proyectos_tecnico', roles: ['Tecnico'] },
    { icon: <StateIcon />, text: 'Gestionar estado de cobro', path: '/gestionar_estado_cobro', roles: ['Administrador', 'Vendedor'] },
    { icon: <CalendarIcon />, text: 'Visualizar cronograma', path: '/visualizar_cronograma', roles: ['Administrador', 'Tecnico'] },
    { icon: <ProjectIcon />, text: 'Gestionar solicitudes', path: '/gestionar_solicitudes', roles: ['Vendedor'] },
    { icon: <ProjectIcon />, text: 'Visualizar clientes', path: '/visualizar_clientes', roles: ['Administrador'] },
    { icon: <InventoryIcon />, text: 'Gestionar Almacén', path: '/gestionar_almacen', roles: ['Administrador'] },
    { icon: <PersonIcon />, text: 'Gestionar usuario', path: '/gestionar_usuarios', roles: ['Administrador'] },

  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open
      sx={{
        display: open ? 'block' : 'none',
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          height: '100vh',
          transition: 'width 0.3s ease',
          backgroundColor: 'black',
          color: 'white',
        },
        '@media (min-width: 768px)': {
          display: 'block', // Siempre visible en pantallas mayores a 767px
        },
      }}
      
    >
      {/* Código del logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '64px',
          padding: '0 18px',
          justifyContent: 'flex-start',
          position: 'fixed',
          top: 0,
          width: open ? drawerWidth : collapsedWidth,
          zIndex: 1300,
          backgroundColor: 'rgba(0, 0, 0, 0.0)',
        }}
      >
        {/* Imagen logo2.2 siempre visible */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            //marginRight: '20px',
          }}
        >
          <img
            src="/images/logo2.2.png"
            alt="Logo 2.2"
            style={{
              width: '30px',
              height: 'auto',
            }}
          />
        </Box>

        {/* Imagen logo1.2 al centro */}
        <Box
          sx={{
            display: open ? 'flex' : 'none',
            alignItems: 'center',
            marginLeft: '20px',
          }}
        >
          <img
            src="/images/logo1.2.png"
            alt="Masic S.A.C."
            style={{
              width: '110px',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>

      </Box>
      
      <Box
        sx={{
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}
        className="scrollbar-container"
      >
        <List
          sx={{
            paddingLeft: 0,
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
          }}
        >
          {menuItems
            .filter(({ roles }) => roles.includes(role)) // Filtra los ítems según el rol del usuario
            .map(({ icon, text, path }, index) => (
              <ListItem
                button
                key={index}
                sx={{ padding: '8px 8px', height: '56px', cursor: 'pointer' }}
                onClick={() => navigate(path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    '& svg': {
                      fontSize: '24px',
                    },
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    display: open ? 'block' : 'none',
                    marginLeft: '8px',
                    color: 'white',
                  }}
                />
              </ListItem>
            ))}
        </List>
      </Box>

    </Drawer>
  );
}

export default MenuSideBar;