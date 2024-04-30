import React from 'react'
import { twMerge } from 'tailwind-merge'

function Button({
    children,
    className = '',
    ...props
}) {
    return (
        <button
        className={twMerge('bg-black bg-opacity-70 hover:bg-opacity-80 text-white dark:bg-blue-800 hover:dark:bg-blue-900 rounded-lg w-[5vw] py-2 font-normal hover:shadow-xl shadow-black text-[1.1rem] border-2 border-black', className)}
        {...props}>
            {children}
        </button>
    )
}

export default Button