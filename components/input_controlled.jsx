'use client'
import { Controller } from "react-hook-form"

const InputControlled = ({ control, name, errors, className, label, placeholder='' }) => {
    return (<>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                // <input {...field} className={className} />
                <label className="input input-bordered flex items-center gap-2">
                    {label ? label : ''}
                    <input {...field}  type="text" className="grow" placeholder={placeholder} />
                </label>
            )}
        />

    </>)
}

export default InputControlled