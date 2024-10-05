import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import React from 'react';
import {zodResolver} from "@hookform/resolvers/zod"; 
import { loginSchema } from '../../Schemas/AUTH';

export function LoginPage() {
  const { signin, isAuthenticated, role } = useAuth();
  const { register, handleSubmit, setError,formState:{errors} } = useForm({resolver:zodResolver(loginSchema)});
  const navigate = useNavigate();

  // Estado para manejar el índice de las imágenes de fondo
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const onSubmit = (data) => 

    
    signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      // Redirige según el rol del usuario
      if (role === 'Administrador') {
        navigate("/logged_user");
      } else if (role === 'Tecnico') {
        navigate("/logged_user");
      } else if (role === 'Vendedor') {
        navigate("/logged_user");
      }
      else {
        alert("Usuario y/o contraseña incorrecto")
      }
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    const images = [
      '/images/luces1.jpg',
      '/images/luces2.jpg',
      '/images/luces3.jpg',
      '/images/luces4.jpg',
      '/images/luces5.jpg',
    ];

    // Cambia la imagen cada 5 segundos con transición suave
    const intervalId = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw', // Asegura que el ancho cubra toda la ventana
        height: '100vh', // Asegura que la altura cubra toda la ventana
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Contenedor de imágenes con efecto de transición */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(/images/luces${backgroundIndex + 1}.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 2s ease-in-out',
          zIndex: 0,
        }}
      />

      {/* Capa para el tono verdoso sobre las imágenes */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 128, 0, 0.2)', // Tono verdoso
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Resto del contenido (el login) */}
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 5,
          width: '100%',
          maxWidth: 350,
          backgroundColor: 'rgba(211, 211, 211, 0.8)', // Fondo gris claro transparente
          backdropFilter: 'blur(5px)', // Efecto de desenfoque para un toque estético
          zIndex: 2,
        }}
      >
        {/* Imagen en lugar del texto */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 2,
          }}
        >
          <img src="/images/logo1.png" alt="Logo" style={{ width: '100%', maxWidth: '180px' }} />
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("email", { required: true })}
          />
          {errors.email?.message && <p className="text-red-700">{errors.email?.message}</p>}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("password", { required: true })}
          />
          {errors.password?.message && <p className="text-red-700">{errors.password?.message}</p>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginPage;
