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
import GestionarSolicitudes from './pages/Vendedor/GestionarSolicitudes';
import RegistroSolicitud from './pages/Vendedor/CrearSolicitud';
import VerSolicitud from './pages/Vendedor/VerSolicitud';
import EditarSolicitud from './pages/Vendedor/EditarSolicitud';
import VerUsuarioPage from './pages/Administrador/VerUsuario';

import GestionSolicitud from './pages/Administrador/GestionSolicitud'; 
import InfoSolicitud from './pages/Administrador/InfoSolicitud'

import RegistrarTarifa from './pages/Administrador/RegistrarTarifa';
import GestionarTarifas from './pages/Administrador/GestionarTarifa';
import EditTarifaPage from './pages/Administrador/EditTarifaPage';

function App() {
    //const { checkAuth } = useAuth();
  return (
    <UserProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/login_user' element={<LoginPage/>}/>       
        <Route element={<PrivateRoute />}>
        <Route path='/logged_user' element={<LoggedUsuario/>}/>
        <Route path='/mi_perfil' element={<MiPerfil/>} />
        <Route path='/registrar_usuario' element={<RegistrarUsuario/>}/>
        <Route path='/gestionar_usuarios' element={<GestionarUsuarios/>}/>
        <Route path='/editar_usuario/:id' element={<EditUserPage/>}/>
        <Route path='/registro_user' element={<RegistrarUsuario/>}/>
        <Route path='/gestionar_usuarios' element={<GestionarUsuarios/>}/>

        <Route path='/ver_usuario/:id' element={<VerUsuarioPage/>}/>
        <Route path='/gestionar_solicitudes' element={<GestionarSolicitudes/>}/>
        <Route path='/registro_solicitud' element={<RegistroSolicitud/>}/>  
        <Route path='/ver_solicitud/:id' element={<VerSolicitud/>}/>
        <Route path='/editar_solicitud/:id' element={<EditarSolicitud/>}/>

        <Route path='/gestion_solicitud' element={<GestionSolicitud />} /> 
        <Route path='/info_solicitud/:id' element={<InfoSolicitud />} />
        <Route path='/registrar_tarifa' element={<RegistrarTarifa />} />
        <Route path='/gestionar_tarifas' element={<GestionarTarifas />} />
        <Route path='/editar_tarifa/:id' element={<EditTarifaPage />} /> 
        </Route>     
      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;
