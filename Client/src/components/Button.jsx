import React from 'react'
import { twMerge } from 'tailwind-merge'

function Button({
    children,
    className = '',
    ...props
}) {
    return (
        <button
        className={twMerge('bg-[#232323] hover:bg-opacity-80 disabled:bg-opacity-50 border-[#232323] text-gray-200 dark:bg-[#00224d] hover:dark:bg-[#132d6a] rounded py-4 px-6 hover:shadow-xl shadow-black dark:hover:text-white text-lg font-medium border-0 dark:border-0 dark:text-white', className)}
        {...props}>
            {children}
        </button>
    )
}

export default Button