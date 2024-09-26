import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import React, { useEffect } from 'react';

import LoginPage from './pages/Usuario/LoginPage';
import RegistrarUsuario from './pages/Administrador/RegistrarUsuario';
import GestionarUsuarios from './pages/Administrador/GestionarUsuario';
import EditarUsuario from './pages/Usuario/editarUsuario';
import EditUserPage from './pages/Administrador/EditUserPage';
import LoggedUsuario from './pages/Usuario/LoggedUsuario';
import MiPerfil from './pages/Usuario/Miperfil';
import GestionSolicitud from './pages/Administrador/GestionSolicitud'; 
import InfoSolicitud from './pages/Administrador/InfoSolicitud'

function App() {
    //const { checkAuth } = useAuth();
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login_user' element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path='/logged_user' element={<LoggedUsuario />} />
            <Route path='/mi_perfil' element={<MiPerfil />} />
            <Route path='/registrar_usuario' element={<RegistrarUsuario />} />
            <Route path='/gestionar_usuarios' element={<GestionarUsuarios />} />
            <Route path='/editar_usuario/:id' element={<EditUserPage />} />
            <Route path='/registro_user' element={<RegistrarUsuario />} />
            <Route path='/gestionar_usuarios' element={<GestionarUsuarios />} />
            <Route path='/editar_perfil' element={<EditarUsuario />} />
            <Route path='/gestion_solicitud' element={<GestionSolicitud />} /> 
            <Route path='/info_solicitud/:id' element={<InfoSolicitud />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
