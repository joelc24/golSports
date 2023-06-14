import { useCalendario } from "@/hooks/useCalendario";
import { Dropdown } from "primereact/dropdown"
import { classNames } from "primereact/utils";

type Props = {
    onChange: (e: any) => void;
    value: any;
    name: string;

    error?: any;
    invalid: boolean;
};

export const PartidoDropDown = ({ name, value, onChange, error }: Props) => {

    const { calendarioMoldeado } = useCalendario({ url: 'calendario' })

    return (
        <>
            <label htmlFor={name} className={classNames({ 'p-error': error })}></label>
            <span className='p-float-label'>
                <Dropdown
                    id={name}
                    value={value}
                    optionLabel="partido"
                    placeholder="Seleccione un partido"
                    options={calendarioMoldeado}
                    onChange={(e) => onChange(e.value)}
                    className={classNames({ 'p-invalid': error })}
                    filter
                />
                <label htmlFor={name}>Partido</label>
            </span>

        </>
    )
}
