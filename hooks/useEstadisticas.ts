import { Config } from "@/enums/config";
import { IGoleadores } from "@/interface/goleadores";
import { ITablaPosiciones } from "@/interface/tabla-posiciones";
import { IVallaMenosVencida } from "@/interface/valla-menos-vencida";
import { SWRConfiguration } from "swr"
import useSWR from 'swr';


interface Props {
    url: string
    recurso?: string
    config?: SWRConfiguration
}

export const useEStadisticas = ({ url, recurso, config = {} } : Props) =>{

    const { data, error } = useSWR<ITablaPosiciones | IGoleadores | IVallaMenosVencida>(`${Config.baseUrlApi}/${url}${recurso || ''}`, config)

    function isITablaPosiciones(data: any): data is ITablaPosiciones {

        return data && data.tabla && Array.isArray(data.tabla)
    }

    function isIGoleadores(data: any): data is IGoleadores {

        return data && data.goleadores && Array.isArray(data.goleadores)
    }
    
    function isIVallaMenosVencida(data: any): data is IVallaMenosVencida {

        return data && data.vallaMenosVencida && Array.isArray(data.vallaMenosVencida)
    }

    return {
        tabla: isITablaPosiciones(data) ? data.tabla : [],
        goleadores: isIGoleadores(data) ? data.goleadores : [],
        vallaMenosVencida: isIVallaMenosVencida(data) ? data.vallaMenosVencida : [],
        isLoading: !data && !error,
        error
    }
}