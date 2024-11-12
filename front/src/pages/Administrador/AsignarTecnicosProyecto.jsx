import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editar_proyecto_Request, listarUsuariosPorRolRequest ,listar_proyectosRequest, ver_proyecto_por_idRequest } from '../../api/auth'; // Función para editar la solicitud
import Datetime from 'react-datetime';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';  // Cargar el idioma español
import 'react-datetime/css/react-datetime.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const AsignarTecnicoProyecto = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID de la solicitud desde los parámetros de la URL
    const [proyecto, setProyecto] = useState(null);
    const [tecnicos, setTecnicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventos, setEventos] = useState([]); // Estado para los eventos del calendario

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales: { es }
    });

    // Cargar los datos de la solicitud cuando el componente se monta
    useEffect(() => {
        const fetchProyecto = async () => {
            try {
                const response = await ver_proyecto_por_idRequest(id);
                setProyecto(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener la solicitud:', error);
                setLoading(false);
            }
        };

        const fetchTecnicos = async () => {
            try {
                const response = await listarUsuariosPorRolRequest('Tecnico');
                setTecnicos(response.data.data);
            } catch (error) {
                console.error('Error al listar técnicos:', error);
            }
        };

        const fetchEventos = async () => {
            try {
                const response = await listar_proyectosRequest();
                const proyectos = response.data.data;
                console.log(proyectos)
                const eventosFormat = proyectos.map(proyecto => ({
                    title: `Proyecto: ${proyecto.Nombre_Proyecto} ${proyecto.Horario}`,
                    start: new Date(proyecto.Horario.fecha_inicio),
                    end: new Date(proyecto.Horario.fecha_final)
                    
                }));
                
                console.log(eventosFormat)
                setEventos(eventosFormat);
            } catch (error) {
                console.error('Error al listar proyectos:', error);
            }
        };

        fetchProyecto();
        fetchTecnicos();
        fetchEventos();
    }, [id]);

    const handleFechaInicioChange = (date) => {
        setProyecto({ ...proyecto, horario: { ...proyecto.horario, fecha_inicio: date } });
    };

    const handleFechaFinChange = (date) => {
        setProyecto({ ...proyecto, horario: { ...proyecto.horario, fecha_final: date } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editar_proyecto_Request(id, proyecto); // Asegúrate de que esta función esté implementada
            navigate('/gestionar_proyectos_tecnico'); // Redirige a la ruta deseada después de editar
        } catch (error) {
            console.error('Error al editar proyecto:', error);
            // Manejo de errores si es necesario
        }
    };

    if (loading) {
        return <div>Cargando solicitud...</div>; // Indicador de carga
    }

    return (

        <div className='overflow-y-auto max-h-[1000px]'>
            <form onSubmit={handleSubmit} className="bg-white border-4 rounded-lg shadow relative m-10 p-6 space-y-6">
            
            {/* Titulo y botón de cierre */}
            <div className="flex items-start justify-between border-b rounded-t">
                <h3 className="text-xl font-semibold">Asignar técnicos al Proyecto</h3>
                <button
                    type="button"
                    onClick={() => {
                        //navigate('/gestionar_solicitudes');      // CAMBIAR A VISTA DE GESTIONAR PROYECTOS
                    }}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {/* Formulario */}
            <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                    <label className="text-sm font-medium text-gray-900 block mb-2">Fecha de Inicio</label>
                    <Datetime
                        value={proyecto.Horario.fecha_inicio}
                        onChange={handleFechaInicioChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label className="text-sm font-medium text-gray-900 block mb-2">Fecha de Fin</label>
                    <Datetime
                        value={proyecto.Horario.fecha_final}
                        onChange={handleFechaFinChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    />
                </div>
                
                {/* Select de técnico */}
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="tecnico" className="text-sm font-medium text-gray-900 block mb-2">Técnico</label>
                        <select
                            name="tecnico"
                            id="tecnico"
                            value={proyecto.tecnico || ''}
                            onChange={(e) => setProyecto({ ...proyecto, tecnico: e.target.value })}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            required
                        >
                            <option value="">Seleccione un técnico</option>
                            {tecnicos.map(tecnico => (
                                <option key={tecnico._id} value={tecnico._id}>
                                    {tecnico.nombre} {tecnico.apellidos}
                                </option>
                            ))}
                        </select>
                </div>
            </div>

            {/* Botón de enviar */}
            <div className="flex justify-end">
                <button type="submit" className="bg-green-800 text-white font-semibold py-2 px-4 rounded-lg">
                    Guardar Cambios
                </button>
            </div>

            {/* Calendario para mostrar los proyectos */}
            <div className="mt-10">
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                />
            </div>

        </form>

        </div>
        
    );
};

export default AsignarTecnicoProyecto;
