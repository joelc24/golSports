import { useCalendario } from "@/hooks/useCalendario";
import { Dropdown } from "primereact/dropdown"
import { classNames } from "primereact/utils";

type Props = {
    idPartido?: number

    onChange: (e: any) => void;
    value: any;
    name: string;

    error?: any;
    invalid: boolean;
};

export type ListOfJugadores = {
    id: number
    nombre: string
}
export const JugadoresDropdwon = ({ name, value, onChange, error, idPartido }: Props) => {

    const { jugadores } = useCalendario({ url: 'calendario', recurso: `/${idPartido}/jugadores`})

    const listOfJugadores = jugadores.map(({id, nombre, apellido}) => ({ id, nombre: `${nombre} ${apellido}` }))

    return (
        <>
            <label htmlFor={name} className={classNames({ 'p-error': error })}></label>
            <span className='p-float-label'>
                <Dropdown
                    id={name}
                    value={value}
                    optionLabel="nombre"
                    placeholder="Seleccione un jugador"
                    emptyMessage="Debe elegir un partido primero"
                    emptyFilterMessage="Lo siento no se encontro el jugador"
                    options={listOfJugadores}
                    onChange={(e) => onChange(e.value)}
                    className={classNames({ 'p-invalid': error })}
                    filter
                />
                <label htmlFor={name}>Jugador</label>
            </span>
        </>
    )
}
