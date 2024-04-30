import React from 'react'
import { twMerge } from 'tailwind-merge'

function Input({
    name,
    register,
    type = 'text',
    label = '',
    labelSize = 'text-2xl',
    className = '',
    ...props
}) {
    return (
        <div className='flex items-center justify-start'>
            <label
                htmlFor={name}
                className={`${labelSize} text-center`}
            >
                {label}
            </label>
            <input
                type={type}
                name={name}
                className={twMerge(`dark:bg-slate-800 dark:text-gray-200 bg-gray-100 shadow-md p-2 m-4 rounded-md w-[25vw] h-[7vh] `, className)}
                {...register(name)}
                {...props}
            />
        </div>
    )
}

export default Input