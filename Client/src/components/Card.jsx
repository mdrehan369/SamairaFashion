import { faIndianRupee, faIndianRupeeSign, faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from './Button';
import { Hourglass } from 'react-loader-spinner';
import { useSelector } from 'react-redux';

function Modal({ product, setOpenModal, isExiting, setIsExiting }) {

    const [productSize, setSize] = useState(52);
    const [quantity, setQuantity] = useState(1);
    const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);
    const [color, setColor] = useState(product.color);
    // const [allVariants, setAllVariants] = useState([]);
    const status = useSelector(state => state.auth.status);
    const navigate = useNavigate();

    const sizes = [52, 54, 56, 58, 60, 62, 'Customize As Per Request'];

    const handleModal = () => {
        setIsExiting(true);
        setTimeout(() => {
            setOpenModal(false);
            setIsExiting(false);
        }, 300);
    }

    const handleBuyNow = () => {

        if (!status) {
            return navigate('/signin')
        }

        const data = {
            productId: product._id,
            product: [{ ...product }],
            quantity: quantity,
            size: productSize,
            color: color
        }

        localStorage.setItem("product", JSON.stringify(data));

        navigate('/checkoutPage');
    }

    return (
        <div className={`fixed z-40 animate-animate-appear ${isExiting && ' animate-animate-disappear'} top-0 left-0 w-[100vw] bg-black backdrop-blur-sm bg-opacity-50 h-[100vh] flex items-center justify-center`}>
            <div id='modal' className={`w-[50%] h-[70%] bg-white shadow-lg relative rounded-xl ${isExiting && ' animate-animate-disappear'} p-0 flex items-start justify-start gap-0 dark:bg-secondary-color overflow-hidden`}>
                <FontAwesomeIcon icon={faXmark} className='absolute dark:hover:bg-slate-900 top-3 cursor-pointer hover:bg-gray-200 transition-colors rounded-lg right-3 text-gray-500 size-7 font-normal' onClick={handleModal} />
                <img src={product.image?.url || product.images[0].url} alt='image' className='w-[50%] h-full object-cover rounded-none p-4 bg-gray-200 dark:bg-transparent' />
                <div className='w-[50%] h-full flex flex-col items-start justify-start gap-4 pt-10'>
                    <div className='space-y-2'>
                        <h1 className='text-lg tracking-wide font-bold w-full mt-4 px-4 line-clamp-2'>{product.title}</h1>
                        <p className='px-4 text-gray-600 dark:text-gray-400 line-clamp-2 text-sm font-[450]'>{product.description}</p>
                    </div>
                    <div className='px-4'>
                        <p className='text-sm text-stone-800 dark:text-white font-medium'>Size: <span className='font-medium'>{productSize}</span></p>
                        <div className='flex items-center justify-start flex-wrap gap-4 mt-2'>
                            {sizes.map((size, index) => <div key={index} className={`border-[1px] ${size === productSize ? 'border-black dark:border-white' : 'border-gray-500'} text-xs dark:text-white text-stone-700 rounded-none cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-500 px-3 font-medium transition-colors py-2`} onClick={() => setSize(size)}>
                                {size}
                            </div>)}
                        </div>
                    </div>
                    {/* {
                        product.color &&
                        <div>
                            <p className='text-sm text-stone-600 dark:text-white font-bold'>Color: <span className='font-medium'>{color}</span></p>
                            <div className='flex items-center justify-start flex-wrap gap-4 mt-2'>
                                {allVariants.map((variant, index) => <div key={index} className={`border-[1px] ${variant.color === color ? 'border-black dark:border-white bg-gray-100' : 'border-gray-400'} text-sm dark:text-white text-stone-700 rounded-none cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-500 px-3 font-medium transition-colors py-2`} onClick={() => setColor(variant.color)}>
                                    {variant.color}
                                </div>)}
                            </div>
                        </div>
                    } */}
                    <div className='px-4'>
                        <p className='text-sm font-medium dark:text-white text-stone-800'>Quantity:</p>
                        <div className='flex items-center justify-around border-[1px] text-sm border-gray-500 rounded-none w-26 mt-2 py-2'>
                            <div><FontAwesomeIcon icon={faMinus} className='cursor-pointer' onClick={() => quantity >= 2 && setQuantity(quantity - 1)} /></div>
                            <div className='text-stone-600 dark:text-white'>{quantity}</div>
                            <div><FontAwesomeIcon icon={faPlus} className='cursor-pointer' onClick={() => setQuantity(quantity + 1)} /></div>
                        </div>
                        <span className='text-xs mt-4 dark:text-white text-stone-700 font-medium'>Subtotal: {isIndia ? <FontAwesomeIcon icon={faIndianRupee} className='font-normal mr-0.5 ml-1' /> : 'Dhs.'}<span className='font-bold dark:text-white text-stone-700'>{isIndia ? product.price * quantity : Math.floor(product.price / dirham_to_rupees) * quantity}</span></span>
                    </div>
                    <div></div>
                    <Button className=' self-center text-sm uppercase hover:bg-transparent hover:text-black border-2 hover:shadow-none duration-300 bg-[#1b1b1b] border-[#1b1b1b] w-[90%] my-auto justify-self-end text-white transition-colors' onClick={handleBuyNow}>Proceed To Checkout</Button>
                </div>
            </div>
        </div>
    )
}

