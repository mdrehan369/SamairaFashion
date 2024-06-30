import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Spinner, Container, Button } from "../components/index.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign, faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RiDeleteBinLine } from "react-icons/ri";
import sale from "../assets/sale.gif";

const Modal = ({ setModal, total, discount, isIndia, dirham_to_rupees, quantity }) => {
    return (
        <div className='fixed z-40 top-0 left-0 w-full h-[100vh] flex items-center justify-center bg-opacity-50 backdrop-blur-sm bg-black'>
            <div className='bg-white p-4 rounded-md md:w-[20%] w-[90%] h-[70%] animate-animate-appear space-y-3 relative'>
                <div><FontAwesomeIcon icon={faXmark} className='absolute top-2 right-2 bg-transparent hover:bg-gray-200 transition-colors rounded p-1 size-4 cursor-pointer text-gray-400' onClick={() => setModal(false)} /></div>
                <img src={sale} className='' />
                <h1 className='text-lg font-bold text-center w-full px-6'>Congratulations!</h1>
                <p className='w-full text-center text-gray-500 text-sm'>You got additional {quantity >= 6 ? '15%' : '10%'} discount as you ordered {quantity} items</p>
                <div className='w-full px-6 text-center text-gray-500 text-sm'>
                    <p>Total Price: {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs. '}{isIndia ? total : Math.floor(total / dirham_to_rupees)}</p>
                    <p>Discounted Price: {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs. '}{isIndia ? total - discount : Math.floor((total - discount) / dirham_to_rupees)}</p>
                </div>
            </div>
        </div>
    )
}

function Cart() {

    const [loader, setLoader] = useState(true);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [reload, setReload] = useState(true);
    const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);
    const [openModel, setOpenModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        ; (async () => {
            let quantity = 0;
            try {
                const response = await axios.get(`/api/v1/users/cart`, {
                    baseURL: import.meta.env.VITE_BACKEND_URL,
                    withCredentials: true
                });
                setCart(response.data.data);

                let sum = 0;
                for (let item of response.data.data) {
                    if (!location) {
                        sum += Math.floor((item.quantity * item.product[0].price) / dirham_to_rupees)
                    } else {
                        sum += item.quantity * item.product[0].price
                    }
                    quantity += item.quantity;
                }

                setTotalItems(quantity);
                setTotal(sum);
            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
                if (quantity >= 3) {
                    setTimeout(() => { setOpenModal(true) }, 1000);
                }
            }
        })();
    }, [reload]);

    useEffect(() => {

        if (totalItems >= 6) {
            setDiscount(Math.round(total * 0.15));
        } else if (totalItems >= 3) {
            setDiscount(Math.round(total * 0.1));
        } else {
            setDiscount(0);
        }

    }, [totalItems])

    const handleQuantity = async (cartItem, qnty) => {
        try {
            await axios.put(`/api/v1/users/cart?cartItemId=${cartItem._id}&quantity=${qnty}`, {
                baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
            });
        } catch (err) {
            console.log(err);
        } finally {
            setReload(!reload);
        }
    }

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`/api/v1/users/cart/${id}`, {
                baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
            });
        } catch (err) {
            console.log(err);
        } finally {
            setReload(!reload);
        }
    }

    return (
        !loader ?
            <Container className='flex md:flex-row flex-col items-center font-sans justify-center h-auto md:gap-10 gap-4'>
                {
                    openModel &&
                    <Modal discount={discount} isIndia={isIndia} dirham_to_rupees={dirham_to_rupees} total={total} quantity={totalItems} setModal={setOpenModal} />
                }
                {total ?
                    <>
                        <div className='flex flex-col items-center justify-start md:h-[80vh] h-auto md:gap-10 gap-4 overflow-y-scroll md:w-auto w-full animate-animate-appear'>
                            <h1 className='self-start font-bold md:text-2xl text-xl md:ml-0 ml-3'>My Cart</h1>
                            {cart.map((item, index) =>
                                <div key={index} className='flex cursor-pointer items-center justify-start md:w-[60vw] w-[95%] md:h-[35vh] h-auto bg-[#f1f1f1] dark:bg-secondary-color divide-x-2 divide-gray-300 dark:divide-slate-800'>
                                    <div className='w-[25%] md:h-full h-[90%] md:p-3 p-1'>
                                        <img src={item.product[0].image?.url || item.product[0].images[0].url} className='w-full h-full object-cover' alt="Product" />
                                    </div>
                                    <div className='h-full p-3 w-[75%] pr-10 flex flex-col items-start justify-start gap-0'>
                                        <h1 className='font-bold md:text-xl text-sm tracking-wide hover:underline' onClick={() => navigate(`/product/${item.product[0]._id}`)}>{item.product[0].title.slice(0, 100)}</h1>
                                        <p className='md:text-[0.92rem] text-xs text-gray-600 font-[450] tracking-wider h-[50%] md:mt-4 mt-2' dangerouslySetInnerHTML={{ __html: window.screen.width > 500 ? item.product[0].description.slice(0, 250) : '' }}></p>
                                        <div className='flex flex-wrap items-end justify-between w-full'>
                                            <div>
                                                <p className='md:text-sm text-xs text-gray-400 font-bold w-fit relative'>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{isIndia ? item.product[0].comparePrice : Math.floor(item.product[0].comparePrice / dirham_to_rupees)}<div className='bg-gray-400 absolute top-[50%] left-0 w-full h-[2px]'></div></p>
                                                <p className='md:text-xl text-sm font-bold'>{isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-1' /> : 'Dhs.'}{isIndia ? item.product[0].price : Math.floor(item.product[0].price / dirham_to_rupees)}</p>
                                            </div>
                                            <div>
                                                <h2 className='text-sm font-medium text-stone-700 dark:text-white'>Size: <span className='text-black dark:text-white'>{item.size || 52}</span></h2>
                                            </div>
                                            <div>
                                                <h2 className='text-sm font-medium text-stone-700 dark:text-white'>Color: <span className='text-black dark:text-white'>{item.product[0].color || 'Black'}</span></h2>
                                            </div>
                                            <div className='flex items-center justify-around border-[1px] border-gray-300 rounded-none md:w-32 w-20 mt-2 md:py-3 py-2 md:text-lg dark:text-white text-sm'>
                                                <div><FontAwesomeIcon icon={faMinus} className='cursor-pointer' onClick={() => handleQuantity(item, item.quantity - 1)} /></div>
                                                <div className='text-stone-600 dark:text-white'>{item.quantity}</div>
                                                <div><FontAwesomeIcon icon={faPlus} className='cursor-pointer' onClick={() => handleQuantity(item, item.quantity + 1)} /></div>
                                            </div>
                                        </div>
                                        <div className='text-xs flex items-center justify-between w-full mt-4 relative text-stone-700 dark:text-white font-medium'>
                                            <div>
                                                Subtotal: {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='font-normal mr-0.5 ml-1' /> : 'Dhs.'}
                                                <span className='font-bold text-stone-700 dark:text-white'>{isIndia ? item.product[0].price * item.quantity : Math.floor(item.product[0].price / dirham_to_rupees) * item.quantity}</span>
                                            </div>
                                            <RiDeleteBinLine className='hover:bg-gray-300 rounded-sm text-red-500 p-2 size-10 transition-colors' onClick={() => handleDeleteItem(item._id)} />
                                        </div>
                                    </div>
                                </div>)}
                        </div>
                        <div className='md:w-[20%] w-[90%] h-[60vh] flex flex-col items-start justify-start gap-10'>
                            <div className='font-bold w-full text-sm border-b-2 border-black'>ORDER SUMMARY</div>
                            <div className='w-full space-y-2'>
                                <div className='flex items-center justify-between w-full'><span className='font-bold text-sm text-black dark:text-white'>Subtotal:</span><span className='text-xl font-bold'>{isIndia ? <FontAwesomeIcon className='mr-2' icon={faIndianRupeeSign} /> : 'Dhs.'}{total}</span></div>
                                {discount !== 0 && <div className='flex items-center justify-between w-full'><span className='font-bold text-sm text-black dark:text-white'>Discount:</span><span className='text-xl font-bold'>{isIndia ? <FontAwesomeIcon className='mr-2' icon={faIndianRupeeSign} /> : 'Dhs.'}{discount}</span></div>}
                            </div>
                            <div className='flex flex-col items-center gap-4 justify-start w-full'>
                                <h1 className='font-bold text-sm self-start'>Coupon Code</h1>
                                <input type="text" className='w-[100%] h-[7vh] dark:bg-secondary-color dark:border-0 p-3 text-sm border-gray-300 border-[1px]' placeholder='Enter Coupon Code' />
                                <p className='text-sm text-gray-500'>Coupon Code will be applied on the checkout page</p>
                            </div>
                            <div className='flex items-center justify-between w-full'><span className='font-bold text-sm text-black dark:text-white'>Total:</span><span className='text-xl font-bold'>{isIndia ? <FontAwesomeIcon className='mr-2' icon={faIndianRupeeSign} /> : 'Dhs.'}{total - discount}</span></div>
                            <div className='w-full space-y-4'>
                                <NavLink to='/checkoutPage'><Button className='w-full rounded-none text-sm font-extrabold tracking-wider hover:bg-transparent hover:text-black shadow-none hover:shadow-none border-2 transition-colors duration-200'>PROCEED TO CHECKOUT</Button></NavLink>
                                <Button className='w-full rounded-none text-sm font-extrabold tracking-wider shadow-none hover:shadow-none bg-transparent hover:bg-black hover:text-white text-black border-2 transition-colors duration-200'><NavLink to='/'>CONTINUE SHOPPING</NavLink></Button>
                            </div>
                        </div>
                    </>
                    : <h1 className='text-2xl font-bold text-center'>
                        Nothing Is There In The Cart!<br />Add Some Products
                    </h1>
                }
            </Container>
            : <Spinner className='h-[100vh]' />
    )
}

export default Cart