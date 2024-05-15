'use client'
import { createMedicamento, getMedicamentos, updateMedicamento } from '@/api/api'
import InputControlled from '@/components/input_controlled'
import MainTable from '@/components/main_table'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const MedicametoPage = () => {
    const [medicamentos, setMedicamentos] = useState([])
    const formData = useRef(null)
    const modalRef = useRef(null)
    const defaultValues = {
        Name: '',
        Details: ''
    }
    const { handleSubmit, control, reset, watch } = useForm({
        defaultValues
    });

    const columns = [
        {
            accessorKey: 'Name',
            header: () => <span>Nombre</span>
        },
        {
            accessorKey: 'Details',
            header: () => <span>Detalles</span>
        }
    ]

    const resetForm = () => {
        reset(defaultValues);
    }

    const cargaData = async () => {
        setMedicamentos(await getMedicamentos());
    }

    const saveData = async() => {
        var res=null
        let data = {...watch()}
        if(data.ID){
            res= await updateMedicamento(data)
        }else{
            res= await createMedicamento(data)
        }
        console.log(res)
        cargaData()
        toast.success('Registro exitoso')
    }

    const handleSubmitForm = () => {
        handleSubmit(saveData)();
    };

    const onSelect = (row) => {
        reset(row.original)
        if (modalRef.current) {
            modalRef.current.click()
        }
    }

    useEffect(() => {
        cargaData();
    }, [])

    useEffect(() => {
        console.log(watch());
    }, [watch()])

    return (
        <div>
            <h1>Medicamentos</h1>
            <div className='py-2'>
                <label htmlFor='modal-med' className='btn'>Nuevo</label>
                <input ref={modalRef} type='checkbox' id='modal-med' className='modal-toggle' />
                <div className='modal'>
                    <div className='modal-box'>
                        <h3 className='text-lg font-bold'>Medicamento</h3>
                        <form ref={formData} onSubmit={handleSubmitForm}>
                            <div className='p-2'>
                                <div className='w-gull py-2'>
                                    <InputControlled name='Name' control={control} className='w-full' label='Nombre:' />
                                </div>
                                <div className='w-gull py-2'>
                                    <InputControlled name='Details' control={control} className='w-full' label='Detalle:' />
                                </div>
                            </div>
                        </form>
                        <div className="modal-action">
                            <div onClick={handleSubmitForm} className="btn">Guardar</div>
                            <label onClick={resetForm} htmlFor="modal-med" className="btn">Cerrar</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <MainTable data={medicamentos} columns={columns} fnSelect={onSelect} />
            </div>
        </div>
    );
}

export default MedicametoPage