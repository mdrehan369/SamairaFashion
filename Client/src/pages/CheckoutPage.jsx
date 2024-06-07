import React, { useEffect, useState } from 'react'
import { Container, Input, Button, Spinner, LightSpinner } from "../components/index.js"
import { useForm } from "react-hook-form"
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faIndianRupeeSign, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import visa from "../assets/visa.svg";
import mastercard from "../assets/mastercard.svg";
import tabby from "../assets/tabby.webp";
import { useNavigate } from 'react-router-dom';
import { setShippingDetails } from "../store/authslice.js"

function CheckoutPage() {

    const user = useSelector(state => state.auth.user);
    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        defaultValues: user?.shippingDetails || null
    })
    const [cart, setCart] = useState([]);
    const [loader, setLoader] = useState(true);
    const data = JSON.parse(localStorage.getItem("product"));
    const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);
    const [total, setTotal] = useState();
    const [isCOD, setIsCOD] = useState(false);
    const [isCODAvailable, setIsCODAvailable] = useState(user?.shippingDetails?.country.includes('United Arab Emirates') || false);
    const [isIndianDelivery, setIsIndianDelivery] = useState(user?.shippingDetails?.country === 'India' || true);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [checkoutMethod, setCheckoutMethod] = useState(!isIndia ? 'phonepe' : 'ziina');
    const [buttonLoader, setButtonLoader] = useState(false);
    const [error, setErr] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        ; (async () => {
            setLoader(true);
            try {
                if (data === null) {
                    const response = await axios.get(`/api/v1/users/cart`, {
                        baseURL: import.meta.env.VITE_BACKEND_URL,
                        withCredentials: true,
                    });
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
                }
                else {
                    setCart([{ ...data }]);
                    if (isIndia) {
                        setTotal(data.quantity * data.product[0].price);
                    } else {
                        setTotal(data.quantity * data.product[0].price / dirham_to_rupees);
                    }
                }

            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
            }
        })();

        return () => {
            localStorage.clear("product");
        }
    }, []);

    const handlePhonepePayment = async (shippingDetails) => {

        if (!validateData(shippingDetails)) return;

        let res = await axios.get(`/api/v1/payments/phonepe/pay?amount=${total}`, {
            baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
        }).then(res => {
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

    const handleZiinaCheckout = async (shippingDetails) => {

        if (!validateData(shippingDetails)) return;

        const { firstName, lastName, email, number, country, city, state, address, nearBy, pincode } = shippingDetails;

        try {

            const response = await axios.post('/api/v1/payments/ziina/pay', { cart, isIndia, dirham_to_rupees, shippingDetails: { firstName, lastName, email, number, country, city, state, address, nearBy, pincode, deliveryCharge: deliveryCharge } }, {
                baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
            });

            const paymentObj = {
                type: '',
                id: '',

            }

            localStorage.setItem("ziinaId", response.data.data.id);
            window.open(response.data.data.url);
            // console.log(response);

        } catch (error) {
            console.log(error);
        }

    }

    const handleCheckout = async (shippingDetails) => {

        if (!validateData(shippingDetails)) return;
        setButtonLoader(true);
        const { firstName, lastName, email, number, country, city, state, address, nearBy, pincode } = shippingDetails;

        try {

            const response = await axios.post(`/api/v1/payments/${checkoutMethod}/pay`, { cart, isIndia, dirham_to_rupees, shippingDetails: { firstName, lastName, email, number, country, city, state, address, nearBy, pincode, deliveryCharge: deliveryCharge } }, {
                baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
            });

            const paymentObj = {
                type: checkoutMethod,
                id: response.data.data.id,
            }

            localStorage.setItem("paymentObj", JSON.stringify(paymentObj));
            dispatch(setShippingDetails(shippingDetails));

            window.open(response.data.data.url, '_self');

        } catch (error) {
            console.log(error);
            setErr("Sorry! Some Error Occured. Please Recheck Your Details");
        } finally {
            setButtonLoader(false);
        }

    }

    const handleCOD = async (shippingDetails) => {

        if (!validateData(shippingDetails)) return;

        const { firstName, lastName, email, number, country, city, state, address, nearBy, pincode } = shippingDetails;

        if (isCOD) {

            try {
                await axios.post('/api/v1/orders', { cart, isIndia, dirham_to_rupees, shippingDetails: { firstName, lastName, email, number, country, city, state, address, nearBy, pincode, deliveryCharge: deliveryCharge } }, {
                    baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
                });
            } catch (err) {
                console.log(err);
                setErr("Sorry! Some Error Occured. Please Try Again Later");
            }

            dispatch(setShippingDetails(shippingDetails));
            localStorage.setItem("paymentObj", JSON.stringify({ type: 'COD' }))
            return navigate('/success')
        }

    }

    const handleTabbyCheckout = async (shippingDetails) => {

        if (!validateData(shippingDetails)) return;

        const { firstName, lastName, email, number, country, city, state, address, nearBy, pincode } = shippingDetails;

        if (isCOD) {

            await axios.post('/api/v1/orders', { cart, isIndia, dirham_to_rupees, shippingDetails: { firstName, lastName, email, number, country, city, state, address, nearBy, pincode, deliveryCharge: deliveryCharge } }, {
                baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
            });

            dispatch(setShippingDetails(shippingDetails));

            return navigate('/success?cod=cod')
        }

        try {

            const response = await axios.post('/api/v1/payments/tabby/pay', { cart, isIndia, dirham_to_rupees, shippingDetails: { firstName, lastName, email, number, country, city, state, address, nearBy, pincode, deliveryCharge: deliveryCharge } }, {
                baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
            });

            localStorage.setItem("tabbyId", response.data.data.id);
            window.open(response.data.data.url);

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <Container className='w-full flex md:flex-row font-sans flex-col md:items-start items-center justify-center divide-x-2'>
            {!loader ?
                <>
                    <form
                        onSubmit={handleSubmit(isCOD ? handleCOD : handleCheckout)}
                        className='md:w-[50%] w-[90%] py-10 min-h-[85vh] md:max-h-[90vh] flex flex-col md:items-start items-center relative justify-start gap-4 md:overflow-y-scroll'
                    >
                        {
                            error &&
                            <div className='sticky w-[80%] z-20 -top-10 left-0 animate-animate-appear py-2 rounded bg-red-400 dark:bg-red-500 font-medium text-center'>
                                <FontAwesomeIcon icon={faTriangleExclamation} className='mr-2 text-red-800' />
                                {error}
                            </div>
                        }
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
                                onInput={(e) => {
                                    e.currentTarget.value === 'India' ? setIsIndianDelivery(true) : setIsIndianDelivery(false);
                                    e.currentTarget.value.includes('United Arab Emirates') ? setIsCODAvailable(true) : setIsCODAvailable(false);
                                }}
                                {...register('country', { required: true })}>
                                <option value="India" selected onClick={() => setDeliveryCharge(0)}>India</option>
                                <option value="Bahrain" onClick={() => setDeliveryCharge(20)}>Bahrain</option>
                                <option value="Kuwait" onClick={() => setDeliveryCharge(20)}>Kuwait</option>
                                <option value="Oman" onClick={() => setDeliveryCharge(20)}>Oman</option>
                                <option value="Qatar" onClick={() => setDeliveryCharge(20)}>Qatar</option>
                                <option value="Saudi Arabia" onClick={() => setDeliveryCharge(20)}>Saudi Arabia</option>
                                <option value="United Arab Emirates, Dubai" onClick={() => setDeliveryCharge(0)}>United Arab Emirates, Dubai</option>
                                <option value="United Arab Emirates, Sharjah" onClick={() => setDeliveryCharge(0)}>United Arab Emirates, Sharjah</option>
                                <option value="United Arab Emirates, Ajman" onClick={() => setDeliveryCharge(0)}>United Arab Emirates, Ajman</option>
                                <option value="United Arab Emirates, Abu Dhabi" onClick={() => setDeliveryCharge(20)}>United Arab Emirates, Abu Dhabi</option>
                                <option value="United Arab Emirates, Umm Al Quwain" onClick={() => setDeliveryCharge(20)}>United Arab Emirates, Umm Al Quwain</option>
                                <option value="United Arab Emirates, Ras Al Khaimah" onClick={() => setDeliveryCharge(20)}>United Arab Emirates, Ras Al Khaimah</option>
                                <option value="United Arab Emirates, Fujairah" onClick={() => setDeliveryCharge(20)}>United Arab Emirates, Fujairah</option>
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

                        {isIndianDelivery &&
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
                        }

                        <Input
                            register={register}
                            name='number'
                            label='Phone Number(with country code)'
                            placeholder='ex. +919323140987'
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
                            <div onClick={() => { setIsCOD(false); setCheckoutMethod('ziina') }} className='flex cursor-pointer items-center dark:bg-secondary-color  justify-start gap-2 bg-gray-100 border-[1px] border-gray-300 w-[100%] p-3 border-b-black dark:border-b-slate-800 dark:border-0'>
                                <div className={`${checkoutMethod === 'ziina' ? 'border-4' : 'border-2'} size-4 border-black dark:border-white rounded-full`}></div>
                                <div>Pay with Ziina</div>
                                <div className='flex items-center justify-end flex-grow'>
                                    <img src={visa} alt="visa" />
                                    <img src={mastercard} alt="mastercard" />
                                </div>
                            </div>
                            <div className='w-full p-3 h-[30vh] bg-gray-100 dark:bg-secondary-color dark:text-white flex flex-col items-center justify-start'>
                                <FontAwesomeIcon icon={faCreditCard} className='size-32 text-stone-600 dark:text-white' />
                                <div className='md:w-[60%] w-full text-center text-black text-md dark:text-white'>
                                    After clicking “Pay now”, you will be redirected to Pay by card with Ziina to complete your purchase securely.
                                </div>
                            </div>
                        </div>

                        <div onClick={() => { setIsCOD(false); setCheckoutMethod('tabby') }} className='bg-gray-100 dark:bg-secondary-color cursor-pointer md:w-[80%] w-full p-3 flex items-center gap-2'>
                            <div className={`${checkoutMethod === 'tabby' ? 'border-4' : 'border-2'} size-4 border-2 border-black dark:border-white rounded-full`}></div>
                            <span>Pay in 4 easy installments with Tabby</span>
                            <img src={tabby} alt="tabby" className='w-14 mx-0 justify-self-end' />
                        </div>

                        {
                            isCODAvailable &&
                            <div onClick={() => { setIsCOD(true); setCheckoutMethod('COD') }} className='bg-gray-100 dark:bg-secondary-color cursor-pointer md:w-[80%] w-full p-3 flex items-center gap-2'>
                                <div className={`${isCOD ? 'border-4' : 'border-2'} size-4 border-2 border-black dark:border-white rounded-full`}></div>
                                Cash On Delivery (COD)
                            </div>
                        }
                        <div className='w-full md:hidden block space-y-2'>
                            <div className='flex items-center justify-between text-md font-medium text-stone-700 dark:text-white'><span>Subtotal:</span><span>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{total}</span></div>
                            <div className='flex items-center justify-between text-md font-medium text-stone-700 dark:text-white'><span>Shipping:</span><span>{
                                deliveryCharge ?
                                    isIndia ? <><FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /><span>{dirham_to_rupees * deliveryCharge}</span></>
                                        : 'Dhs. 20'
                                    : 'Free'
                            }</span></div>
                            <div className='flex items-center justify-between text-xl font-medium'><span>Total:</span><span>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{total + (isIndia ? deliveryCharge * dirham_to_rupees : deliveryCharge)}</span></div>
                        </div>
                        <Button type='submit' className='md:w-[80%] w-full' disabled={loader}>
                            {
                                buttonLoader ?
                                    <LightSpinner color={'fill-gray-500'} /> :
                                    isCOD ? 'Place Order' : 'Pay Now'
                            }
                        </Button>
                    </form>
                    <div className='md:flex hidden flex-col items-start justify-start gap-6 w-[30%] min-h-[85vh]'>
                        <div className='flex flex-col items-center justify-start w-full p-10 gap-6 overflow-y-scroll max-h-[80vh]'>
                            {cart.map((item, index) => <div key={index} className='flex items-start justify-start w-full h-[15vh]'>
                                <div className='relative w-[20%] h-full p-3'>
                                    <div className='absolute rounded-full bg-gray-200 dark:text-black top-[-4px] size-6 text-center right-[-4px]'>{item.quantity}</div>
                                    <img src={item.product[0].image?.url || item.product[0].images[0].url} className='w-full h-[70%] object-cover' alt="Product" />
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
                                <div className='flex items-center justify-between text-md font-medium text-stone-700 dark:text-white'><span>Shipping:</span><span>{
                                    deliveryCharge ?
                                        isIndia ? <><FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /><span>{dirham_to_rupees * deliveryCharge}</span></>
                                            : 'Dhs. 20'
                                        : 'Free'
                                }</span></div>
                                <div className='flex items-center justify-between text-xl font-medium'><span>Total:</span><span>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{total + (isIndia ? deliveryCharge * dirham_to_rupees : deliveryCharge)}</span></div>
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