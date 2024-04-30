import React from 'react'
// import searchIcon from "../assets/loupe.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

function SearchBar({
    ...props
}) {
    return (
        <div className='w-[70%] flex items-center justify-center'>
            <input
            className='w-full h-full p-3 m-3 rounded-full placeholder:text-gray-400 border-2 border-gray-400 bg-gray-200'
            placeholder='Search Here...'
            {...props}
            />
            <button>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div>
    )
}

export default SearchBar