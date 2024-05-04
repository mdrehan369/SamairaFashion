import React, { useEffect, useState } from 'react'
import { Button, Carousel, Container, Spinner } from '../components/index.js'
import straight from "../assets/straight.webp"
import tyedye from "../assets/tyedye.jpg"
import farasha from "../assets/farasha.webp"
import umbrella from "../assets/umbrella.webp"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIndianRupeeSign, faMinus } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

const hoverEffect = {
    onMouseEnter: (e) => {
        e.currentTarget.childNodes[0].classList.remove('h-0');
        e.currentTarget.childNodes[0].classList.add('h-full')
    },
    onMouseLeave: (e) => {
        e.currentTarget.childNodes[0].classList.add('h-0');
        e.currentTarget.childNodes[0].classList.remove('h-full')
    }
}

function Home() {

    const [loader, setLoader] = useState(true);
    const [buttonLoader, setButtonLoader] = useState(true);
    const [response, setResponse] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        // setLoader(true);
        setButtonLoader(true)
            ; (async () => {
                try {
                    const res = await axios.get(`/api/v1/products?page=${page}`);
                    setResponse((prev) => prev.concat(res.data.data));
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoader(false);
                    setButtonLoader(false)
                }
            })()
    }, [page]);

    return (
        <Container className=''>
            <Carousel />
            <div className='w-full h-full my-10 space-y-10'>
                <div className=''>
                    <div className='flex items-center justify-center gap-6 mb-10'>
                        <div className='h-[3px] bg-stone-800 w-[30%] rounded-full'></div>
                        <h1 className='font-bold text-stone-800 text-center text-[1.35rem]  decoration-stone-700 w-[30%]'>OUR BEST SELLING CATEGORIES</h1>
                        <div className='h-[3px] bg-stone-800 w-[30%] rounded-full'></div>
                    </div>
                    <div className='w-full h-[50%] flex items-start justify-center gap-4 cursor-pointer'>
                        <div className='w-[22%] h-full relative' {...hoverEffect}>
                            <div className='absolute w-full h-0 overflow-hidden bg-opacity-60 bg-gradient-to-t from-[#000000ff] to-transparent text-white flex flex-col items-center justify-center gap-2 px-4 transition-all ease-in bottom-0 duration-400'>
                                <h1 className='font-bold underline'>Straight Abayas</h1>
                                <p className='text-white text-center'>Browse our collection of staple straight cut abayas, ranging in multiple colours and in both open and closed styles!</p>
                            </div>
                            <img src={straight} alt='Straight' className='w-full h-full object-cover' />
                        </div>
                        <div className='w-[22%] h-full relative' {...hoverEffect}>
                            <div className='absolute w-full h-0 overflow-hidden bg-opacity-80 bg-gradient-to-t from-[#000000ff] to-transparent text-gray-200 flex flex-col items-center justify-center gap-2 px-4 transition-all bottom-0 duration-200'>
                                <h1 className='font-bold underline'>Umbrella Abayas</h1>
                                <p className='text-white text-center'>Our Simplicity Umbrella Abaya is designed with a princess cut for modest, flowing coverage and is nursing friendly and includes zippered side pockets.</p>
                            </div>
                            <img src={umbrella} alt="Umbrella" className='w-full h-full object-cover' />
                        </div>
                        <div className='w-[22%] h-full relative' {...hoverEffect}>
                            <div className='absolute w-full h-0 overflow-hidden bg-opacity-80 bg-gradient-to-t from-[#000000ff] to-transparent text-gray-200 flex flex-col items-center justify-center gap-2 px-4 transition-all bottom-0 duration-200'>
                                <h1 className='font-bold underline'>Tye Dye Abayas</h1>
                                <p className='text-white text-center'>Tye Dye Abayas come in various designs and styles. Some are simple and plain, while others may feature intricate embroidery, beadwork, or other</p>
                            </div>
                            <img src={tyedye} alt="Tye Dye" className='w-full h-full object-cover' />
                        </div>
                        <div className='w-[22%] h-full relative' {...hoverEffect}>
                            <div className='absolute w-full h-0 overflow-hidden bg-opacity-80 bg-gradient-to-t from-[#000000ff] to-transparent text-gray-200 flex flex-col items-center justify-center gap-2 px-4 transition-all bottom-0 duration-200'>
                                <h1 className='font-bold underline'>Farasha Abayas</h1>
                                <p className='text-white text-center'>A Farasha is a style of abaya with butterfly sleeves and flowy fabric. It is a perfect clothing option for a special occasion</p>
                            </div>
                            <img src={farasha} alt="Farasha" className='w-full h-full object-cover' />
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-6 mb-10'>
                    <div className='h-[3px] bg-stone-800 w-[30%] rounded-full'></div>
                    <h1 className='font-bold text-stone-800 text-center text-[1.35rem]  decoration-stone-700 w-[30%]'>NEW ARRIVALS</h1>
                    <div className='h-[3px] bg-stone-800 w-[30%] rounded-full'></div>
                </div>
                <div className='flex flex-col items-center justify-start'>
                    {!loader ?
                        <div className='grid grid-cols-4 overflow-scroll gap-6 m-10 bg-[#fafafa]'>
                            {response.map((res, index) => <NavLink to={`/product/${res._id}`} key={index} className='flex flex-col items-center justify-between rounded-sm cursor-pointer hover:bg-gray-200 hover:border-gray-400 border-white border-[1px] transition-all p-4 gap-0 overflow-hidden hover:shadow-lg relative' onMouseEnter={(e) => {e.currentTarget.lastElementChild.classList.remove('invisible'); e.currentTarget.lastElementChild.classList.add('translatee-y-[-4em]');e.currentTarget.lastElementChild.classList.add('animate-bounce-once')}} onMouseLeave={(e) => {e.currentTarget.lastElementChild.classList.add('invisible');e.currentTarget.lastElementChild.classList.replace('translate-y-[-4em]', '');e.currentTarget.lastElementChild.classList.remove('animate-bounce-once')}}>
                            <span class="bg-pink-500 z-10 text-white text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 absolute top-6 left-6">-{((res.comparePrice - res.price)/res.comparePrice).toFixed(2)*100}%</span>
                                <div className='overflow-hidden'>
                                    <img src={res.image.url} className='w-[100%] p-0 transition-all duration-500 ease-in-out h-[60vh] object-cover hover:scale-[1.2]' />
                                </div>
                                <h1 className='px-4 text-gray-700 mt-2 text-center w-full text-sm h-10 hover:underline'>{res.title}</h1>
                                <div className='flex items-center justify-between w-full mt-4'>
                                    <h2 className='px-0 text-sm text-start font-bold relative text-stone-600'>
                                        <div className='w-full h-[2px] bg-stone-600 absolute top-[50%] left-0'></div>
                                        <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' />{res.comparePrice}
                                    </h2>
                                    <h2 className='px-0 text-lg text-end font-bold text-stone-900'>
                                        <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' />{res.price.toString()[0] + "," + res.price.toString().slice(1)}
                                    </h2>
                                </div>
                                <Button className='text-sm w-[90%] mt-4 py-3 transition-transform duration-300 border-2 border-black rounded-sm font-bold invisible'>ADD TO CART</Button>
                            </NavLink>)}
                        </div>
                        : <Spinner />}
                    <Button onClick={() => setPage((prev) => prev + 1)} disabled={buttonLoader} className='mb-10'>{
                        buttonLoader ?
                            <Spinner />
                            : 'Show More'
                    }</Button>
                </div>
            </div>
        </Container>
    )
}

export default Home