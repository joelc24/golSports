import useSWR, { SWRConfiguration, mutate } from 'swr';
import { Config } from '@/enums/config';
import { IEquipo, IEquipoCreate, IEquipoResponse } from '@/interface/equipo-response';
import { apiLiga } from '@/helpers/apiLiga';

interface Props {
    url: string
    recurso?: string
    config?: SWRConfiguration<IEquipoResponse, any>
}


export const useEquipos = ({ url, recurso = '', config = {} }: Props) => {

    const { data, error, } = useSWR<IEquipoResponse>(`${Config.baseUrlApi}/${url}${recurso || ''}`, config)

    function isEquipoResponse(data: any): data is IEquipoResponse {
        return data && data.equipos && Array.isArray(data.equipos)
    }

    const crearEquipo = async (equipo: IEquipoCreate) => {
        try {

            const equipoFromDb = await apiLiga.post<IEquipo>('/equipos', equipo)

            mutate(`${Config.baseUrlApi}/equipos`, isEquipoResponse(data) ? [...data.equipos, equipoFromDb] : data, false)
        } catch (error) {
            throw error
        }
    } 

    return {
        equipos: data?.equipos || [],
        isLoading: !data && !error,
        error,

        //* Metodos
        crearEquipo
    }
}
