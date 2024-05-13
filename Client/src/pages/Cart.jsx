import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Spinner, Container, Button } from "../components/index.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

function Cart() {

    const [loader, setLoader] = useState(true);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(1);
    const [reload, setReload] = useState(true);

    const [isIndia, setIsIndia] = useState(null);
    let dirham_to_rupees = 22;

    // useEffect(() => {
    //     ; (async () => {
    //         try {
    //             const response = await axios.get(`http://ip-api.com/json`);
    //             if (response.data.countryCode === 'IN') {
    //                 setIsIndia(true);
    //             } else {
    //                 const response = await axios.get('http://www.floatrates.com/daily/aed.json');
    //                 dirham_to_rupees = Math.floor(response.data.inr.rate);
    //                 setIsIndia(false);
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     })();
    // }, []);

    // const setLocation = async () => {
    //     try {
    //         const response = await axios.get(`http://ip-api.com/json`);
    //         if (response.data.countryCode === 'IN') {
    //             setIsIndia(true);
    //         } else {
    //             const response = await axios.get('http://www.floatrates.com/daily/aed.json');
    //             dirham_to_rupees = Math.floor(response.data.inr.rate);
    //             setIsIndia(false);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    useEffect(() => {
        ; (async () => {
            // setLoader(true);
            try {
                const location = await new Promise(async (res, rej) => {
                    if (isIndia !== null) return res(isIndia)
                    try {
                        const response = await axios.get(`http://ip-api.com/json`);
                        if (response.data.countryCode === 'IN') {
                            setIsIndia(() => true);
                            res(true);
                        } else {
                            const response = await axios.get('http://www.floatrates.com/daily/aed.json');
                            dirham_to_rupees = Math.floor(response.data.inr.rate);
                            setIsIndia(() => false);
                            res(false);
                        }
                    } catch (err) {
                        console.log(err);
                        rej(null);
                    }
                })

                if (location === null) throw new Error("Error While Fetching Location");

                const response = await axios.get(`/api/v1/users/cart`);
                setCart(response.data.data);

                let sum = 0;
                for (let item of response.data.data) {
                    if (!location) {
                        sum += Math.floor((item.quantity * item.product[0].price) / dirham_to_rupees)
                    } else {
                        sum += item.quantity * item.product[0].price
                    }
                }

                setTotal(sum);
            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
            }
        })();
    }, [reload]);

    const handleQuantity = async (cartItem, qnty) => {
        try {
            await axios.put(`/api/v1/users/cart?cartItemId=${cartItem._id}&quantity=${qnty}`);
        } catch (err) {
            console.log(err);
        } finally {
            setReload(!reload);
        }
    }

    return (
        !loader ?
            <Container className='flex items-center justify-center h-auto gap-10'>
                <div className='flex flex-col items-center justify-center h-[80vh] gap-10 overflow-y-scroll'>
                    {cart.map((item, index) =>
                        <div key={index} className='flex items-center justify-start w-[60vw] h-[30vh] bg-[#f1f1f1] divide-x-2 divide-gray-300'>
                            <div className='w-[25%] h-full p-3'>
                                <img src={item.product[0].image.url} className='w-full h-full object-cover' alt="Product" />
                            </div>
                            <div className='h-full p-3 w-[75%] pr-10 flex flex-col items-start justify-start gap-0'>
                                <h1 className='font-bold text-xl tracking-wide'>{item.product[0].title}</h1>
                                <p className='text-[0.92rem] h-[50%] mt-4'>{item.product[0].description.slice(0, 250)}...</p>
                                <div className='flex items-end justify-between w-full'>
                                    <div>
                                        <p className='text-sm text-gray-400 font-bold w-fit relative'>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{isIndia ? item.product[0].comparePrice : Math.floor(item.product[0].comparePrice / dirham_to_rupees)}<div className='bg-gray-400 absolute top-[50%] left-0 w-full h-[2px]'></div></p>
                                        <p className='text-xl font-bold'>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{isIndia ? item.product[0].price : Math.floor(item.product[0].price / dirham_to_rupees)}</p>
                                    </div>
                                    <div>
                                        <h2 className='text-sm font-medium text-stone-700'>Size: <span className='text-black'>{item.product[0].size || 52}</span></h2>
                                    </div>
                                    <div>
                                        <h2 className='text-sm font-medium text-stone-700'>Color: <span className='text-black'>{item.product[0].color || 'Black'}</span></h2>
                                    </div>
                                    <div className='flex items-center justify-around border-[1px] border-gray-300 rounded-none w-32 mt-2 py-3'>
                                        <div><FontAwesomeIcon icon={faMinus} className='cursor-pointer' onClick={() => handleQuantity(item, item.quantity - 1)} /></div>
                                        <div className='text-stone-600'>{item.quantity}</div>
                                        <div><FontAwesomeIcon icon={faPlus} className='cursor-pointer' onClick={() => handleQuantity(item, item.quantity + 1)} /></div>
                                    </div>
                                </div>
                                <span className='text-xs mt-4 text-stone-700 font-medium'>Subtotal: {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='font-normal mr-0.5 ml-1' /> : 'Dhs.'}<span className='font-bold text-stone-700'>{isIndia ? item.product[0].price * item.quantity : Math.floor(item.product[0].price / dirham_to_rupees) * item.quantity}</span></span>
                            </div>
                        </div>)}
                </div>
                <div className='w-[20%] h-[60vh] flex flex-col items-start justify-start gap-10'>
                    <div className='font-bold w-full text-sm border-b-2 border-black'>ORDER SUMMARY</div>
                    <div className='flex items-center justify-between w-full'><span className='font-bold text-sm text-black'>Subtotal:</span><span className='text-xl font-bold'>{isIndia ? <FontAwesomeIcon className='mr-2' icon={faIndianRupeeSign} /> : 'Dhs.'}{total}</span></div>
                    <div className='flex flex-col items-center gap-4 justify-start w-full'>
                        <h1 className='font-bold text-sm self-start'>Coupon Code</h1>
                        <input type="text" className='w-[100%] h-[7vh] p-3 text-sm border-gray-300 border-[1px]' placeholder='Enter Coupon Code' />
                        <p className='text-sm text-gray-500'>Coupon Code will be applied on the checkout page</p>
                    </div>
                    <div className='flex items-center justify-between w-full'><span className='font-bold text-sm text-black'>Total:</span><span className='text-xl font-bold'>{isIndia ? <FontAwesomeIcon className='mr-2' icon={faIndianRupeeSign} /> : 'Dhs.'}{total}</span></div>
                    <div className='w-full space-y-4'>
                        <Button className='w-full rounded-none text-sm font-extrabold tracking-wider hover:bg-transparent hover:text-black shadow-none hover:shadow-none border-2 transition-colors duration-200'><NavLink to='#'>PROCEED TO CHECKOUT</NavLink></Button>
                        <Button className='w-full rounded-none text-sm font-extrabold tracking-wider shadow-none hover:shadow-none bg-transparent hover:bg-black hover:text-white text-black border-2 transition-colors duration-200'><NavLink to='/'>CONTINUE SHOPPING</NavLink></Button>
                    </div>
                </div>
            </Container>
            : <Spinner className='h-[100vh]' />
    )
}

export default Cart