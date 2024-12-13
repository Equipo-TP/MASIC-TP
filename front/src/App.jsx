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

import GestionarClientes from './pages/Vendedor/GestionarClientes';
import EditarCliente from './pages/Vendedor/EditarCliente';
import VerCliente from './pages/Vendedor/VerCliente';
import GestionarClientesA from './pages/Administrador/GestionarClientesA';

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

import GestionarPresupuestosA from './pages/Administrador/GestionarPresupuestos';
import VerPresupuesto from './pages/Vendedor/VerPresupuesto';
import EditarPresupuesto from './pages/Administrador/EditarPresupuesto';
import GestionarPresupuestos from './pages/Vendedor/GestionarPresupuesto';

import GestionarProyectos from './pages/Administrador/GestionarProyectos'; 
import RegistroPresupuestos from './pages/Administrador/CrearPresupuesto'; 
import VerPresupuestoA from './pages/Administrador/VerPresupuestoA';

import RegistrarProyecto from './pages/Administrador/RegistrarProyecto';
import VerProyecto from './pages/Administrador/VerProyecto';
import VerProyectoTecnico from './pages/Tecnico/VerProyecto';


import GestionarAlmacen from './pages/Administrador/GestionarAlmacen';
import RegistrarAlmacen from './pages/Administrador/RegistrarAlmacen';
import InventarioAlmacen from './pages/Administrador/InventarioMaterial';
import Movimientos from './pages/Administrador/Movimientos';

import GestionarProyectosTecnico from './pages/Tecnico/GestionarProyecto2';
import EditarProyectoTecnico from './pages/Tecnico/EditarProyecto';

import EditarIncidenciasTecnico from './pages/Tecnico/EditarIncidencias';
import VerIncidencias from './pages/Tecnico/VerIncidencias';
import VerIncidenciasAdmin from './pages/Administrador/VerIncidencias';
import Chatbot from './components/Chatbot';


//import GestionarProyectosTecnico from './pages/Tecnico/GestionarProyecto';

import AsignarTecnicosProyecto from './pages/Administrador/AsignarTecnicosProyecto';
import VisualizarCronograma from './pages/Administrador/VisualizarCronograma';


import GestionarCobros from './pages/Administrador/GestionarCobros';
import VerDetallesCobros from './pages/Administrador/VerDetallesCobros';

function App() {
    //const { checkAuth } = useAuth();
  return (
    <UserProvider>
      <BrowserRouter>
      <Chatbot />
      <Routes>

        <Route path='/' element={<LoginPage/>}/>
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

   
        <Route path='/ver_presupuesto/:id' element={<VerPresupuesto />} />  
        <Route path='/editar_presupuesto/:id' element={<EditarPresupuesto />} />
        <Route path='/gestionar_presupuestos' element={<GestionarPresupuestosA/>}/>
        <Route path='/gestionar_proyectos' element={<GestionarProyectos/>}/>
        <Route path='/registro_presupuestos' element={<RegistroPresupuestos/>}/>
        <Route path='/visualizar_presupuesto/:id' element={<VerPresupuestoA />} />
        <Route path='/visualizar_presupuestos' element={<GestionarPresupuestos/>}/>

        <Route path='/gestionar_proyectos' element={<GestionarProyectos/>}/>

        <Route path='/gestionar_almacen' element={<GestionarAlmacen/>}/>
        <Route path='/registro_almacen' element={<RegistrarAlmacen/>}/>
        <Route path='/inventario_almacen/:id' element={<InventarioAlmacen/>}/>
        <Route path='/movimientos_almacen/:id' element={<Movimientos/>}/>


        <Route path='/registrar_proyecto' element={<RegistrarProyecto />} />
        <Route path='/gestionar_proyectos_tecnico' element={<GestionarProyectosTecnico/>}/>

        <Route path='/visualizar_cronograma' element={<VisualizarCronograma/>}/>


        <Route path='/ver_proyectos/:id' element={<VerProyecto/>}/>
        <Route path='/ver_proyectos/:id' element={<VerProyectoTecnico/>}/>
        <Route path='/editar_proyectos/:id' element={<EditarProyectoTecnico/>}/>
        
        <Route path='/ver_incidencias/:id' element={<VerIncidencias/>}/>
        <Route path='/ver_incidencias_admin/:id' element={<VerIncidenciasAdmin/>}/>
        <Route path='/editar_incidencias_tecnico/:id' element={<EditarIncidenciasTecnico/>}/>

        </Route> 
        <Route path='/asignar_tecnicos/:id' element={<AsignarTecnicosProyecto/>}/>   
          
        {/* Gestión de estado de cobro en proyectos */}
        <Route path="/gestionar_estado_cobro" element={<GestionarCobros />} /> 
        <Route path="/proyectos/detalles/:id" element={<VerDetallesCobros/>} />

      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;