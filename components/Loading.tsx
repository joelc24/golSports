import { ProgressSpinner } from 'primereact/progressspinner'


export const Loading = () => {
    return (
        <div className="card flex justify-content-center">
            <ProgressSpinner />
        </div>
    )
}
