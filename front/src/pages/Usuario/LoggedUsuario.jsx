import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MenuSideBar from '../../components/MenuSideBar';
import NavBar from '../../components/NavBar';
import Slider from 'react-slick';
import { useAuth } from '../../context/AuthContext'; // Importamos el contexto de autenticación
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function LoggedUsuario() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { name } = useAuth(); // Obtenemos el nombre del usuario autenticado

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
    

  };
  // Datos para el gráfico
  const data = [
    { name: 'Enero', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Febrero', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Marzo', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Abril', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Mayo', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Junio', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Julio', uv: 3490, pv: 4300, amt: 2100 },
  ]; 
 

  // Configuración del carrusel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    appendDots: (dots) => (
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ul style={{ margin: 0, padding: 0 }}>{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          width: '10px',
          height: '10px',
          background: '#fff',
          borderRadius: '50%',
          opacity: 0.8,
        }}
      />
    ),
  };

  const images = [
    '/images/CARRUSEL1.png',
    '/images/CARRUSEL2.png',
    '/images/CARRUSEL3.png',
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Barra lateral */}
      <MenuSideBar open={drawerOpen} />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: drawerOpen ? '300px' : '10px',
          transition: 'margin-left 0.3s ease',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <NavBar onDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />

        {/* Saludo y Carrusel */}
        <Box sx={{ mt: 10, px: 2 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 800,
              color: '#2E2A47',
              fontFamily: 'Georgia, serif',
              letterSpacing: '2px',
              transition: 'color 0.5s ease',
              '&:hover': { color: '#A67C52' },
            }}
          >
            Bienvenido, {name}!
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mt: 2,
              color: '#777',
              fontFamily: 'Arial, sans-serif',
              fontStyle: 'italic',
              transition: 'color 0.3s ease',
              '&:hover': { color: '#A67C52' },
            }}
          >
            Estamos encantados de tenerte en nuestro equipo.
          </Typography>

          {/* Carrusel de imágenes */}
          <Box
            sx={{
              maxWidth: '1400px',
              margin: '0 auto',
              pt: 0,
              position: 'relative',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: '0 15px 60px rgba(0, 0, 0, 0.3)' },
            }}
          >
            <Slider {...carouselSettings}>
              {images.map((src, index) => (
                <div key={index}>
                  <img
                    src={src}
                    alt={`Imagen ${index + 1}`}
                    style={{
                      width: '100%',
                      borderRadius: '10px',
                      maxHeight: '400px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  />
                </div>
              ))}
            </Slider>
          </Box>
        </Box>

        {/* Sección de Servicios */}
        <Box sx={{ mt: 10, px: 2 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 600,
              color: '#2E2A47',
              fontFamily: 'Georgia, serif',
              letterSpacing: '1px',
              transition: 'color 0.5s ease',
              '&:hover': { color: '#A67C52' },
            }}
          >
            Nuestros Servicios
          </Typography>
          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': { boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)' },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                  Instalación Profesional
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
                  Ofrecemos instalaciones de luminarias de alta calidad, adaptadas a las necesidades de nuestros clientes.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': { boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)' },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                  Mantenimiento y Reparación
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
                  Expertos se encargan de brindar ayuda y a mantener las luminarias en perfecto estado.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': { boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)' },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                  Asesoría Especializada
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
                  Nuestro equipo de trabajo asesora a nuestros clientes para elegir las mejores luminarias según su proyecto.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 5, mb: 5, px: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
  {/* Cuadro izquierdo encima del video */}
  <Box sx={{
            position: 'absolute',
            left: 0,
            width: '41%', // Ancho del cuadro izquierdo
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Color negro translúcido
            height: '330px', // Altura igual al video
          }} />
  
  {/* Video centrado */}
  <Box sx={{ width: '60%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
  <video
  src="/videos/MASIC4.mp4"
  autoPlay
  loop
  muted
  playsInline
  style={{
    width: '100%',  // El video ocupará el 100% del contenedor
    maxWidth: '500px', // No superará los 500px de ancho
    height: '330px',  // La altura será fija en 330px
    borderRadius: '10px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.0)', // Sombra suave
    opacity: 0.8,  // Ajusta la opacidad del video (0.7 = 70% opaco, 0 = completamente transparente, 1 = opaco)
  }}
>
  Tu navegador no soporta la etiqueta de video.
</video>

  </Box>

  {/* Cuadro derecho encima del video */}
  <Box sx={{
            position: 'absolute',
            right: 0,
            width: '41%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Color negro translúcido
            height: '330px',
          }} />
</Box>

{/* Gráfico Estadístico */}
<Box
      sx={{
        mt: 4,
        mb: 16,
        px: 3,
        py: 2,
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: 'rgba(128, 128, 128, 0.002)',
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Gráfico Estadístico</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Box>


      </Box>
    </Box>
  );
}

export default LoggedUsuario;
