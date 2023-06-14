import useSWR, { SWRConfiguration } from "swr";

import { Config } from "@/enums/config";
import { ICalendarioResponse } from "@/interface/calendario-response";
import {
  ICalendarioJugadores,
  Jugadores,
} from "@/interface/calendario-partido-response";

export type CalendarioMoldeado = {
  id: number;
  partido: string;
};

interface Props {
  url: string;
  recurso?: string;
  config?: SWRConfiguration<ICalendarioResponse | ICalendarioJugadores>;
}

export const useCalendario = ({ url, recurso = "", config = {} }: Props) => {
  const { data, error } = useSWR<ICalendarioResponse | ICalendarioJugadores>(
    `${Config.baseUrlApi}/${url}${recurso || ""}`,
    config
  );
  // const { data, error } = useSWR<ICalendarioResponse>(`${Config.baseUrlApi}/${url}`, config)
  function isCalendarioResponse(data: any): data is ICalendarioResponse {
    return data && data.calendario && Array.isArray(data.calendario);
  }

  function isCalendarioJugadores(data: any): data is ICalendarioJugadores {
    return (
      data && data.jugadoresPartido && data.hasOwnProperty("jugadoresPartido")
    );
  }

  const calendarioMoldeado: CalendarioMoldeado[] = isCalendarioResponse(data)
    ? data.calendario.map(({ id, equipoLocal, equipoVisitante }) => ({
        id,
        partido: `${equipoLocal.nombre} VS ${equipoVisitante.nombre}`,
      }))
    : [];

  let jugadores: Jugadores[] = [];

  if (isCalendarioJugadores(data)) {
    jugadores = data.jugadoresPartido.equipoLocal.jugadores.map(
      (jugador) => jugador
    );
    jugadores = [
      ...jugadores,
      ...data.jugadoresPartido.equipoVisitante.jugadores.map(
        (jugador) => jugador
      ),
    ];
  }

  return {
    calendario: isCalendarioResponse(data) ? data : [],
    calendarioMoldeado,
    calendarioPartido: isCalendarioJugadores(data) ? data.jugadoresPartido : {},
    jugadores,
    isLoading: !data && !error,
    error,
  };
};
