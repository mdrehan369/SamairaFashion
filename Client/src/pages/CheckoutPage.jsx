import React, { useEffect, useRef, useState } from 'react'
import { Container, Input, Button, Spinner } from "../components/index.js"
import { useForm } from "react-hook-form"
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import visa from "../assets/visa.svg";
import mastercard from "../assets/mastercard.svg";
import visa2 from "../assets/visa2.svg";
import { loadStripe } from '@stripe/stripe-js';

function CheckoutPage() {

    const { register, handleSubmit } = useForm()
    // const [places, setPlaces] = useState([]);
    const [cart, setCart] = useState([]);
    const [loader, setLoader] = useState(true);
    // const [address, setAddress] = useState("");
    const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);
    let total = useRef();

    useEffect(() => {
        ; (async () => {
            setLoader(true);
            try {
                const response = await axios.get(`/api/v1/users/cart`);
                setCart(response.data.data);

                let sum = 0;
                for (let item of response.data.data) {
                    if (!isIndia) {
                        sum += Math.floor((item.quantity * item.product[0].price) / dirham_to_rupees)
                    } else {
                        sum += item.quantity * item.product[0].price
                    }
                }

                total.current = sum;

            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
            }
        })();
    }, []);

    const submit = async (data) => {
        console.log(data);
    }


    const data = {
        name: 'MD Rehan',
        amount: 1,
        number: '6290197361',
        MUID: "MUID" + Date.now(),
        transactionId: 'T' + Date.now(),
    }

    const getPlaces = async (input) => {
        try {
            // const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=kar&key=AIzaSyAIJxqZEoeFfulcYyCnltXeEFxbovtV-Vk');
            const response = await fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=kar&key=AIzaSyAIJxqZEoeFfulcYyCnltXeEFxbovtV-Vk', { method: "GET", mode: 'cors', headers: { 'Content-Type': 'application/json', } }).then(response => response.json())
            console.log(response)
        } catch (err) {
            console.log(err);
        }
    }

    const handlePayment = async (e) => {

        let res = await axios.post('/api/order', { ...data }).then(res => {

            console.log(res)
            if (res.data && res.data.data.instrumentResponse.redirectInfo.url) {
                window.location.href = res.data.data.instrumentResponse.redirectInfo.url;
            }
        })
            .catch(error => {
                console.error(error);
            });

    }

    const handleCheckout = async () => {

        const stripe = await loadStripe('pk_test_51PGhn5JZgatvWpsF1qMJO575K89xhvyj6hN0SFmXoByUP3xNjDgHuKfyWMj5HrJffHP4bHDFOUzjolQ5nNr6owsI00WfufIEGT');

        const session = await axios.post('/api/v1/products/create-checkout', { cart, isIndia, dirham_to_rupees });
        // console.log(session)
        const results = await stripe.redirectToCheckout({
            sessionId: session.data.data.id,
        });

        if(results.error) console.log(results.error);
    }

    return (
        <Container className='w-full flex items-start justify-center divide-x-2'>
            {!loader ?
                <>
                    <form onSubmit={isIndia ? handleSubmit(handlePayment) : handleSubmit(handleCheckout)} className='w-[50%] py-10 min-h-[85vh] max-h-[90vh] flex flex-col items-start justify-start gap-4 overflow-y-scroll'>
                        <h1 className='text-xl font-bold'>Contact</h1>
                        <Input register={register} name='email' placeholder='Email' className='w-[80%] bg-white' />
                        <h1 className='text-xl font-bold'>Delivery</h1>
                        <select className='w-[80%] p-3 rounded bg-white border-[1px] border-gray-400 cursor-pointer' {...register('country')}>
                            <option value="" selected>Select Country</option>
                            <option value="bahrain">Bahrain</option>
                            <option value="india">India</option>
                            <option value="kuwait">Kuwait</option>
                            <option value="oman">Oman</option>
                            <option value="qatar">Qatar</option>
                            <option value="saudi arabia">Saudi Arabia</option>
                            <option value="united arab emirates">United Arab Emirates</option>
                        </select>
                        <div className='w-[80%] flex items-center justify-start gap-2'>
                            <Input register={register} name='firstName' placeholder='First Name' className='w-[100%] bg-white' />
                            <Input register={register} name='lastName' placeholder='Last Name' className='w-[100%] bg-white' />
                        </div>
                        <Input register={register} name='address' placeholder='Address' className='w-[80%] bg-white' />
                        <Input register={register} name='apartment/suite' placeholder='Apartment, Suite, etc.' className='w-[80%] bg-white' />
                        <div className='w-[80%] flex items-center justify-between gap-2'>
                            <Input register={register} name='city' placeholder='City' className='w-full bg-white' />
                            <Input register={register} name='state' placeholder='State' className='w-full bg-white' />
                            <Input register={register} name='pincode' placeholder='Pincode' className='w-full bg-white' />
                        </div>
                        <Input register={register} name='number' placeholder='Phone' className='w-[80%] bg-white' />

                        <h1 className='font-bold text-black text-xl'>Shipping Method</h1>
                        <div className='w-[80%] bg-gray-100 border-[1px] border-gray-300 p-4 flex justify-between'>
                            <span>Pan India : Free Delivery Offer</span>
                            <span>Free</span>
                        </div>
                        <div>
                            <h1>Payment</h1>
                            <p>All transactions are secure and encrypted.</p>
                        </div>
                        <div className='w-[80%]'>
                            <div className='flex items-center justify-start gap-2 bg-gray-100 border-[1px] border-gray-300 w-[100%] p-3 border-b-black'>
                                <div className='size-4 border-4 border-black rounded-full'></div>
                                <div>Pay by card with Stripe</div>
                                <div className='flex items-center justify-end flex-grow'>
                                    <img src={visa} alt="visa" />
                                    <img src={mastercard} alt="mastercard" />
                                    <img src={visa2} alt="visa2" />
                                </div>
                            </div>
                            <div className='w-full p-3 h-[30vh] bg-gray-100 flex flex-col items-center justify-start'>
                                <FontAwesomeIcon icon={faCreditCard} className='size-32 text-stone-600' />
                                <div className='w-[60%] text-center text-black text-md'>
                                After clicking “Pay now”, you will be redirected to Pay by card with Stripe to complete your purchase securely.
                                </div>
                            </div>
                        </div>
                        <Button type='submit' className='w-[80%]' onClick={handleCheckout}>Pay Now</Button>
                    </form>
                    <div className='flex flex-col items-start justify-start gap-6 w-[30%] min-h-[85vh]'>
                        <div className='flex flex-col items-center justify-start w-full p-10 gap-6 overflow-y-scroll max-h-[80vh]'>
                            {cart.map((item, index) => <div key={index} className='flex items-start justify-start w-full h-[15vh]'>
                                <div className='relative w-[20%] h-full p-3'>
                                    <div className='absolute rounded-full bg-gray-200 top-[-4px] size-6 text-center right-[-4px]'>{item.quantity}</div>
                                    <img src={item.product[0].image.url} className='w-full h-[70%] object-cover' alt="Product" />
                                </div>
                                <div className='w-[60%] h-full px-4 py-3 flex flex-col items-start justify-between'>
                                    <div className='font-bold text-stone-600 line-clamp-2'>{item.product[0].title}</div>
                                    <div className='text-sm font-bold text-stone-400'>{item.color || 'Black'}/{item.size || 52}</div>
                                </div>
                                <div className='flex items-center justify-between mt-4 w-[20%] flex-col'>
                                    <h2 className='px-0 text-sm text-start font-bold relative text-stone-600'>
                                        <div className='w-full h-[2px] bg-stone-600 absolute top-[50%] left-0'></div>
                                        {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /> : 'Dhs.'}{isIndia ? item.product[0].comparePrice * item.quantity : Math.floor(item.product[0].comparePrice / dirham_to_rupees)}
                                    </h2>
                                    <h2 className='px-0 text-lg text-end font-bold text-stone-900'>
                                        {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /> : 'Dhs.'}{isIndia ? (item.product[0].price * item.quantity).toString()[0] + "," + item.product[0].price.toString().slice(1) : Math.floor(item.product[0].price / dirham_to_rupees)}
                                    </h2>
                                </div>
                            </div>)}
                            <div className='flex items-center justify-between w-full'>
                                <input type="text" className='w-[80%] h-[7vh] p-3 rounded-sm border-[1px] border-gray-300 focus:border-black focus:ring-0 outline-none' placeholder='Discount Code' />
                                <button className='p-3 border-[1px] border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-sm font-medium'>Apply</button>
                            </div>
                            <div className='w-full space-y-2'>
                                <div className='flex items-center justify-between text-md font-medium text-stone-700'><span>Subtotal:</span><span>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{total.current}</span></div>
                                <div className='flex items-center justify-between text-md font-medium text-stone-700'><span>Shipping:</span><span>Free</span></div>
                                <div className='flex items-center justify-between text-xl font-medium'><span>Total:</span><span>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{total.current}</span></div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                </>
                : <Spinner />
            }
        </Container>
    )
}

export default CheckoutPage