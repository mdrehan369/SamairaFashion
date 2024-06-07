import React from 'react'
import { twMerge } from 'tailwind-merge'

function Input({
    name,
    register,
    type = 'text',
    label = '',
    labelSize = 'text-sm',
    className = '',
    errors = undefined,
    ...props
}) {
    return (
        <div className='flex flex-col items-start justify-start w-full'>
            <label
                htmlFor={name}
                className={`${labelSize} font-medium dark:text-white text-stone-700 mb-1`}
            >
                {label}
            </label>
            <input
                type={type}
                name={name}
                className={twMerge(`dark:bg-secondary-color text-sm dark:text-gray-200 bg-gray-100 shadow-sm p-3 m-0 rounded-sm w-[25vw] h-[7vh] dark:border-transparent border-[1px] ${errors && errors[`${name}`] ? 'border-red-500 dark:border-red-900' : 'border-gray-400'} focus:border-black text-sm focus:dark:border-gray-400 focus:ring-0 focus:outline-none`, className)}
                {...register(name)}
                {...props}
            />
            { errors && errors[`${name}`] && <p className='text-xs bg-[#ff4e4e] dark:bg-[#8d1a1a] text-white py-1 px-2 mt-1 rounded-md'>{errors[`${name}`].message}</p>}
        </div>
    )
}

export default Input