import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { NavLink } from 'react-router-dom'
import Button from './Button';
import { Hourglass } from 'react-loader-spinner';
import { useSelector } from 'react-redux';

function Card({ res, productLoader }) {

    const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);


    return (
        <NavLink to={`/product/${res?._id}`} className='flex flex-col items-center justify-center rounded-sm cursor-pointer md:w-[22vw] w-full md:h-[70vh] h-[35vh] hover:bg-gray-200 hover:border-gray-400 hover:dark:bg-secondary-color border-transparent border-[0px] dark:border-0 transition-all md:p-4 p-1 gap-0 overflow-hidden hover:shadow-lg relative'

            onMouseEnter={(e) => { !productLoader && e.currentTarget.lastElementChild.classList.remove('invisible'); e.currentTarget.lastElementChild.classList.add('translatee-y-[-4em]'); e.currentTarget.lastElementChild.classList.add('animate-bounce-once') }}

            onMouseLeave={(e) => { !productLoader && e.currentTarget.lastElementChild.classList.add('invisible'); e.currentTarget.lastElementChild.classList.replace('translate-y-[-4em]', 'noe'); e.currentTarget.lastElementChild.classList.remove('animate-bounce-once') }}

        >
            {
                !productLoader ?
                    <>
                        <span class="bg-pink-500 z-10 text-white text-md font-medium me-2 md:px-2.5 px-1.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 absolute md:top-6 top-2 md:left-6 left-2 md:text-lg text-sm">-{((res?.comparePrice - res?.price) / res?.comparePrice).toFixed(2) * 100}%</span>
                        <div className='overflow-hidden'>
                            <img src={res?.image.url} className='w-[100%] p-0 transition-all duration-500 ease-in-out h-[50vh] object-cover hover:scale-[1.2]' />
                        </div>
                        <h1 className='md:px-4 px-1 md:text-gray-700 text-black dark:text-white mt-2 text-center w-full md:text-sm text-xs h-10 hover:underline'>{res?.title}</h1>
                        <div className='flex items-center justify-between w-full mt-4'>
                            <h2 className='px-0 md:text-sm text-xs text-start font-bold dark:text-gray-500 relative text-stone-600'>
                                <div className='w-full md:h-[2px] h-[1px] bg-stone-600 dark:bg-gray-500 absolute top-[50%] left-0'></div>
                                {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /> : 'Dhs.'}{isIndia ? res?.comparePrice : Math.floor(res?.comparePrice/dirham_to_rupees)}
                            </h2>
                            <h2 className='px-0 md:text-lg text-sm text-end font-bold dark:text-white text-stone-900'>
                                {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /> : 'Dhs.'}{isIndia ? res?.price.toString()[0] + "," + res?.price.toString().slice(1) : Math.floor(res?.price/dirham_to_rupees)}
                            </h2>
                        </div>
                        <Button className='text-sm w-[90%] mt-4 py-3 transition-transform duration-300 border-2 border-black rounded-sm font-bold invisible md:block hidden'>ADD TO CART</Button>
                    </>
                    : <Hourglass
                        visible={true}
                        height="50"
                        width="50"
                        ariaLabel="hourglass-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        colors={['#000000', '#72a1ed']}
                    />
            }
        </NavLink>
    )
}

export default Card