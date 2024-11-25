import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { listar_proyectosRequest} from '../../api/auth';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Layout from '../../components/Layout';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const VisualizarCronograma = () => {
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
                const response = await listar_proyectosRequest();
                const proyectos = response.data.data;

                const eventosFormat = proyectos.flatMap(proyecto =>
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
    }, []);

    return (
        <div className='flex'>
            <Layout/>
            <div className="flex-1">
                <h1 className='font-bold mb-2 text-3xl'>Cronograma de Proyectos</h1>
                <div className="mt-10">
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
