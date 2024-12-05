import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crearProyectoRequest, listarPresupuestosAprobados,obtener_cliente_por_idRequest,obtener_solicitud_por_idRequest,editarProyectoPorIdRequest , ver_proyecto_por_idRequest, obtenerPresupuestoIDRequest } from '../../api/auth';
import { useForm } from 'react-hook-form';

const VerProyecto = () => {
  const { id } = useParams(); // Obtener el ID del proyecto desde la URL
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState([]);
  const [nuevaIncidencia, setNuevaIncidencia] = useState({
    afectado: '',
    descripcion: '',
    fecha: '',
  });
  const [solicitud, setSolicitud] = useState(null);
  const [cliente, NombreCliente] = useState(null);
  const [presupuesto, setPresupuesto] = useState(null); // Estado para almacenar el proyecto
  const [isLoading, setLoading] = useState(true);
  


useEffect(() => {
  const fetchProyecto = async () => {
    try {
             const token = localStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      };
      const response = await ver_proyecto_por_idRequest(id); // Llama a la API con el ID
      setProyecto(response.data.data); // Guarda los datos del proyecto en el estado
      const response2 = await obtenerPresupuestoIDRequest(response.data.data.ID_Presupuesto_Proyecto._id , headers);
      setPresupuesto(response2.data.data);
      const solicitudResponse = await obtener_solicitud_por_idRequest(response2.data.data.ID_Solicitud_Presupuesto._id);
      setSolicitud(solicitudResponse.data.data);
      const clienteResponse = await obtener_cliente_por_idRequest(solicitudResponse.data.data.cliente._id); 
      setNombreCliente(clienteResponse.data.data);
    } catch (err) {
      
      console.error('Error al obtener el proyecto:', err);
     
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };

  fetchProyecto();
}, [id]);
console.log(proyecto);

const { register, handleSubmit, reset, formState: { errors } } = useForm({
  defaultValues: proyecto,
});
if (isLoading) {
  return <div>Cargando proyecto...</div>;
}

if (!proyecto) {
  return <div>No se encontró el proyecto.</div>;
}
 
console.log(proyecto.nombre)

const onSubmit = async (data) => {
  try {
  
      console.log(data);
      await editarProyectoPorIdRequest(id, data);
    
      alert("Presupuesto actualizado correctamente");
      navigate('/gestionar_presupuestos');
  } catch (error) {
      console.error('Error al actualizar el presupuesto:', error);
  }
};
const handleProyectosChange = (index, field, value) => {
  // Crear una copia del arreglo de incidencias
  const updatedIncidencias = [...proyecto.Incidencias];

  // Actualizar el campo específico en la incidencia correspondiente
  updatedIncidencias[index] = {
    ...updatedIncidencias[index],
    [field]: value,
  };

  // Actualizar el estado del proyecto con las nuevas incidencias
  setProyecto((prevProyecto) => ({
    ...prevProyecto,
    Incidencias: updatedIncidencias,
  }));
};
const handleInputChange = (field, value) => {
  setNuevaIncidencia((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const agregarIncidencia = () => {
  if (!nuevaIncidencia.descripcion || !nuevaIncidencia.fecha) {
    alert('Por favor, complete todos los campos antes de agregar una incidencia.');
    return;
  }

  setProyecto((prevProyecto) => ({
    ...prevProyecto,
    Incidencias: [...prevProyecto.Incidencias, nuevaIncidencia],
  }));

  // Limpiar los campos después de agregar
  setNuevaIncidencia({
    afectado: '',
    descripcion: '',
    fecha: '',
  });
};

const guardarCambios = async () => {
  try {
    await editarProyectoPorIdRequest(id, proyecto);
    alert('Proyecto actualizado correctamente');
    navigate(`/ver_proyectos/${id}`);
  } catch (err) {
    console.error('Error al guardar el proyecto:', err);
  }
};
const tecnicos = proyecto.Horario.flatMap((horario) => horario.Tecnico || []);

 console.log(proyecto.ID_Presupuesto_Proyecto._id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
      
        <h2 className="text-2xl font-bold mb-4">Incidencias del proyecto</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-2">
            <div className="col-span-2">
                <form onSubmit={handleSubmit(onSubmit)}>

                  
                <h3 className="text-lg font-semibold mb-2">Lista de Incidencias</h3>
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-2">Afectado</th>
                      <th className="border px-4 py-2">Descripción</th>
                      <th className="border px-4 py-2">Fecha</th>
                    </tr>
                  </thead>
                  

                  <tbody>
                    
                    {proyecto.Incidencias.map((incidencia, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            value={incidencia.afectado?.nombre + ' ' + incidencia.afectado?.apellidos || ''}
                            
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            value={incidencia.descripcion || ''}
                           
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="date"
                            value={incidencia.fecha ? new Date(incidencia.fecha).toISOString().substr(0, 10) : ''}
                            
                            className="w-full p-2 border rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </form>
              </div>
            </div>
            



            

            <div className="flex justify-between col-span-2">

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Volver
                </button>
                
              </div>
            </div>
          </div>
        
       { 
        /*<AsignarMaterial isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />*/ }
      
      </div>
      
    </div>
  );
};

export default VerProyecto
