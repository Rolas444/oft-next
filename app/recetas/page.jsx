'use client'

import { createReceta, getPersons, getReceta, getMedicamentos, createDosage, getDosages, updateDosage, deleteDosage } from "@/api/api";
import InputControlled from "@/components/input_controlled";
import MainTable from "@/components/main_table";
import { useEffect, useRef, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { RiEditFill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import Select from 'react-select'
import { useReactToPrint } from 'react-to-print';


const RecetaPage = () => {
    const [recetas, setRecetas] = useState([])
    const [personas, setPersonas] = useState([])
    const [persona, setPersona] = useState('')
    const [medicamentos, setMedicamentos] = useState([])
    const [recetaID, setRecetaID] = useState(0)
    const formData = useRef(null)
    const modalRef = useRef(null)
    const divPrint = useRef(null)
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

    const cargaData = async () => {
        if (recetaID > 0) {
            let dosages = await getDosages(recetaID)
            setRecetas(dosages)
        }
    }

    const onSelect = async (row) => {
        setPersona(`${row.original.Name} ${row.original.MiddleName} ${row.original.LastName}`)
        var idReceta = 0
        let receta = await getReceta(row.original.ID)
        if (receta.data.ID === 0) {
            let data = { PersonID: row.original.ID }
            let tmpReceta = await createReceta(data)
            // console.log(tmpReceta)
            idReceta = tmpReceta.ID
            // console.log(tmpReceta)
        } else {
            // console.log(receta.data)
            idReceta = receta.data.ID
        }
        console.log(idReceta)
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

    const saveData = async () => {
        console.log(recetaID)

        let data = {
            PrescriptionID: recetaID,
            MedicationID: watch('Medication').value,
            Detail: watch('Detail')
        }
        if (watch('ID') > 0) {
            data.ID = watch('ID')
            const response = await updateDosage(data)
            console.log(response)
        } else {
            const response = await createDosage(data)
            console.log(response)
        }
        // const response = await createDosage(data)
        // console.log(response)
        resetForm()
        cargaData()
    }

    const editDosage = (dosage) => {
        let tmpDosage = {
            ID: dosage.ID,
            Medication: findMedication(dosage.MedicationID),
            Detail: dosage.Detail
        }
        reset(tmpDosage)
    }

    const deleteDosageByID = async(dosage) => {
        // console.log(dosage)
        const response = await deleteDosage(dosage.ID)
        console.log(response)
        resetForm()
        cargaData()
    }

    const findMedication = (id) => {
        let tmp = medicamentos.find(item => item.value === id)
        return tmp
    }

    const handlePrint = useReactToPrint({
        content: () => divPrint.current,
      });

    useEffect(() => {
        getPersonas()
        getAllMedicamentos()
    }, [])

    useEffect(() => {
        cargaData()
    }, [recetaID])

    useEffect(() => {
        console.log(watch())
    }, [watch()])

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

                        <form ref={formData} onSubmit={handleSubmit(saveData)}>
                            <div className="">
                                <Controller
                                    name="Medication"
                                    control={control}
                                    render={({ field }) =>
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
                        <div ref={divPrint} className="py-2 m-2 printable">
                            <p className="py-3">Paciente: <span className="font-bold">{persona}</span></p>
                            {
                                recetas.map(item => {
                                    return (
                                        <div key={item.ID} className="py-2 m-1">
                                            <p className="flex items-center font-bold gap-1">
                                                {findMedication(item.MedicationID).label}
                                                <span className="flex text-transparent">
                                                    <RiEditFill onClick={() => editDosage(item)} className="cursor-pointer text-transparent hover:text-cyan-800 " />
                                                    <TiDelete onClick={() => deleteDosageByID(item)} className="cursor-pointer text-transparent hover:text-orange-800" />
                                                </span>
                                            </p>
                                            <p>{item.Detail}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div class="modal-action">
                            <div onClick={handlePrint} className="btn">Imprimir</div>
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