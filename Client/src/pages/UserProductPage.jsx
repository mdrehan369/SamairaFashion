import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import axios from "axios"
import { useForm } from "react-hook-form"
import { Button, Card, Container, Input, Spinner, TextArea } from "../components/index.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faComment, faIndianRupee, faMinus, faPlus, faShoppingBag, faStar, faArrowUpFromBracket, faTriangleExclamation, faUser, faIndianRupeeSign, faArrowLeft, faArrowRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import sizeChart from "../assets/sizeChart.webp"
import { faStar as hollowStar } from "@fortawesome/free-regular-svg-icons"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

const sizes = [52, 54, 56, 58, 60, 62, 'Customize As Per Request'];

function Description({ text }) {
    return (
        <>
            <div className='text-lg text-stone-700 tracking-wide ml-10 my-4 self-start w-[50%] font-[450]'>{text}</div>
            <img src={sizeChart} alt="size chart" className='self-start ml-10' />
        </>
    )
}

function Reviews({ product }) {

    const [reviews, setReviews] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        ; (async () => {
            try {
                const response = await axios.get(`/api/v1/reviews/review/${product}`);
                setReviews(response.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoader(false);
            }
        })()
    })

    return (
        !loader ?
            reviews.length ?
                <div className='w-[90%] mx-auto h-auto grid grid-cols-2 gap-6 mt-10'>
                    {reviews.map((review, index) => <div key={index} className='flex flex-col items-start justify-start gap-4 bg-gray-100 rounded border-gray-400 w-full border-[1px] h-[30vh] overflow-scroll p-4 divide-y-2 hover:bg-gray-200 cursor-pointer transition-all'>
                        <div className='flex items-start justify-between w-full'>
                            <div className='flex items-center justify-center gap-4'>
                                <FontAwesomeIcon icon={faUser} className='text-2xl rounded-full text-gray-600 border-[1px] border-gray-300 p-3' />
                                <div className='flex flex-col items-start justify-start gap-0'>
                                    <span className='text-xl font-medium text-stone-900'>{review.userObj[0].firstName + " " + review.userObj[0].lastName}</span>
                                    <span className='text-sm font-normal text-gray-600'>{review.userObj[0].email}</span>
                                </div>
                            </div>
                            <div>
                                {[1, 2, 3, 4, 5].map((rating, index) => rating <= review.rating ? <FontAwesomeIcon icon={faStar} className='text-xl' /> : <FontAwesomeIcon icon={hollowStar} className='text-xl' />)}
                            </div>
                        </div>
                        <div className='w-full flex items-start justify-normal'>
                            <div className='mt-4 w-full'>
                                <div className='text-2xl mb-2 text-start text-stone-700 font-bold italic'>{review.title}</div>
                                <div className='font-medium text-stone-700 tracking-wide'>{review.description}</div>
                            </div>
                            {review.image && <img src={review.image.url} alt="product" className='w-[20%] h-full object-cover' />}
                        </div>
                    </div>)}
                </div>
                : <div className='text-2xl font-medium text-stone-700 w-full text-center h-full flex flex-col items-center justify-center'>
                    <FontAwesomeIcon icon={faComment} className='size-52' />
                    No Reviews To Show At The Moment!<br />
                    Be The First To Review It!
                </div>
            : <Spinner className='h-[50vh]' />
    )
}

function Write({ setPage, product }) {

    const [rating, setRating] = useState(0);
    const { register, handleSubmit } = useForm();
    const [image, setImage] = useState("");
    const [error, setError] = useState("");
    const nav = useNavigate();
    const user = useSelector(state => state.auth.user);

    const submit = async (data) => {

        if (!user) return nav("/signin")
        if (rating === 0) return setError("No Rating Given");
        if (data.title === '') return setError("No Title Given");
        if (data.description === '') return setError("No Description Given");

        const formData = new FormData(document.getElementsByTagName("form")[0]);

        formData.append('rating', rating);
        formData.append('image', image);
        formData.append('product', product);
        formData.append('title', data.title);
        formData.append('description', data.description);

        await axios.post("/api/v1/reviews", formData);
        setPage("Reviews");
    }

    return (

        <form onSubmit={handleSubmit(submit)} className='flex items-start justify-center gap-6 mt-4'>
            <div className='w-fit h-full flex flex-col items-start justify-start self-start'>
                <h1 className='text-md font-medium text-stone-700'>Rating: {rating}</h1>
                <div className='flex items-center justify-center text-2xl gap-2'>
                    {
                        [1, 2, 3, 4, 5].map((val, index) => <div key={index} className='cursor-pointer'>
                            <FontAwesomeIcon icon={val <= rating ? faStar : hollowStar} onClick={() => setRating(val)} />
                        </div>)
                    }
                </div>
            </div>
            <div className='w-[30%] h-[100%] flex flex-col items-center justify-start gap-4'>
                <Input label='Title' register={register} name='title' placeholder='ex. Brilliant Product...' />
                <label htmlFor="image" className='flex flex-col self-start ml-10 items-start justify-center gap-2'><span className='text-stone-700 font-medium'>Upload A Picture(Optional)</span><FontAwesomeIcon icon={faArrowUpFromBracket} className='text-gray-600 bg-gray-100 border-dashed opacity-70 border-gray-600 cursor-pointer size-28 border-2 p-3' /></label>
                <input type="file" name="image" hidden id='image' onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className='w-[40%] h-[100%] flex flex-col items-start justify-start gap-4'>
                <TextArea label='Description' register={register} name='description' placeholder='ex. A very impressive product and service. The best website to buy Abayas!...' className='w-full h-48' />

                <div className='flex items-center justify-between w-full'>
                    <span className={`${error && 'p-2'} bg-red-200 text-red-800 rounded font-medium`}>{error && <FontAwesomeIcon icon={faTriangleExclamation} className='mr-1' />}{error}</span>
                    <Button className='self-end' type='submit'>Submit</Button>
                </div>
            </div>
        </form>
    )
}

