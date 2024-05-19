import React from 'react'
import { twMerge } from 'tailwind-merge'

function Input({
    name,
    register,
    type = 'text',
    label = '',
    labelSize = 'text-md',
    className = '',
    ...props
}) {
    return (
        <div className='flex flex-col items-start justify-start w-full'>
            <label
                htmlFor={name}
                className={`${labelSize} font-medium dark:text-white text-stone-700`}
            >
                {label}
            </label>
            <input
                type={type}
                name={name}
                className={twMerge(`dark:bg-secondary-color dark:text-gray-200 bg-gray-100 shadow-sm p-5 m-0 rounded-sm w-[25vw] h-[7vh] dark:border-transparent border-[1px] border-gray-400 focus:border-black focus:dark:border-gray-400 focus:ring-0 focus:outline-none`, className)}
                {...register(name)}
                {...props}
            />
        </div>
    )
}

export default Input