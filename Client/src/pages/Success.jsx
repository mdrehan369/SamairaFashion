import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Container, Spinner } from '../components';
import tick from "../assets/tick.gif";
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

function Success() {

    const [loader, setLoader] = useState(true);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {

        ; (async () => {

            setLoader(true);
            let url = '/api/v1/payments/';
            const paymentObj = JSON.parse(localStorage.getItem("paymentObj"));
            const isBuyNow = JSON.parse(localStorage.getItem("product")) !== null ? true : false;

            if (paymentObj.type === 'ziina') {
                url += `ziina/check`
            } else if (paymentObj.type === 'tabby') {
                url += `tabby/check`
            } else {
                setIsPaid(true);
                setLoader(false);
                localStorage.removeItem("paymentObj")
                localStorage.removeItem("product")
                return;
            }

            try {
                const response = await axios.post(url, {
                    id: paymentObj.id,
                    isBuyNow: isBuyNow,
                    product: JSON.parse(localStorage.getItem("product"))
                }, {
                    withCredentials: true,
                    baseURL: import.meta.env.VITE_BACKEND_URL
                });
                if (response.data.data.success) {
                    setIsPaid(true);
                } else {
                    setIsPaid(false);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoader(false);
                localStorage.removeItem("paymentObj")
                localStorage.removeItem("product")
            }

        })()
    }, []);

    return (
        !loader ?
            isPaid ?
                <Container className='flex flex-col items-center md:justify-center justify-start'>
                    <div className='flex flex-col items-center justify-center md:w-[40%] w-[100%] shadow-none border-gray-200 border-0 h-[40%] gap-4 p-6'>
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
                        <p className='text-center dark:text-stone-300 text-stone-500'>Something wrong happened while placing your order<br />Please try again or you can contact us <NavLink to={'/policies/contact'} className={'text-blue-800'}>here</NavLink></p>
                        <Button className='bg-red-400 text-sm font-bold dark:bg-red-600 text-red-900 dark:text-red-950 dark:hover:bg-red-500 dark:hover:text-red-800'>
                            <NavLink to={'/'}>Continue Shopping</NavLink>
                        </Button>
                    </div>
                </Container>
            : <Spinner className='h-[100vh]' />
    )
}

export default Success