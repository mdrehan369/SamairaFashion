import React from 'react'
import { twMerge } from 'tailwind-merge'

function Button({
    children,
    className = '',
    ...props
}) {
    return (
        <button
        className={twMerge('bg-black hover:bg-opacity-80 disabled:bg-opacity-50 text-gray-200 dark:bg-blue-800 hover:dark:bg-blue-900 rounded py-4 px-6 hover:shadow-xl shadow-black text-lg font-medium border-0 border-black', className)}
        {...props}>
            {children}
        </button>
    )
}

export default Button