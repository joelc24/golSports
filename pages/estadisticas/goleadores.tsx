import { GetStaticProps, NextPage } from 'next'
import { DataTable } from 'primereact/datatable';

import { Config } from '@/enums/config';
import { fetcher } from '@/helpers/fetch';
import { Column } from 'primereact/column';
import { IGoleadores } from '@/interface/goleadores';
import { useEStadisticas } from '@/hooks/useEstadisticas';

interface Props {
    dataGoleadores: IGoleadores
}

interface ColumnMeta {
    field: string;
    header: string;
}

const PosicionesPage: NextPage<Props> = ({ dataGoleadores }) => {

    const { goleadores } = useEStadisticas({ url: 'estadisticas', config: {
        fallbackData: dataGoleadores
    } })

    const columns: ColumnMeta[] = [
        {field: 'jugador', header: 'Jugador'},
        {field: 'equipo', header: 'Equipo'},
        {field: 'goles', header: 'Goles'}
    ];

    const tableOrdenada = goleadores.sort((a, b) =>  Number(b.goles) - Number(a.goles))

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
    
    const dataGoleadores: IGoleadores = await fetcher(`${Config.baseUrlApi}/estadisticas`)

    return {
        props: {
            dataGoleadores
        },
        revalidate: 86_400
    }
}