function RelatedProducts({ category }) {

    const [products, setProducts] = useState([]);
    const counter = useRef(0);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        ; (async () => {
            try {
                const response = await axios.get(`/api/v1/products/category?category=${category}&limit=12`);
                setProducts(response.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoader(false);
            }
        })()
    }, [])

    return (
        <>
            <h1 className='font-extrabold tracking-wide text-2xl text-stone-900 relative'><div className='w-full h-[2px] bg-black absolute bottom-0'></div>Related Products</h1>
            <div className='w-[100vw] overflow-x-clip relative'>
                <button className='absolute top-[40%] left-10 z-10 bg-gray-200 hover:bg-gray-300 hover:scale-[1.1] transition-transform shadow-xl size-16 text-black rounded-full border-2 border-gray-500 disabled:text-gray-600 disabled:opacity-80' disabled={!counter.current} onClick={() => {
                    if (counter.current > 0) {
                        counter.current -= 1;
                    }
                    document.getElementById('scroll').style.transform = `translateX(${100 * counter.current}vw)`;
                }}><FontAwesomeIcon className='size-6' icon={faChevronLeft} /></button>
                <button className='absolute top-[40%] right-10 z-10 bg-gray-200 hover:bg-gray-300 hover:scale-[1.1] transition-transform shadow-xl size-16 text-black rounded-full border-2 border-gray-500 disabled:text-gray-600 disabled:opacity-80' disabled={counter.current === 2} onClick={() => {
                    if (counter.current < 2) {
                        counter.current += 1;
                    }
                    document.getElementById('scroll').style.transform = `translateX(${-100 * counter.current}vw)`;
                }} ><FontAwesomeIcon icon={faChevronRight} className='size-6' /></button>
                <div className={`flex items-center justify-between mx-0 w-[300vw] gap-10 transition-transform scroll-smooth duration-500 ease-in-out`} id='scroll'>
                    {products.map((res, index) => <Card productLoader={loader} res={res} key={index} />)}
                </div>

            </div>
        </>
    )
}

