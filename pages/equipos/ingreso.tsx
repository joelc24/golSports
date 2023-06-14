import { useRef, useState } from 'react';
import { GetStaticProps, NextPage } from 'next'

import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Calendar } from "primereact/calendar";
import { useForm, Controller } from 'react-hook-form';

import { fetcher } from '@/helpers/fetch';
import { ICiudadResponse } from '@/interface/ciudad-response';
import { Config } from '@/enums/config';
import { useEquipos } from '@/hooks/useEquipos';

type FormData = {
    nombre: string
    nombreCompleto: string
    ciudad: ICiudadResponse
    fundacion: string 
}

interface Props {
    ciudades: ICiudadResponse[]
}

const IngresoEquipos: NextPage<Props> = ({ ciudades }) => {


    const { crearEquipo } = useEquipos({ url: 'equipos' })
    const [filteredCities, setFilteredCities] = useState<ICiudadResponse[]>([])
    const toast = useRef<Toast>(null);

    const { handleSubmit, control, formState: { errors }, reset } = useForm<FormData>()

   
    const getFormErrorMessage = (name: keyof FormData) => {
        return errors[name] ? (<small className="p-error">{errors[name]?.message}</small>) : (<small className="p-error">&nbsp;</small>);
    };

    const search = (event: AutoCompleteCompleteEvent) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredCities;

            if (!event.query.trim().length) {
                _filteredCities = [...ciudades];
            }
            else {
                _filteredCities = ciudades.filter((city) => {
                    return city.nombre.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredCities(_filteredCities);
        }, 250);
    }
    const onSubmit = async ({ nombre, nombreCompleto, fundacion, ciudad: {id} }: FormData) => {
        // console.log(data)

        try {
            await crearEquipo({
                nombre,
                nombreCompleto,
                fundacion,
                idCiudad: id.toLocaleString()
            })

            toast.current?.show({
                severity: "success",
                summary: "Equipo registrado",
                detail: `El equipo ${nombre} se registro con exito.`,
            });
            
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: '❌ Error ❌',
                detail: 'Se produjo un error al intentar registrar el equipo'
            })
        } finally {
            reset()
        }

    }


    return (
        <div className="grid">
            <Toast ref={toast}/>
            <div className="col-12">
                <div className="card">
                    <h5>Pagina de Ingreso</h5>
                    <p>En esta pagina se podran ingresar todos los equipos a participar en la liga.</p>
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
                                name="nombreCompleto"
                                control={control}
                                rules={{
                                    required: 'El nombre completo es requerido',
                                    minLength: { value: 3, message: 'El nombre completo debe contener minimo tres caracteres' }
                                }}
                                defaultValue=''
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.nombreCompleto })}></label>
                                        <span className='p-float-label'>
                                            <InputText
                                                id={field.name}
                                                value={field.value}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                            <label htmlFor={field.name}>Nombre completo</label>
                                        </span>
                                        {getFormErrorMessage('nombreCompleto')}
                                    </>
                                )}
                            />
                        </div>
                        <div className='field col-12 md:col-6'>
                            <Controller
                                name='fundacion'
                                control={control}
                                rules={{ required: 'El año de fundacion del equipo es requerido' }}
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
                                                view='year'
                                                dateFormat='yy'
                                            />
                                            <label htmlFor={field.name}>Año de fundacion</label>
                                        </span>
                                        {getFormErrorMessage('fundacion')}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="ciudad"
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
                                                className={classNames({'p-invalid': fieldState.error})}
                                                suggestions={filteredCities}
                                                completeMethod={search} onChange={(e) => onChange(e.value)}
                                                scrollHeight='200px' virtualScrollerOptions={{ itemSize: 40 }} forceSelection
                                            />
                                            <label htmlFor={name}>Ciudad</label>
                                        </span>
                                        {getFormErrorMessage('ciudad')}
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

export default IngresoEquipos

export const getStaticProps: GetStaticProps = async (ctx) => {

    const url = `${Config.baseUrlApi}/ciudades`

    const ciudades = await fetcher(url)

    return {
        props: {
            ciudades
        }
    }
}