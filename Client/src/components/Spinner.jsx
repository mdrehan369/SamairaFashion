import React, { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { useSelector } from 'react-redux'
import lightLoader from "../assets/lightloader.png"
import darkLoader from "../assets/darkloader.png"

function Spinner({ className = '', scroll=false }) {

    useEffect(() => {
        scroll && window.scrollTo(0, 0);
    }, [])

    const theme = useSelector(state => state.theme.theme);

    return (

        <div role="status" className={twMerge(`w-[100%] h-[100%] flex flex-col items-center justify-center`, className)}>
            <div className='relative animate-loader-animation'>
                <img src={theme ? theme === 'light' ? lightLoader : darkLoader : lightLoader} className='md:w-full w-32' alt="Loader" />
                <div className='absolute dark:text-white left-4 md:bottom-16 bottom-4 text-sm font-medium'>Loading...</div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>

    )
}

export default Spinner