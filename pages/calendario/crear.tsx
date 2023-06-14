import { useState } from 'react';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next'

import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useForm, Controller } from 'react-hook-form';

import { fetcher } from '@/helpers/fetch';
import { Config } from '@/enums/config';
import { IEquipo, IEquipoResponse } from '@/interface/equipo-response';
import { useEquipos } from '@/hooks/useEquipos';

type Fecha = {
    code: number
    nombre: string
}

type FormData = {
    fecha: Fecha
    fechaPartido: Date | null
    hora: Date | null
    equipoLocal: IEquipo
    equipoVisitante: IEquipo
}

interface Props {
    dataEquipos: IEquipoResponse
}
let code = 0
const fechas: Fecha[] = Array(19).fill(0).map(() => {
    code += 1

    return { code, nombre: `Fecha ${code}` }
})

const CrearPartido: NextPage<Props> = ({ dataEquipos }) => {

    const [filteredEquiposLocal, setFilteredEquiposLocal] = useState<IEquipo[]>([])
    const [filteredEquiposVisitante, setFilteredEquiposVisitante] = useState<IEquipo[]>([])
    const { equipos } = useEquipos({ url: 'equipos', config: {
        fallbackData: dataEquipos,
        revalidateOnMount: true
    } })

    const { handleSubmit, control, formState: { errors } } = useForm<FormData>()


    const getFormErrorMessage = (name: keyof FormData) => {
        return errors[name] ? (<small className="p-error">{errors[name]?.message}</small>) : (<small className="p-error">&nbsp;</small>);
    };

    const searchLocal = (event: AutoCompleteCompleteEvent) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredEquipos;

            if (!event.query.trim().length) {
                _filteredEquipos = [...equipos];
            }
            else {
                _filteredEquipos = equipos.filter((city) => {
                    return city.nombre.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredEquiposLocal(_filteredEquipos);
        }, 250);
    }
    const searchVisitante = (event: AutoCompleteCompleteEvent) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredEquipos;

            if (!event.query.trim().length) {
                _filteredEquipos = [...equipos];
            }
            else {
                _filteredEquipos = equipos.filter((city) => {
                    return city.nombre.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredEquiposVisitante(_filteredEquipos);
        }, 250);
    }
    const onSubmit = (data: FormData) => {
        console.log(data)
    }


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Pagina de Registro</h5>
                    <p>En esta pagina se podran crear todos los partidos de la liga.</p>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <h5>Formulario de ingreso</h5>
                    <form className="p-fluid formgrid grid" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="fecha"
                                control={control}
                                defaultValue={undefined}
                                rules={{ required: 'La fecha es requerida' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.fecha })}></label>
                                        <span className="p-float-label">
                                            <Dropdown
                                                id={field.name}
                                                value={field.value}
                                                optionLabel="nombre"
                                                placeholder="Seleccione una fecha"
                                                options={fechas}
                                                focusInputRef={field.ref}
                                                onChange={(e) => field.onChange(e.value)}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                            />
                                            <label htmlFor={field.name}>Fecha</label>
                                        </span>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="fechaPartido"
                                control={control}
                                rules={{
                                    required: 'La fecha del partido es requerida'
                                }}
                                defaultValue={undefined}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.fechaPartido })}></label>
                                        <span className='p-float-label'>
                                        <Calendar
                                                id={field.name}
                                                value={field.value}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                dateFormat='dd/mm/yy'
                                            />
                                            <label htmlFor={field.name}>Fecha del partido</label>
                                        </span>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="hora"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                defaultValue={undefined}
                                render={({ field: { value, onChange, name }, fieldState }) => (
                                    <>
                                        <label htmlFor={name} className={classNames({ 'p-error': fieldState.error })}></label>
                                        <span className='p-float-label'>
                                        <Calendar
                                                id={name}
                                                value={value}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                onChange={(e) => onChange(e.target.value)}
                                                timeOnly
                                            />
                                            <label htmlFor={name}>{ name }</label>
                                        </span>
                                        {getFormErrorMessage(name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className='field col-12 md:col-6'>
                            <Controller
                                name='equipoLocal'
                                control={control}
                                rules={{ required: 'El equipo local es requerido' }}
                                defaultValue={undefined}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': fieldState.error })}></label>
                                        <span className='p-float-label'>
                                        <AutoComplete
                                                field="nombre"
                                                value={field.value}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                suggestions={filteredEquiposLocal}
                                                completeMethod={searchLocal} onChange={(e) => field.onChange(e.value)}
                                                scrollHeight='200px' virtualScrollerOptions={{ itemSize: 40 }} forceSelection
                                            />
                                            <label htmlFor={field.name}>Equipo local</label>
                                        </span>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className='field col-12 md:col-6'>
                            <Controller
                                name='equipoVisitante'
                                control={control}
                                rules={{ required: 'El equipo visitante es requerido' }}
                                defaultValue={undefined}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': fieldState.error })}></label>
                                        <span className='p-float-label'>
                                        <AutoComplete
                                                field="nombre"
                                                value={field.value}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                suggestions={filteredEquiposVisitante}
                                                completeMethod={searchVisitante} onChange={(e) => field.onChange(e.value)}
                                                scrollHeight='200px' virtualScrollerOptions={{ itemSize: 40 }} forceSelection
                                            />
                                            <label htmlFor={field.name}>Equipo visitante</label>
                                        </span>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <Button type='submit' label="Submit"></Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CrearPartido

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const url = `${Config.baseUrlApi}/equipos`

    const dataEquipos: IEquipoResponse = await fetcher(url)

    return {
        props: {
            dataEquipos
        }
    }
}