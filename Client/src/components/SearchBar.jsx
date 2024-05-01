import React from 'react'
// import searchIcon from "../assets/loupe.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { twMerge } from 'tailwind-merge'

function SearchBar({
    className,
    ...props
}) {
    return (
        <div className='w-[70%] flex items-center justify-center'>
            <input
            className={twMerge(`w-full h-full p-3 m-3 rounded-full placeholder:text-gray-400 border-2 border-gray-400 bg-gray-200`, className)}
            placeholder='Search Here...'
            {...props}
            />
        </div>
    )
}

export default SearchBar