function UserProductPage({ key }) {

    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const [loader, setLoader] = useState(true);
    const [productSize, setSize] = useState(52);
    const [quantity, setQuantity] = useState(1);
    const [isIndia, setIsIndia] = useState(false);
    const [page, setPage] = useState("Description");
    let dirham_to_rupees = 22;

    useEffect(() => {
        ; (async () => {
            try {
                const response = await axios.get(`http://ip-api.com/json`);
                if (response.data.countryCode === 'IN') {
                    setIsIndia(true);
                } else {
                    const response = await axios.get('http://www.floatrates.com/daily/aed.json');
                    dirham_to_rupees = Math.floor(response.data.inr.rate);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    useEffect(() => {
        ; (async () => {
            try {
                setLoader(true)
                const response = await axios.get(`/api/v1/products/product/${productId}`);
                setProduct(response.data.data[0]);
            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
            }

        })();
    }, [productId]);

    return (
        <Container className='flex flex-col justify-start items-center gap-10 min-h-[100vh]'>
            {!loader ?
                <>
                    <div className='w-[100%] h-auto flex items-start justify-evenly mt-10'>
                        <div className='w-[40%] h-full'>
                            <img src={product.image.url} alt="Product" className='w-full h-auto object-cover' />
                        </div>
                        <form className='w-[40%] h-[100%] flex flex-col items-start justify-start gap-6'>
                            <h1 className='text-2xl font-bold text-stone-800 tracking-wider'>{product.title}</h1>
                            <h2 className='text-lg text-stone-700 tracking-wide w-[90%] font-[450]'>{product.description.slice(0, 100)}...</h2>
                            <div>
                                <h1 className='text-md relative font-bold text-gray-500 w-fit'>
                                    <div className=' absolute bg-gray-500 top-[50%] left-0 h-[2px] w-full'></div>
                                    {isIndia ? <FontAwesomeIcon icon={faIndianRupee} className='mr-1' />:'Dhs.'}{isIndia ? product.comparePrice : Math.floor(product.comparePrice/dirham_to_rupees)}</h1>
                                <h1 className='text-2xl font-bold text-stone-800 mt-2'>
                                    {isIndia ? <FontAwesomeIcon icon={faIndianRupee} className='mr-1' />: 'Dhs.' }{isIndia ? product.price : Math.floor(product.price/dirham_to_rupees)}
                                    <span class="bg-pink-500 z-10 text-white text-sm font-medium me-2 px-1 py-0.5 ml-3 rounded-sm dark:bg-blue-900 dark:text-blue-300">-{((product.comparePrice - product.price) / product.comparePrice).toFixed(2) * 100}%</span>
                                </h1>
                            </div>
                            <div>
                                <p className='text-sm text-stone-600 font-bold'>Size: <span className='font-medium'>{productSize}</span></p>
                                <div className='flex items-center justify-start gap-4 mt-2'>
                                    {sizes.map((size, index) => <div key={index} className={`border-[1px] ${size === productSize ? 'border-black' : 'border-gray-300'} text-sm text-stone-700 rounded-none cursor-pointer hover:bg-gray-100 px-3 font-medium transition-colors py-2`} onClick={() => setSize(size)}>
                                        {size}
                                    </div>)}
                                </div>
                            </div>
                            <div>
                                <p className='text-sm font-bold text-stone-600'>Quantity:</p>
                                <div className='flex items-center justify-around border-[1px] border-gray-300 rounded-none w-32 mt-2 py-3'>
                                    <div><FontAwesomeIcon icon={faMinus} className='cursor-pointer' onClick={() => quantity >= 2 && setQuantity(quantity - 1)} /></div>
                                    <div className='text-stone-600'>{quantity}</div>
                                    <div><FontAwesomeIcon icon={faPlus} className='cursor-pointer' onClick={() => setQuantity(quantity + 1)} /></div>
                                </div>
                                <span className='text-xs mt-4 text-stone-700 font-medium'>Subtotal: {isIndia ? <FontAwesomeIcon icon={faIndianRupee} className='font-normal mr-0.5 ml-1' /> : 'Dhs.'}<span className='font-bold text-stone-700'>{isIndia ? product.price * quantity : Math.floor(product.price/dirham_to_rupees) * quantity}</span></span>
                            </div>
                            <div className='w-full flex flex-col items-center justify-center gap-4'>
                                <Button className='w-[70%] rounded-none text-sm font-bold tracking-wide hover:bg-transparent hover:text-[#232323] transition-colors duration-200 hover:shadow-none border-2 border-[#232323]'>ADD TO CART<FontAwesomeIcon icon={faCartShopping} className='ml-2' /></Button>
                                <Button className='w-[70%] rounded-none text-sm font-bold tracking-wide hover:bg-transparent hover:text-[#232323] transition-colors duration-200 hover:shadow-none border-2 border-[#232323]'>BUY IT NOW<FontAwesomeIcon icon={faShoppingBag} className='ml-2' /></Button>
                            </div>
                        </form>
                    </div>
                    <div className='w-full mt-10 flex flex-col items-center justify-start gap-0'>
                        <div className='flex items-center justify-center gap-0'>
                            <h1 className={`w-fit relative text-center font-extrabold cursor-pointer border-b-2 ${page === 'Description' ? 'text-black border-black bg-gray-200' : 'text-gray-500 border-white'} px-4 py-3 hover:text-black hover:border-black font-bold text-xl tracking-wider`} onClick={() => setPage('Description')}>Description</h1>
                            <h1 className={`w-fit relative text-center font-extrabold cursor-pointer border-b-2 ${page === 'Reviews' ? 'text-black border-black bg-gray-200' : 'text-gray-500 border-white'} px-4 py-3 hover:text-black hover:border-black font-bold text-xl tracking-wider`} onClick={() => setPage('Reviews')}>Reviews</h1>
                            <h1 className={`w-fit relative text-center font-extrabold cursor-pointer border-b-2 ${page === 'Write' ? 'text-black border-black bg-gray-200' : 'text-gray-500 border-white'} px-4 py-3 hover:text-black hover:border-black font-bold text-xl tracking-wider`} onClick={() => setPage('Write')}>Write A Review</h1>
                        </div>
                        <div className='w-full h-auto min-h-[50vh]'>
                            {page === 'Description' && <Description text={product.description} />}
                            {page === 'Reviews' && <Reviews product={productId} />}
                            {page === 'Write' && <Write setPage={setPage} product={productId} />}
                        </div>
                    </div>
                    <RelatedProducts category={product.category} />
                </>
                : <Spinner className='h-[90vh] flex w-full items-center justify-center' />}
        </Container>
    )
}

export default UserProductPage