function Card({ res, productLoader, ...props }) {

    const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);
    const [openModal, setOpenModal] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const ref = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver((node) => {
            const { isIntersecting, target } = node[0];
            if (isIntersecting) {
                target.classList.add(['animate-animate-appear']);
            } else {
                target.classList.remove(['animate-animate-appear']);
            }
        }, { threshold: 0 });
        observer.observe(ref.current);
    }, [])

    // console.log(res);

    return (
        <>

            {/* Quick Buy Modal */}
            {
                openModal &&
                <Modal product={res} setOpenModal={setOpenModal} isExiting={isExiting} setIsExiting={setIsExiting} />
            }

            <div ref={ref} className='flex flex-col items-center justify-center rounded-sm cursor-pointer md:w-[22vw] w-full md:h-[72vh] h-[35vh] hover:border-gray-400 hover:dark:bg-secondary-color border-transparent border-[0px] dark:border-0 transition-all md:p-4 p-1 gap-0 overflow-hidden relative'

                onMouseEnter={(e) => { !productLoader && e.currentTarget.lastElementChild.classList.remove('invisible'); e.currentTarget.lastElementChild.classList.add('translatee-y-[-4em]'); e.currentTarget.lastElementChild.classList.add('animate-animate-appear') }}

                onMouseLeave={(e) => { !productLoader && e.currentTarget.lastElementChild.classList.add('invisible'); e.currentTarget.lastElementChild.classList.remove('translate-y-[-4em]'); e.currentTarget.lastElementChild.classList.remove('animate-animate-appear') }}
                // onClick={() => window.scrollTo(0, 0)}first
                {...props}
            >
                {
                    !productLoader ?
                        <>
                            <div onClick={() => navigate(`/product/${res?._id}`)} className='relative'>
                                <span className="bg-red-600 z-10 text-white text-md font-medium me-2 md:px-2.5 px-1.5 py-0.5 rounded-none dark:bg-blue-900 dark:text-blue-300 absolute md:top-2 top-2 md:right-2 right-2 md:text-xs text-xs">-{(((res?.comparePrice - res?.price) / res?.comparePrice) * 100).toString().slice(0, 2)}% OFF</span>
                                <div className='overflow-hidden'>
                                    <img src={res?.image?.url || res.images[1]?.url || res.images[0].url} className='w-[100%] absolute p-0 transition-all duration-500 opacity-100 ease-in-out md:h-[50vh] h-[25vh] hover:scale-[1.2] brightness-75 object-cover -z-30' />
                                    <img src={res?.image?.url || res.images[0].url} className='w-[100%] p-0 transition-all duration-1000 cursor-pointer ease-in-out opacity-100 md:h-[50vh] h-[25vh] object-cover hover:scale-[1.2] hover:opacity-0 dark:hover:opacity-35' />
                                </div>
                                <h1 className='md:px-4 px-1 md:text-gray-700 text-black dark:text-white mt-2 text-center w-full md:text-sm text-xs md:h-14 hover:underline md:line-clamp-3 line-clamp-2'>{res?.title}</h1>
                                <div className='flex items-center justify-between w-full mt-4'>
                                    <h2 className='px-0 md:text-sm text-xs text-start font-bold dark:text-gray-500 relative text-stone-600'>
                                        <div className='w-full md:h-[2px] h-[1px] bg-stone-600 dark:bg-gray-500 absolute top-[50%] left-0'></div>
                                        {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /> : 'Dhs.'}{isIndia ? res?.comparePrice : Math.floor(res?.comparePrice / dirham_to_rupees)}
                                    </h2>
                                    <h2 className='px-0 md:text-lg text-sm text-end font-bold dark:text-white text-stone-900'>
                                        {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /> : 'Dhs.'}{isIndia ? res?.price.toString()[0] + "," + res?.price.toString().slice(1) : Math.floor(res?.price / dirham_to_rupees)}
                                    </h2>
                                </div>
                            </div>
                            <Button className='text-sm w-[100%] mt-4 py-3 transition-transform duration-300 border-2 border-black rounded-sm font-bold invisible md:block hidden' onClick={() => setOpenModal(true)}>QUICK BUY</Button>
                        </>
                        : <Hourglass
                            visible={true}
                            height="50"
                            width="50"
                            ariaLabel="hourglass-loading"
                            wrapperStyle={{}}
                            wrapperclassName=""
                            colors={['#000000', '#72a1ed']}
                        />
                }
            </div>
        </>
    )
}

export default Card