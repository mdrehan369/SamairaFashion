import React, { useState, useEffect } from 'react';
import { Container, Spinner } from "../components/index.js";
import axios from "axios";
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

function convertISOToDateString(isoString) {

    let date;
    if (!isoString) {
        date = new Date();
    } else {
        date = new Date(isoString);
    }

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    const dateString = date.toLocaleDateString('en-US', options);

    return dateString;
}

const addDays = (date, days = 6) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return convertISOToDateString(newDate.toISOString());
}

const Batch = ({ text, color, darkColor }) => {
    return (
        <span className={`${color} text-xs font-bold dark:${darkColor} ml-4 px-2 py-2 rounded`}>
            {text}
        </span>
    )
}

const OrderDetails = () => {

    const [orders, setOrders] = useState([]);
    const [loader, setLoader] = useState(true);
    const [currOrder, setCurrOrder] = useState({});
    const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);
    const [openModal, setOpenModal] = useState(false);

    const handleData = async () => {
        try {
            const response = await axios.get(`/api/v1/orders`);
            let myOrders = {};
            for (let i = 0; i < response.data.data.length; i++) {
                myOrders[response.data.data[i]._id.slice(0, 10)] = response.data.data[i];
            }
            setOrders(myOrders);
            setCurrOrder(response.data.data[0]);
        } catch (err) {
            console.log(err);
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
        setLoader(true);
        handleData();
    }, []);

    const handleCancelOrder = async (orderId) => {
        setLoader(true);
        try {
            await axios.get(`/api/v1/orders/cancel/${orderId}`);
            setOpenModal(false);
            handleData()
        } catch (err) {
            console.log(err);
        }
    }

    return (
        !loader ?
            <Container className='flex items-start justify-between min-h-[100vh]'>
                {currOrder ?
                    <>
                        {
                            openModal &&
                            <div className='fixed w-[100vw] h-[90vh] bg-black bg-opacity-50 z-50 flex items-center justify-center'>
                                <div className='w-[30%] h-[25%] bg-white p-4 flex flex-col items-center justify-center shadow-lg rounded-md gap-10 dark:bg-secondary-color'>
                                    <div className='uppercase text-sm font-medium'>Are You Sure You Want To Cancel This Order?</div>
                                    <div className='space-x-6'>
                                        <button className='px-4 rounded-md py-2 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-sm font-bold' onClick={() => handleCancelOrder(currOrder._id)}>Yes</button>
                                        <button className='px-4 rounded-md py-2 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-sm font-bold' onClick={() => setOpenModal(false)}>No</button>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className='bg-gray-100 dark:bg-secondary-color flex flex-col items-center justify-start pt-4 w-[20%] h-[100vh] gap-2'>
                            {
                                Object.keys(orders).map((order, index) => <div
                                    key={index}
                                    onClick={() => setCurrOrder(orders[order])}
                                    className={`w-[90%] rounded-md p-4 bg-gray-200 dark:bg-blue-950 dark:border-0 dark:hover:border-0 dark:hover:bg-[#2c4682] dark:text-white cursor-pointer hover:border-gray-400 hover:bg-gray-300 transition-colors border-[1px] text-sm font-medium ${currOrder._id.slice(0, 10) === order && 'border-gray-400 bg-gray-300 dark:bg-[#2c4682]'} text-gray-800 tracking-wider`}>
                                    <span className='font-bold text-xs text-gray-700 dark:text-gray-300 mr-4'>ORDER ID: </span>#{order || Date.now()}
                                </div>)
                            }
                        </div>
                        <div className='min-h-[90vh] w-[75%] flex flex-col items-start pt-10 justify-start divide-y-2 dark:divide-gray-400 overflow-y-scroll'>
                            <div className='mb-4 flex items-start justify-between w-[80%]'>
                                <div>
                                    <h1 className="text-2xl font-bold mb-2"><span className='mr-4'>Order ID:</span> <span className='tracking-wider text-gray-600 dark:text-gray-400'>#{currOrder._id.slice(0, 10)}</span>
                                        {
                                            currOrder.isCancelled ?
                                                <Batch text='Cancelled' color='bg-red-400' darkColor='bg-red-500' />
                                                : currOrder.isPending ?
                                                    <Batch text='Pending' color='bg-yellow-400' darkColor='bg-yellow-600' />
                                                    : <Batch text='Delivered' color='bg-green-400' darkColor='bg-green-600' />
                                        }
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">Order date: {convertISOToDateString(currOrder.date).slice(0, 12)}</p>
                                    {
                                        !currOrder.isCancelled &&
                                        (currOrder.isPending ?
                                            <p className="text-green-500 mt-2">Estimated delivery: {addDays(currOrder.date || new Date()).slice(0, 12)}</p>
                                            : <p className="text-green-500 mt-2">Delivered On: {convertISOToDateString(currOrder.deliveredDate).slice(0, 12)}</p>)
                                    }
                                </div>
                                {
                                    !currOrder.isCancelled &&
                                    <button className='self-end bg-red-400 dark:bg-red-500 dark:hover:bg-red-600 px-6 hover:bg-red-500 transition-colors py-2 rounded text-sm font-bold' onClick={() => setOpenModal(true)}>Cancel</button>
                                }
                            </div>
                            <div className='w-[80%] flex flex-col items-start justify-start gap-4 py-4'>
                                {
                                    currOrder.cart.map((item, index) => <div
                                        key={index}
                                        className='flex items-start justify-between gap-4 h-[15vh] w-full p-2'
                                    >
                                        <div className='flex w-auto gap-4 h-full'>
                                            <div className='w-[8vw] h-full p-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded'>
                                                <img src={currOrder.products[index].image.url} className='w-auto rounded h-auto max-h-[70%] max-w-[90%]' alt="Product" />
                                            </div>
                                            <div className='flex flex-col h-full items-start justify-evenly'>
                                                <span className='font-bold mt-4'>{currOrder.products[index].title}</span>
                                                <pre className='text-gray-600 dark:text-gray-400 text-xs'>
                                                    Color: <span className='text-sm font-bold'>{item.color}</span> | Size: <span className='text-sm font-bold'>{item.size}</span> | Quantity: <span className='text-sm font-bold'>{item.quantity}</span>
                                                </pre>
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center h-full justify-center'>
                                            <div className='relative text-gray-500 dark:text-gray-400 w-fit'>
                                                {
                                                    isIndia ?
                                                        <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' />
                                                        : 'Dhs. '
                                                }
                                                {isIndia ? currOrder.products[index].comparePrice * item.quantity : Math.floor(currOrder.products[index].comparePrice / dirham_to_rupees) * item.quantity}
                                                <div className='absolute w-full top-[50%] left-0 h-[2px] bg-gray-400'></div>
                                            </div>
                                            <div className='text-xl font-bold'>
                                                {
                                                    isIndia ?
                                                        <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' />
                                                        : 'Dhs. '
                                                }
                                                {isIndia ? currOrder.products[index].price * item.quantity : Math.floor(currOrder.products[index].price / dirham_to_rupees) * item.quantity}
                                            </div>
                                        </div>
                                    </div>)
                                }
                            </div>
                            <div className='w-[80%] flex items-start justify-between px-20 pt-6'>
                                <div className='flex flex-col items-start justify-start gap-2'>
                                    <span className='font-bold'>Payment</span>
                                    <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>{currOrder.paymentPending ? 'Pending\nCash On Delivery' : 'Paid'}</span>
                                </div>
                                <div className=''>
                                    <span className='font-bold'>Delivery</span>
                                    <div className='text-sm font-medium mt-2 text-gray-500 dark:text-gray-400'>
                                        <p>{currOrder.shippingDetails.address}</p>
                                        <p>{currOrder.shippingDetails.city}</p>
                                        <p>{currOrder.shippingDetails.state}</p>
                                        <p>{currOrder.shippingDetails.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    : <div className='flex items-center justify-center font-bold text-2xl w-full h-[100vh]'>
                        There are no orders placed by you!
                    </div>}
            </Container>
            : <Spinner className='h-[100vh]' />
    );
}

export default OrderDetails;
