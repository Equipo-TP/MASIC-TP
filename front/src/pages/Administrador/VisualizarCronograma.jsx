import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { listar_proyectosRequest } from '../../api/auth';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const VisualizarCronograma = () => {
    const { user } = useAuth();
    const [eventos, setEventos] = useState([]);

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales: { es },
    });

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                // Llamar a la API para obtener proyectos
                const response = await listar_proyectosRequest();
                const proyectos = response.data.data;

                let proyectosFiltrados;

                if (user.data.rol === 'Tecnico') {
                    // Filtrar proyectos asignados al técnico logueado
                    proyectosFiltrados = proyectos.filter(proyecto =>
                        proyecto.Horario.some(horario =>
                            horario.Tecnico?.some(tecnico => tecnico._id === user.data._id)
                        )
                    );
                } else if (user.data.rol === 'Administrador') {
                    // No filtrar, mostrar todos los proyectos
                    proyectosFiltrados = proyectos;
                }

                // Formatear los proyectos como eventos
                const eventosFormat = proyectosFiltrados.flatMap(proyecto =>
                    proyecto.Horario.map(horario => ({
                        title: `Proyecto: ${proyecto.Nombre_Proyecto}\nEncargado: ${horario.Tecnico?.[0]?.nombre || 'No asignado'}`,
                        start: new Date(horario.fecha_inicio),
                        end: new Date(horario.fecha_final),
                    }))
                );

                setEventos(eventosFormat);
            } catch (error) {
                console.error('Error al listar proyectos:', error);
            }
        };

        fetchEventos();
    }, [user]);

    return (
        <div className='flex'>
            <Layout />
            <div className="flex-1">
                <h1 className='font-bold mb-2 text-3xl'>Cronograma de Proyectos</h1>
                <h2 className='italic'>Horario de los proyectos que se encuentran programados</h2>
                <div className="mt-5 bg-white p-4 rounded shadow-xl">
                    <Calendar
                        localizer={localizer}
                        events={eventos}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default VisualizarCronograma;
