import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Container, Spinner } from '../components';
import tick from "../assets/tick.gif";
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

function Success() {

    const [loader, setLoader] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const { search } = useLocation()

    useEffect(() => {
        if (!search.includes('cod')) {
            ; (async () => {
                setLoader(true);
                try {
                    const session = await axios.get(`/api/v1/products/retrieve`, {
                        baseURL: import.meta.env.VITE_BACKEND_URL
                    });
                    if (session.data.data.payment_status === 'paid') setIsPaid(true);
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoader(false);
                }
            })();
        } else {
            setIsPaid(true);
            setLoader(false);
        }
    }, []);

    return (
        !loader ?
            isPaid ?
                <Container className='flex flex-col items-center md:justify-center justify-start'>
                    <div className='flex flex-col items-center justify-center w-[40%] shadow-none border-gray-200 border-0 h-[40%] gap-4 p-6'>
                        <img src={tick} className='w-[40%]' alt="Tick" />
                        <h1 className='md:text-4xl text-2xl text-center font-bold dark:text-stone-200 text-stone-700'>Order Placed Successfully!</h1>
                        <p className='text-center dark:text-stone-300 text-stone-500'>Thanks for ordering from Samaira Fashion. <br /> We will deliver your product within the given time.</p>
                        <Button className='bg-green-400 text-sm font-bold dark:bg-green-600 text-green-900 dark:text-green-950 dark:hover:bg-green-500 dark:hover:text-green-800'>
                            <NavLink to={'/'}>Continue Shopping</NavLink>
                        </Button>
                    </div>
                </Container>
                :
                <Container className='flex flex-col items-center md:justify-center justify-start'>
                    <div className='flex flex-col items-center md:justify-center justify-start md:w-[40%] shadow-none border-gray-200 border-0 md:h-[40%] w-full gap-4 p-6'>
                        <FontAwesomeIcon icon={faTriangleExclamation} className='text-red-500 size-48' />
                        <h1 className='md:text-4xl text-2xl text-center font-bold dark:text-stone-200 text-stone-700'>Sorry! Something Went Wrong</h1>
                        <p className='text-center dark:text-stone-300 text-stone-500'>Something wrong happened while placing your order<br />Please try again or you can contact us <NavLink to={'/contact'} className={'text-blue-800'}>here</NavLink></p>
                        <Button className='bg-red-400 text-sm font-bold dark:bg-red-600 text-red-900 dark:text-red-950 dark:hover:bg-red-500 dark:hover:text-red-800'>
                            <NavLink to={'/'}>Continue Shopping</NavLink>
                        </Button>
                    </div>
                </Container>
            : <Spinner className='h-[100vh]' />
    )
}

export default Success