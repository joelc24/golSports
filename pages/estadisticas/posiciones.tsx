import { GetStaticProps, NextPage } from 'next'
import { DataTable } from 'primereact/datatable';

import { ITablaPosiciones } from '../../interface/tabla-posiciones';
import { Config } from '@/enums/config';
import { fetcher } from '@/helpers/fetch';
import { Column } from 'primereact/column';
import { useEStadisticas } from '@/hooks/useEstadisticas';

interface Props {
    dataPosiciones: ITablaPosiciones
}

interface ColumnMeta {
    field: string;
    header: string;
}

const PosicionesPage: NextPage<Props> = ({ dataPosiciones }) => {

    const { tabla } = useEStadisticas({ url: 'estadisticas', recurso: '/tabla', config: {
        fallbackData: dataPosiciones
    } })

    const columns: ColumnMeta[] = [
        {field: 'nombre', header: 'Nombre'},
        {field: 'fundacion', header: 'Año de Fundacion'},
        {field: 'nombreCompleto', header: 'Nombre Completo'},
        {field: 'pj', header: 'PJ'},
        {field: 'pg', header: 'PG'},
        {field: 'pe', header: 'PE'},
        {field: 'pp', header: 'PP'},
        {field: 'gf', header: 'GF'},
        {field: 'gc', header: 'GC'},
        {field: 'pt', header: 'PT'},
    ];

    const tableOrdenada = tabla.sort((a, b) =>  Number(b.pt) - Number(a.pt))

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Informacion de la posicion</h5>
                    <p>En esta pagina usted podra mirar la posicion actual de los equipos.</p>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                <DataTable value={tableOrdenada} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                {columns.map((col, i) => (
                    <Column sortable key={col.field} field={col.field} header={col.header} />
                ))}
            </DataTable>
                </div>
            </div>
        </div>
    )
}

export default PosicionesPage



export const getStaticProps: GetStaticProps = async (ctx) => {
    
    const dataPosiciones: ITablaPosiciones = await fetcher(`${Config.baseUrlApi}/estadisticas/tabla`)

    return {
        props: {
            dataPosiciones
        },
        revalidate: 86_400
    }
}