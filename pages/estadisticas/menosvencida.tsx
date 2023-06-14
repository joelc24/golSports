import { GetStaticProps, NextPage } from 'next'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Config } from '@/enums/config';
import { fetcher } from '@/helpers/fetch';
import { IVallaMenosVencida } from '@/interface/valla-menos-vencida';
import { useEStadisticas } from '@/hooks/useEstadisticas';

interface Props {
    dataValla: IVallaMenosVencida
}

interface ColumnMeta {
    field: string;
    header: string;
}

const MenosVencidaPage: NextPage<Props> = ({ dataValla }) => {

    const { vallaMenosVencida } = useEStadisticas({ url: 'estadisticas', recurso: '/valla-menos-vencida', config: {
        fallback: dataValla
    } })

    const columns: ColumnMeta[] = [
        {field: 'nombre', header: 'Nombre'},
        {field: 'fundacion', header: 'Año de Fundacion'},
        {field: 'nombreCompleto', header: 'Nombre Completo'},
        {field: 'golesEnContra', header: 'Goles en Contra'}
    ];

    const tableOrdenada = vallaMenosVencida.sort((a, b) =>  Number(b.golesEnContra) - Number(a.golesEnContra))

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

export default MenosVencidaPage



export const getStaticProps: GetStaticProps = async (ctx) => {
    
    const dataValla: IVallaMenosVencida = await fetcher(`${Config.baseUrlApi}/estadisticas/valla-menos-vencida`)

    return {
        props: {
            dataValla
        },
        revalidate: 86_400
    }
}