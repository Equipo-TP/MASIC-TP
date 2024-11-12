import { createContext, useState, useContext, useEffect} from "react";
import { editarUserRequest, loginRequest } from "../api/auth";

export const UserContext = createContext();
export const useAuth = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de UserProvider");
    }
    return context;
};

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);  // Nuevo estado para almacenar el rol
    const [name, setName] = useState(null);
    //función para manejar el login
    const signin = async (user) => {
        try {
          const res = await loginRequest(user);
          if (res.status === 200) {
            const userData = res.data;
            if (userData) {
                setUser(userData);
                setIsAuthenticated(true);
                setRole(userData.role);  // Guardar el rol del usuario
                setName(userData.name);
                localStorage.setItem('token', userData.token); // Guarda el token
                localStorage.setItem('user', JSON.stringify(userData));  // Guardar datos del usuario
               return { user: userData, role: userData.role, name: userData.name};
            } else {
                setIsAuthenticated(false);
            }
           }
        } catch (error) {
           console.log(error);
        }
      };

       // Función manejar registro
    const registerUser = async (user) => {
        try {
            const res = await registrousuarioRequest(user);
            if (res.status === 200) {
              const userData = res.data;
                  if (userData) {
                      setUser(userData);
                      setIsAuthenticated(true);
                    //  setRole(userData.role);  // Guardar el rol del usuario
                    //  localStorage.setItem('token', userData.token); // Guarda el token // AVERIGUAR SI ES NECESARIO
                  } else {
                      setIsAuthenticated(false);
                  }
             }
          } catch (error) {
             console.log(error);
             setErrors(error);
          }
    };
    
    // Función para verificar si el usuario ya está autenticado al cargar la aplicación
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            setRole(userData.role);  // Cargar el rol desde localStorage
            setName(userData.name);
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('token');  // Eliminar el token de localStorage
        localStorage.removeItem('user');   // Eliminar los datos del usuario de localStorage
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
        setName(null);
    };
    //funcion para manejar la actualizacion del usuario
    const updateUser = async(id,user)=>{
        try{
            await editarUserRequest(id,user);
            setIsAuthenticated(true);
        } catch(error){
            console.log(error.response);
            console.log("Error");
        }
    };


    // Usar useEffect para chequear la autenticación al cargar la app
    useEffect(() => {
        checkAuth();
    }, []);  // Se ejecuta una sola vez cuando el componente se monta

    return (
        <UserContext.Provider value = {{user, setUser, isAuthenticated, role, name, registerUser, signin, checkAuth, logout, updateUser}}>
            {children}
        </UserContext.Provider>
    )
}