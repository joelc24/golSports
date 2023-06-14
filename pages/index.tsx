import { apiLiga } from "@/helpers/apiLiga";
import { Toast } from "primereact/toast";
import { useRef } from "react";


function Home() {

  const toast = useRef<Toast>(null)

  const handleDelete = async() =>{
    try {
      await apiLiga('/truncate-tables')

      toast.current?.show({
        severity: 'success',
        summary: 'Eliminacion realizada ✅',
        detail: 'La elimnacion se realizo con exito'
      })

    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: '❌ Error! ❌',
        detail: 'Ocurrio un error inesperado'
      })
    }
  }

  const handleInsercion = async () => {
    try {
      await apiLiga('/insercion-masiva')

      toast.current?.show({
        severity: 'success',
        summary: 'Insercion realizada ✅',
        detail: 'La insercion se realizo con exito'
      })

    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: '❌ Error! ❌',
        detail: 'Ocurrio un error inesperado'
      })
    }
  }

  return (
    <div className="grid">
      <Toast ref={toast}/>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Insercion</span>
            </div>
            <div className="flex align-items-center justify-content-center bg-yellow-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-bolt text-yellow-500 text-xl cursor-pointer"  onClick={handleInsercion}/>
            </div>
          </div>
          <span className="text-green-500 font-medium">Ingresar datos </span>
          <span className="text-500">por defecto para consultarlos</span>
        </div>
      </div>

        <div className="col-12 lg:col-6 xl:col-3">
          <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Eliminacion</span>
              </div>
              <div className="flex align-items-center justify-content-center bg-red-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-ban text-red-500 text-xl cursor-pointer" onClick={handleDelete} />
              </div>
            </div>
            <span className="text-green-500 font-medium">Eliminar datos </span>
            <span className="text-500">todos los datos por defecto</span>
          </div>
        </div>
      </div>
  );
}

export default Home;