import { GetStaticProps, NextPage } from 'next'

import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { fetcher } from '@/helpers/fetch';
import { Config } from '@/enums/config';
import { ICalendarioResponse } from '@/interface/calendario-response';
import { CalendarioMoldeado, useCalendario } from '@/hooks/useCalendario';
import { PartidoDropDown } from '@/components/PartidoDropDown';
import { JugadoresDropdwon, ListOfJugadores } from '@/components/JugadoresDropdwon';
import { useRef } from 'react';
import { apiLiga } from '@/helpers/apiLiga';

export type FormData = {
    minuto: number
    jugadores: ListOfJugadores
    partido: CalendarioMoldeado
}

interface Props {
    dataCalendario: ICalendarioResponse
}

const RegistrarGoles: NextPage<Props> = () => {

    const toast = useRef<Toast>(null);
    const { handleSubmit, control, formState: { errors }, reset } = useForm<FormData>()

    const { partido } = useWatch({
        control,
        defaultValue: undefined
    })



    const getFormErrorMessage = (name: keyof FormData) => {
        return errors[name] ? (<small className="p-error">{errors[name]?.message}</small>) : (<small className="p-error">&nbsp;</small>);
    };
    const onSubmit = async ({ minuto, partido: { id: idPartido }, jugadores: { id: idJugador } }: FormData) => {

        try {

            await apiLiga.post('/goles', { idPartido, idJugador, minuto })

            toast.current?.show({
                severity: 'success',
                summary: 'Registro exitoso✅',
                detail: 'El gol se registro de manera satisfactoria'
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: '❌ Error! ❌',
                detail: 'Ocurrio un error inesperado'
            })
        } finally {
            reset()
        }

    }


    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Pagina de Registro</h5>
                    <p>En esta pagina se podran registrar todos los goles de la liga.</p>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <h5>Formulario de ingreso</h5>
                    <form className="p-fluid formgrid grid" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="partido"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                defaultValue={undefined}
                                render={({ field, fieldState }) => (
                                    <>
                                        <PartidoDropDown name={field.name} value={field.value} onChange={field.onChange} {...fieldState} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="jugadores"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                defaultValue={undefined}
                                render={({ field, fieldState }) => (
                                    <>
                                        <JugadoresDropdwon idPartido={partido?.id} name={field.name} value={field.value} onChange={field.onChange} {...fieldState} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className='field col-12 md:col-6'>
                            <Controller
                                name='minuto'
                                control={control}
                                rules={{
                                    required: 'El minuto del gol es requerido',
                                    validate: (value) => (value > 0 && value <= 90) || 'Ingrese un minuto valido'
                                }}
                                defaultValue={0}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': fieldState.error })}></label>
                                        <span className='p-float-label'>
                                            <InputNumber
                                                inputId={field.name}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                min={3}
                                                max={90}
                                            />
                                            <label htmlFor={field.name}>Minuto</label>
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

export default RegistrarGoles

export const getStaticProps: GetStaticProps = async (ctx) => {

    const url = `${Config.baseUrlApi}/calendario`

    const dataCalendario: ICalendarioResponse = await fetcher(url)

    return {
        props: {
            dataCalendario
        }
    }
}