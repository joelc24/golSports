import { useState } from 'react';
import { GetStaticProps, NextPage } from 'next'

import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useForm, Controller } from 'react-hook-form';

import { useEquipos } from '@/hooks/useEquipos';
import { fetcher } from '@/helpers/fetch';
import { Config } from '@/enums/config';
import { IEquipo, IEquipoResponse } from '@/interface/equipo-response';
import { IPosicionJugadores, IPosicion } from '@/interface/posiciones-response';

type FormData = {
    nombre: string
    apellido: string
    fechaNacimiento: string | undefined
    equipo: IEquipo
    posicion: IPosicion
}

interface Props {
    data: IEquipoResponse,
    posicionJugadores: IPosicionJugadores
}

const RegistroJugadores: NextPage<Props> = ({ data, posicionJugadores: { posiciones } }) => {

    const [filteredEquipos, setFilteredEquipos] = useState<IEquipo[]>([])

    const { equipos } = useEquipos({ url: 'equipos', config: {
        fallbackData: data
    } })

    const { handleSubmit, control, formState: { errors } } = useForm<FormData>()

    const getFormErrorMessage = (name: keyof FormData) => {
        return errors[name] ? (<small className="p-error">{errors[name]?.message}</small>) : (<small className="p-error">&nbsp;</small>);
    };

    const search = (event: AutoCompleteCompleteEvent) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredEquipos;

            if (!event.query.trim().length) {
                _filteredEquipos = [...equipos];
            }
            else {
                _filteredEquipos = equipos.filter((equipo) => {
                    return equipo.nombre.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredEquipos(_filteredEquipos);
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
                    <p>En esta pagina se podran registrar todos los jugadores a participar en la liga.</p>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <h5>Formulario de ingreso</h5>
                    <form className="p-fluid formgrid grid" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="nombre"
                                control={control}
                                defaultValue=''
                                rules={{ required: 'El nombre es requerido' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.nombre })}></label>
                                        <span className="p-float-label">
                                            <InputText id={field.name} value={field.value} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                            <label htmlFor={field.name}>Nombre</label>
                                        </span>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="apellido"
                                control={control}
                                rules={{
                                    required: 'El apellido es requerido',
                                    minLength: { value: 3, message: 'El apellido debe contener minimo tres caracteres' }
                                }}
                                defaultValue=''
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.apellido })}></label>
                                        <span className='p-float-label'>
                                            <InputText
                                                id={field.name}
                                                value={field.value}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                            <label htmlFor={field.name}>Apellido</label>
                                        </span>
                                        {getFormErrorMessage('apellido')}
                                    </>
                                )}
                            />
                        </div>
                        <div className='field col-12 md:col-6'>
                            <Controller
                                name='fechaNacimiento'
                                control={control}
                                rules={{ required: 'La fecha de nacimiento del jugador es requerida' }}
                                defaultValue={undefined}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': fieldState.error })}></label>
                                        <span className='p-float-label'>
                                            <Calendar
                                                id={field.name}
                                                value={field.value}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                dateFormat='dd/mm/yy'
                                            />
                                            <label htmlFor={field.name}>Fecha de nacimiento</label>
                                        </span>
                                        {getFormErrorMessage('fechaNacimiento')}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="equipo"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                defaultValue={undefined}
                                render={({ field: { value, onChange, name }, fieldState }) => (
                                    <>
                                        <label htmlFor={name} className={classNames({ 'p-error': fieldState.error })}></label>
                                        <span className='p-float-label'>
                                            <AutoComplete
                                                field="nombre"
                                                value={value}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                suggestions={filteredEquipos}
                                                completeMethod={search} onChange={(e) => onChange(e.value)}
                                                scrollHeight='200px' virtualScrollerOptions={{ itemSize: 40 }} forceSelection
                                            />
                                            <label htmlFor={name}>equipo</label>
                                        </span>
                                        {getFormErrorMessage('equipo')}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="posicion"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                defaultValue={undefined}
                                render={({ field: { value, onChange, name, ref }, fieldState }) => (
                                    <>
                                        <label htmlFor={name} className={classNames({ 'p-error': fieldState.error })}></label>
                                        <span className='p-float-label'>
                                            <Dropdown
                                                id={name}
                                                value={value}
                                                optionLabel="nombre"
                                                placeholder="Seleccione una posicion"
                                                options={posiciones}
                                                focusInputRef={ref}
                                                onChange={(e) => onChange(e.value)}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                            />
                                            <label htmlFor={name}>Posiocion, ej: portero</label>
                                        </span>
                                        {getFormErrorMessage('posicion')}
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

export default RegistroJugadores



export const getStaticProps: GetStaticProps = async (ctx) => {
    const equipos: IEquipoResponse = await fetcher(`${Config.baseUrlApi}/equipos`)
    const posiciones: IPosicionJugadores = await fetcher(`${Config.baseUrlApi}/jugadores/posiciones`)

    return {
        props: {
            data: equipos,
            posicionJugadores: posiciones
        }
    }
}
