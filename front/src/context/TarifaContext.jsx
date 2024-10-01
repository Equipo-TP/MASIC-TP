import { createContext, useState, useContext } from 'react';
import { listarTarifasRequest, registrarTarifaRequest, editarTarifaRequest, eliminarTarifaRequest } from '../api/tarifas';

const TarifaContext = createContext();

export const useTarifas = () => {
    const context = useContext(TarifaContext);
    if (!context) {
        throw new Error('useTarifas debe ser usado dentro de TarifaProvider');
    }
    return context;
};

export const TarifaProvider = ({ children }) => {
    const [tarifas, setTarifas] = useState([]);

    const listarTarifas = async () => {
        try {
            const res = await listarTarifasRequest();
            setTarifas(res.data.data || res.data);
        } catch (error) {
            console.error('Error al listar tarifas:', error.response ? error.response.data : error.message);
        }
    };

    const registrarTarifa = async (tarifa) => {
        try {
            const res = await registrarTarifaRequest(tarifa);
            setTarifas([...tarifas, res.data]);
        } catch (error) {
            console.error('Error al registrar la tarifa:', error.response ? error.response.data : error.message);
            return error;
        }
    };

    const editarTarifa = async (id, tarifa) => {
        try {
            const res = await editarTarifaRequest(id, tarifa);
            setTarifas(tarifas.map(t => (t._id === id ? res.data : t)));
        } catch (error) {
            console.error('Error al editar la tarifa:', error.response ? error.response.data : error.message);
            return error;
        }
    };

    const eliminarTarifa = async (id) => {
        try {
            await eliminarTarifaRequest(id);
            setTarifas(tarifas.filter((tarifa) => tarifa._id !== id));
        } catch (error) {
            console.error('Error al eliminar la tarifa:', error.response ? error.response.data : error.message);
            return error;
        }
    };

    return (
        <TarifaContext.Provider value={{
            tarifas, listarTarifas, registrarTarifa, editarTarifa, eliminarTarifa
        }}>
            {children}
        </TarifaContext.Provider>
    );
};

