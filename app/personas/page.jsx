'use client'
import { createPerson, getPersons, updatePerson } from "@/api/api";
import InputControlled from "@/components/input_controlled";
import MainTable from "@/components/main_table";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const PersonaPage = () => {
    const [personas, setPersonas] = useState([]);
    const formData = useRef(null)
    const modalRef = useRef(null)
    const defaultValues = {
        DocNumber: '',
        LastName: '',
        MiddleName: '',
        Name: ''
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

    const resetForm = () => {
        reset(defaultValues);
    }

    const cargaData = async () => {
        setPersonas(await getPersons());
    }

    const saveData = async () => {
        var res = null
        let data = { ...watch() }
        if (data.ID) {
            res = await updatePerson(data)
        } else {
            res = await createPerson(data)
        }
        console.log(res)
        cargaData();
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
        // if(personas.length > 0){
        console.log(personas);
        // }
    }, [personas])

    // useEffect(() => {
    //     console.log(watch());
    // }, [watch()])

    return (
        <div>
            <h1>Personas</h1>
            <div className="py-2">
                {/* <InputControlled name="search" control={control} className="w-1/2" /> */}
                <label htmlFor="my_modal_7" className="btn">Nuevo</label>
                {/* <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button> */}
                {/* Put this part before </body> tag */}
                <input ref={modalRef} type="checkbox" id="my_modal_7" className="modal-toggle" />
                <div className="modal" role="dialog">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">Nuevo registro</h3>
                        <form ref={formData} onSubmit={handleSubmit(saveData)}>
                            <div className=" p-2">
                                <div className="w-full  py-2 ">
                                    {/* <label>Doc. Identidad</label> */}
                                    <InputControlled label={'Doc. Identidad: '} name="DocNumber" control={control} className="w-full" />
                                </div>
                                <div className="w-full py-2 ">

                                    <InputControlled label={'Nombres: '} name="Name" control={control} className="w-full" />
                                </div>
                                <div className="w-full py-2 ">

                                    <InputControlled label={'Ap. Paterno: '} name="MiddleName" control={control} className="w-full" />
                                </div>
                                <div className="w-full py-2 ">

                                    <InputControlled label={'Ap. Materno: '} name="LastName" control={control} className="w-full" />
                                </div>
                            </div>

                        </form>
                        <div className="modal-action">
                            <div onClick={handleSubmitForm} className="btn">Guardar</div>
                            <label onClick={resetForm} htmlFor="my_modal_7" className="btn">Cerrar</label>
                        </div>
                    </div>
                    {/* <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>*/}

                </div>
            </div>
            <div className="w-full">
                <MainTable data={personas} columns={columns} fnSelect={onSelect} />
            </div>
        </div>

    );
}

export default PersonaPage