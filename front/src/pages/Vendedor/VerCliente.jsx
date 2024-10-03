import React, { useEffect, useState } from "react";
import { obtenerClienteConSolicitudesRequest } from "../../api/auth"; // Asegúrate de que esta ruta sea correcta

const VerCliente = ({ match }) => {
  const [cliente, setCliente] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const clienteId = match.params.id;

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const data = await obtenerClienteConSolicitudesRequest(clienteId);
        setCliente(data.data.data); // Ajusta según la estructura de los datos
        setSolicitudes(data.data.solicitudes || []); // Asegúrate de manejar el caso donde no haya solicitudes
      } catch (error) {
        console.error("Error al obtener el cliente:", error);
      }
    };

    fetchCliente();
  }, [clienteId]);

  if (!cliente) return <div>Cargando...</div>; // Mensaje mientras carga

  return (
    <div>
      <h1>{cliente.nombre}</h1>
      <h2>Solicitudes</h2>
      <ul>
        {solicitudes.length > 0 ? (
          solicitudes.map((solicitud) => (
            <li key={solicitud._id}>{solicitud.descripcion}</li> // Asegúrate de que 'descripcion' sea un campo existente en tus solicitudes
          ))
        ) : (
          <li>No hay solicitudes disponibles.</li>
        )}
      </ul>
    </div>
  );
};

export default VerCliente;
