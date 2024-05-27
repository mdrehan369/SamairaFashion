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
import sha256 from 'sha256';
import { Buffer } from "buffer"
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {

    const { register, handleSubmit, setError, formState: { errors } } = useForm()
    const [cart, setCart] = useState([]);
    const [loader, setLoader] = useState(true);
    const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);
    const [total, setTotal] = useState();
    const [isCOD, setIsCOD] = useState(false);
    const navigate = useNavigate();

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

                setTotal(sum)

            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
            }
        })();
    }, []);

    const getPlaces = async (input) => {
        try {
            // const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=kar&key=AIzaSyCpWSpiBip2Tz-fb9_LbSDiJlRKsuGtC1o');
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=kar&key=AIzaSyCpWSpiBip2Tz-fb9_LbSDiJlRKsuGtC1o')
            // const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=700017&key=AIzaSyAIJxqZEoeFfulcYyCnltXeEFxbovtV-Vk')
            //AIzaSyCpWSpiBip2Tz-fb9_LbSDiJlRKsuGtC1o
            //https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=
            //new----
            //AIzaSyAIJxqZEoeFfulcYyCnltXeEFxbovtV-Vk
            console.log(response)
        } catch (err) {
            console.log(err);
        }
    }

    const handlePhonepePayment = async (shippingDetails) => {

        if (!validateData(shippingDetails)) return;

        let res = await axios.get(`/api/v1/payments/phonepe/pay?amount=${total}`).then(res => {
            if (res.data && res.data.data.instrumentResponse.redirectInfo.url) {
                window.location.href = res.data.data.instrumentResponse.redirectInfo.url;
            }
            window.location.href = res.data;
        })
            .catch(error => {
                console.error(error);
            });
    }

    const validateData = (shippingDetails) => {

        let isError = false;
        Object.keys(shippingDetails).map((key) => {
            if (!shippingDetails[key] || shippingDetails[key] === '') {
                setError(key, { type: "required", message: "Please Fill Out This Field" });
                isError = true;
            }
        })

        if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(shippingDetails.email) === false) setError("email", { type: "pattern", message: "Please Enter The Correct Email Address" }, { shouldFocus: true }), isError = true;

        if (isNaN(shippingDetails.number)) setError("number", { type: 'pattern', message: "Please Enter A Valid Number" }, { shouldFocus: true }), isError = true;

        if (isNaN(shippingDetails.pincode)) setError("pincode", { type: 'pattern', message: "Please Enter A Valid Number" }, { shouldFocus: true }), isError = true;

        if (isError) {
            window.scrollTo(0, 0);
            return false
        } else {
            return true;
        }

    }

    const handleCheckout = async (shippingDetails) => {

        if (!validateData(shippingDetails)) return;

        const { firstName, lastName, email, number, country, city, state, address, nearBy, pincode } = shippingDetails;

        if(isCOD) {

            await axios.post('/api/v1/orders', { cart, isIndia, dirham_to_rupees, shippingDetails: { firstName, lastName, email, number, country, city, state, address, nearBy, pincode } });

            return navigate('/success?cod=cod')
        }

        const stripe = await loadStripe('pk_test_51PGhn5JZgatvWpsF1qMJO575K89xhvyj6hN0SFmXoByUP3xNjDgHuKfyWMj5HrJffHP4bHDFOUzjolQ5nNr6owsI00WfufIEGT');

        const session = await axios.post('/api/v1/products/create-checkout', { cart, isIndia, dirham_to_rupees, shippingDetails: { firstName, lastName, email, number, country, city, state, address, nearBy, pincode } });

        const results = await stripe.redirectToCheckout({
            sessionId: session.data.data.id
        });

        if (results.error) console.log("Error in Checkout page", results.error);
    }

    return (
        <Container className='w-full flex md:flex-row flex-col md:items-start items-center justify-center divide-x-2'>
            {!loader ?
                <>
                    <form
                        onSubmit={handleSubmit(handleCheckout)}
                        className='md:w-[50%] w-[90%] py-10 min-h-[85vh] md:max-h-[90vh] flex flex-col md:items-start items-center justify-start gap-4 md:overflow-y-scroll'
                    >
                        <h1 className='text-xl font-bold self-start'>Contact</h1>

                        <Input
                            register={register}
                            name='email'
                            label='Email'
                            placeholder='ex. John123@example.com'
                            className='md:w-[80%] w-full bg-white'
                            errors={errors} />

                        <h1 className='text-xl font-bold self-start'>Delivery</h1>

                        <div className='md:w-[80%] w-full'>
                            <h1 className='text-stone-800 dark:text-white font-[450] text-sm'>Country</h1>
                            <select
                                className='md:w-[100%] p-3 rounded dark:bg-secondary-color dark:border-0 bg-white border-[1px] w-full border-gray-400 cursor-pointer'
                                {...register('country', { required: true })}>
                                <option value="india" selected>India</option>
                                <option value="bahrain">Bahrain</option>
                                <option value="kuwait">Kuwait</option>
                                <option value="oman">Oman</option>
                                <option value="qatar">Qatar</option>
                                <option value="saudi arabia">Saudi Arabia</option>
                                <option value="united arab emirates">United Arab Emirates</option>
                            </select>
                        </div>

                        <div className='md:w-[80%] w-full flex items-center justify-start gap-2'>
                            <Input
                                register={register}
                                name='firstName'
                                label='First Name'
                                placeholder='ex. John'
                                className='w-[100%] bg-white'
                                errors={errors} />

                            <Input
                                register={register}
                                name='lastName'
                                label='Last Name'
                                placeholder='ex. Smith'
                                className='w-[100%] bg-white'
                                errors={errors} />

                        </div>

                        <Input
                            register={register}
                            name='address'
                            label='Address'
                            placeholder='ex. 22/3 Golden View Apartments'
                            className='md:w-[80%] bg-white w-full'
                            errors={errors} />

                        <Input
                            register={register}
                            name='nearBy'
                            label='Nearby Places'
                            placeholder='Apartment, Suite, etc.'
                            className='md:w-[80%] w-full bg-white'
                            errors={errors} />

                        <div className='md:w-[80%] w-full flex items-center justify-between gap-2'>

                            <Input
                                register={register}
                                name='city'
                                label='City'
                                placeholder='ex. Kolkata'
                                className='w-full bg-white'
                                errors={errors} />

                            <Input
                                register={register}
                                name='state'
                                label='State'
                                placeholder='ex. West Bengal'
                                className='w-full bg-white'
                                errors={errors} />

                            <Input
                                register={register}
                                name='pincode'
                                label='Pincode'
                                placeholder='ex. 700017'
                                className='w-full bg-white'
                                errors={errors} />

                        </div>

                        <Input
                            register={register}
                            name='number'
                            label='Phone Number'
                            placeholder='ex. +91 9323140987'
                            className='md:w-[80%] w-full bg-white'
                            errors={errors} />

                        <h1 className='font-bold text-black text-xl self-start dark:text-white'>Shipping Method</h1>
                        <div className='md:w-[80%] w-full bg-gray-100 dark:bg-secondary-color border-[1px] border-gray-300 p-4 flex justify-between'>
                            <span>Pan India : Free Delivery Offer</span>
                            <span>Free</span>
                        </div>
                        <div className='w-full'>
                            <h1 className='text-xl dark:text-white font-bold text-black self-start'>Payment</h1>
                            <p className='text-stone-600 text-sm dark:text-gray-400'>All transactions are secure and encrypted.</p>
                        </div>
                        <div className='md:w-[80%] w-full'>
                            <div onClick={() => setIsCOD(false)} className='flex cursor-pointer items-center dark:bg-secondary-color  justify-start gap-2 bg-gray-100 border-[1px] border-gray-300 w-[100%] p-3 border-b-black dark:border-b-slate-800 dark:border-y-0'>
                                <div className={`${isCOD ? 'border-2' : 'border-4'} size-4 border-black dark:border-white rounded-full`}></div>
                                <div>Pay by card with Stripe</div>
                                <div className='flex items-center justify-end flex-grow'>
                                    <img src={visa} alt="visa" />
                                    <img src={mastercard} alt="mastercard" />
                                    <img src={visa2} alt="visa2" />
                                </div>
                            </div>
                            <div className='w-full p-3 h-[30vh] bg-gray-100 dark:bg-secondary-color dark:text-white flex flex-col items-center justify-start'>
                                <FontAwesomeIcon icon={faCreditCard} className='size-32 text-stone-600 dark:text-white' />
                                <div className='md:w-[60%] w-full text-center text-black text-md dark:text-white'>
                                    After clicking “Pay now”, you will be redirected to Pay by card with Stripe to complete your purchase securely.
                                </div>
                            </div>
                        </div>
                        <div onClick={() => setIsCOD(true)} className='bg-gray-100 cursor-pointer w-[80%] p-3 flex items-center gap-2'>
                        <div className={`${isCOD ? 'border-4' : 'border-2'} size-4 border-2 border-black dark:border-white rounded-full`}></div>
                            Cash On Delivery (COD)
                        </div>
                        <Button type='submit' className='md:w-[80%] w-full'>Pay Now</Button>
                    </form>
                    <div className='md:flex hidden flex-col items-start justify-start gap-6 w-[30%] min-h-[85vh]'>
                        <div className='flex flex-col items-center justify-start w-full p-10 gap-6 overflow-y-scroll max-h-[80vh]'>
                            {cart.map((item, index) => <div key={index} className='flex items-start justify-start w-full h-[15vh]'>
                                <div className='relative w-[20%] h-full p-3'>
                                    <div className='absolute rounded-full bg-gray-200 dark:text-black top-[-4px] size-6 text-center right-[-4px]'>{item.quantity}</div>
                                    <img src={item.product[0].image.url} className='w-full h-[70%] object-cover' alt="Product" />
                                </div>
                                <div className='w-[60%] h-full px-4 py-3 flex flex-col items-start justify-between'>
                                    <div className='font-bold text-sm text-stone-800 line-clamp-2 dark:text-white'>{item.product[0].title}</div>
                                    <div className='text-sm font-bold text-stone-400 dark:text-stone-300'>{item.color || 'Black'}/{item.size || 52}</div>
                                </div>
                                <div className='flex items-center justify-between mt-4 w-[20%] flex-col'>
                                    <h2 className='px-0 text-sm text-start font-bold relative text-stone-600 dark:text-stone-300'>
                                        <div className='w-full h-[2px] bg-stone-600 dark:bg-stone-300 absolute top-[50%] left-0'></div>
                                        {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /> : 'Dhs.'}{isIndia ? item.product[0].comparePrice * item.quantity : Math.floor(item.product[0].comparePrice / dirham_to_rupees) * item.quantity}
                                    </h2>
                                    <h2 className='px-0 text-lg text-end font-bold text-stone-900 dark:text-white'>
                                        {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /> : 'Dhs.'}{isIndia ? (item.product[0].price * item.quantity).toString()[0] + "," + (item.product[0].price * item.quantity).toString().slice(1) : Math.floor(item.product[0].price / dirham_to_rupees) * item.quantity}
                                    </h2>
                                </div>
                            </div>)}
                            <div className='flex items-center justify-between w-full'>
                                <input type="text" className='w-[80%] h-[7vh] p-3 rounded-sm border-[1px] border-gray-300 focus:border-black focus:ring-0 outline-none dark:bg-secondary-color dark:text-white' placeholder='Discount Code' />
                                <button className='p-3 border-[1px] border-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-blue-950 dark:text-white dark:border-0 text-gray-500 rounded-sm font-medium'>Apply</button>
                            </div>
                            <div className='w-full space-y-2'>
                                <div className='flex items-center justify-between text-md font-medium text-stone-700 dark:text-white'><span>Subtotal:</span><span>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{total}</span></div>
                                <div className='flex items-center justify-between text-md font-medium text-stone-700 dark:text-white'><span>Shipping:</span><span>Free</span></div>
                                <div className='flex items-center justify-between text-xl font-medium'><span>Total:</span><span>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{total}</span></div>
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