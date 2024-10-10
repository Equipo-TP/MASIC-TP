import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import React, { useEffect } from 'react';

import LoginPage from './pages/Usuario/LoginPage';
import RegistrarUsuario from './pages/Administrador/RegistrarUsuario';
import GestionarUsuarios from './pages/Administrador/GestionarUsuario';
import EditUserPage from './pages/Administrador/EditUserPage';
import LoggedUsuario from './pages/Usuario/LoggedUsuario';
import MiPerfil from './pages/Usuario/Miperfil';
import GestionarClientes from './pages/Vendedor/GestionarClientes';
import EditarCliente from './pages/Vendedor/EditarCliente';
import VerCliente from './pages/Vendedor/VerCliente';
import GestionarClientesA from './pages/Administrador/GestionarClientesA';

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
        <Route path='/gestionar_clientes' element={<GestionarClientes/>}/>
        <Route path='/editar_cliente/:id' element={<EditarCliente/>}/>
        <Route path='/ver_cliente/:id' element={<VerCliente/>}/>
        <Route path='/visualizar_clientes' element={<GestionarClientesA/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App