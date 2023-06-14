import useSWR, { SWRConfiguration } from 'swr';

import { ICiudadResponse } from '@/interface/ciudad-response';
import { Config } from '@/enums/config';



export const useCiudades = (url: string, config: SWRConfiguration = {}) => {
    const { data, error } = useSWR<ICiudadResponse[]>(`${Config.baseUrlApi}/${url}`, config)
    

    // const ciudades = data?.map(city => city)

    return {
        ciudades: data || [],
        isLoading: !data && !error,
        error
    }
}
