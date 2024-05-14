'use client'

import { createReceta, getPersons, getReceta, getMedicamentos } from "@/api/api";
import InputControlled from "@/components/input_controlled";
import MainTable from "@/components/main_table";
import { useEffect, useRef, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import Select from 'react-select'


const RecetaPage = () => {
    const [recetas, setRecetas] = useState([])
    const [personas, setPersonas] = useState([])
    const [persona, setPersona] = useState('')
    const [medicamentos, setMedicamentos] = useState([])
    const [recetaID, setRecetaID] = useState(0)
    const formData = useRef(null)
    const modalRef = useRef(null)
    const defaultValues = {
        Medication: null,
        Detail: ''
    }

    const { handleSubmit, control, reset, watch } = useForm({
        defaultValues
    });

    const columns = [
        {
            accessorKey: 'DocNumber',
            header: () => <span>Doc. Identidad</span>
        },
        {
            accessorKey: 'Name',
            header: () => <span>Nombres</span>
        },
        {
            accessorKey: 'MiddleName',
            header: () => <span>Ap. Paterno</span>
        },
        {
            accessorKey: 'LastName',
            header: () => <span>Ap. Materno</span>
        },
    ]

    const getPersonas = async () => {
        setPersonas(await getPersons())
    }

    const getAllMedicamentos = async () => {
        let listaMedicamentos = await getMedicamentos()
        let listaFormateada = listaMedicamentos.map(item => {
            return { value: item.ID, label: item.Name }
        })
        setMedicamentos(listaFormateada)
    }

    const cargaData = () => {

    }

    const onSelect = async (row) => {
        setPersona(`${row.original.Name} ${row.original.MiddleName} ${row.original.LastName}`)
        var idReceta = 0
        let receta = await getReceta(row.original.ID)
        if (receta.data.ID === 0) {
            let data = { PersonID: row.original.ID }
            let tmpReceta = await createReceta(data)
            idReceta = tmpReceta.data.ID
        } else {
            idReceta = receta.ID
        }
        // console.log(receta)
        // reset(row.original)
        setRecetaID(idReceta)
        if (modalRef.current) {
            modalRef.current.click()
        }
    }

    const handleSubmitForm = () => {

    }

    const resetForm = () => {
        reset(defaultValues)
    }

    const saveData = () => {

        let data = {
            RecetaID: recetaID,
            MedicationID: watch('Medication').value,
            Detail: watch('Detail')
        }


    }

    useEffect(() => {
        getPersonas()
        getAllMedicamentos()
    }, [])

    useEffect(()=>{
        console.log(watch())
    },[watch()])

    return (<>
        <div>
            <h1>Receta</h1>
            <div className="py-2">
                <div className="p-2">
                    <MainTable data={personas} columns={columns} fnSelect={onSelect} />
                </div>

                {/* <label htmlFor="modal_receta" className="btn">Nueva receta</label> */}
                <input ref={modalRef} type="checkbox" id="modal_receta" className="modal-toggle" />
                <div className="modal" role="dialog">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">Recetar</h3>
                        <p className="py-3">Paciente: {persona}</p>
                        <form ref={formData} onSubmit={handleSubmit(saveData)}>
                            <div className="">
                                <Controller
                                    name="Medication"
                                    control={control}
                                    render={({field})=>
                                    <Select {...field}
                                    styles={{    
                                        option: (provided, state) => ({
                                            ...provided,
                                            // backgroundColor: state.isSelected ? '#111' : '#',
                                            color: 'black'
                                        }),
                                    }} className="py-2" options={medicamentos} />}
                                ></Controller>
                                <InputControlled control={control} name="Detail" label="Detalle: " />
                            </div>
                        </form>
                        <div className="w-full flex justify-end">
                                <div className="pt-1">
                                    <div onClick={saveData} className="btn">agregar</div>
                                </div>
                        </div>
                        <div className="py-2">
                            {
                                recetas.map(item => {
                                    return (
                                        <div key={item.ID} className="py-2">
                                            <p className="font-bold">{item.Medication}</p>
                                            <p>{item.Detail}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div class="modal-action">
                            <div onClick={handleSubmitForm} className="btn">Imprimir</div>
                            <label onClick={resetForm} htmlFor="modal_receta" className="btn">Cerrar</label>
                        </div>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    </>)
}

export default RecetaPage;