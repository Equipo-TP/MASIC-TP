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
    const [nuevoHorario, setNuevoHorario] = useState({
        fecha_inicio: '',
        fecha_final: '',
        Tecnico: [] // Puede ser vacío si no se ha seleccionado técnico
    });

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
        
                const eventosFormat = proyectos.flatMap(proyecto => 
                    proyecto.Horario.map(horario => ({
                        title: `Proyecto: ${proyecto.Nombre_Proyecto}`,  // El título sigue siendo el nombre del proyecto
                        start: new Date(horario.fecha_inicio),  // Fecha de inicio
                        end: new Date(horario.fecha_final)  // Fecha final
                    }))
                );
        
                setEventos(eventosFormat);  // Establece los eventos para el calendario
            } catch (error) {
                console.error('Error al listar proyectos:', error);
            }
        };

        fetchProyecto();
        fetchTecnicos();
        fetchEventos();
    }, [id]);

    const handleFechaInicioChange = (date) => {
        setNuevoHorario({ ...nuevoHorario, fecha_inicio: date });
    };

    const handleFechaFinChange = (date) => {
        setNuevoHorario({ ...nuevoHorario, fecha_final: date });
    };

    const handleTecnicoChange = (e) => {
        const tecnicoId = e.target.value;
        console.log('Técnico seleccionado:', tecnicoId); // Verifica el valor
        setNuevoHorario({
            ...nuevoHorario,
            Tecnico: [tecnicoId] // Reemplaza con el ID del técnico seleccionado
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nuevoHorario.fecha_inicio && nuevoHorario.fecha_final && nuevoHorario.Tecnico) {
            const updatedProyecto = {
                ...proyecto,
                Horario: [...proyecto.Horario, nuevoHorario] // Agrega el nuevo horario al proyecto
            };

            try {
                await editar_proyecto_Request(id, updatedProyecto); // Asegúrate de que esta función esté implementada
                //navigate('/gestionar_proyectos_tecnico');  // O cualquier otra redirección que necesites
                console.log('Funciono')
            } catch (error) {
                console.error('Error al editar proyecto:', error);
            }
        } else {
            alert('Por favor complete todos los campos del horario');
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
                        value={nuevoHorario.fecha_inicio}
                        onChange={handleFechaInicioChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label className="text-sm font-medium text-gray-900 block mb-2">Fecha de Fin</label>
                    <Datetime
                        value={nuevoHorario.fecha_final}
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
                            onChange={handleTecnicoChange}
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
