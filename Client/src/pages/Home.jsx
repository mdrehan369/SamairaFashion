import React, { useEffect, useState } from 'react'
import { Button, Card, Carousel, Container, Spinner } from '../components/index.js'
import straight from "../assets/straight.webp"
import tyedye from "../assets/tyedye.jpg"
import farasha from "../assets/farasha.webp"
import umbrella from "../assets/umbrella.webp"
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
    const [productLoader, setProductLoader] = useState(true);
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
                    setButtonLoader(false);
                    setProductLoader(false);
                }
            })()
    }, [page]);

    return (
        <Container className=''>
            <Carousel />
            <div className='w-full h-full md:my-10 my-4 space-y-10'>
                <div className=''>
                    <div className='flex items-center justify-center gap-6 mb-10'>
                        <div className='h-[3px] bg-stone-800 dark:bg-[#e4e4e4] hidden md:block w-[30%] rounded-full'></div>
                        <h1 className='font-bold text-stone-800 text-center text-[1.35rem] dark:text-[#e4e4e4] md:w-[30%] w-full'>OUR BEST SELLING CATEGORIES</h1>
                        <div className='h-[3px] bg-stone-800 w-[30%] hidden md:block dark:bg-[#e4e4e4] rounded-full'></div>
                    </div>
                    <div className='w-full h-[50%] md:flex items-start justify-center grid grid-cols-2 px-4 md:px-0 gap-4 cursor-pointer'>
                        <NavLink className='md:w-[22%] w-full h-full relative' {...hoverEffect} to='/shop?category=Straight'>
                            <div className='absolute w-full h-0 overflow-hidden bg-opacity-60 bg-gradient-to-t from-[#000000ff] to-transparent text-white flex flex-col items-center justify-center gap-2 px-4 transition-all ease-in bottom-0 duration-400'>
                                <h1 className='font-bold underline'>Straight Abayas</h1>
                                <p className='text-white text-center'>Browse our collection of staple straight cut abayas, ranging in multiple colours and in both open and closed styles!</p>
                            </div>
                            <img src={straight} alt='Straight' className='w-full h-full object-cover' />
                        </NavLink>
                        <NavLink className='md:w-[22%] w-full h-full relative' {...hoverEffect} to='/shop?category=Umbrella'>
                            <div className='absolute w-full h-0 overflow-hidden bg-opacity-80 bg-gradient-to-t from-[#000000ff] to-transparent text-gray-200 flex flex-col items-center justify-center gap-2 px-4 transition-all bottom-0 duration-200'>
                                <h1 className='font-bold underline'>Umbrella Abayas</h1>
                                <p className='text-white text-center'>Our Simplicity Umbrella Abaya is designed with a princess cut for modest, flowing coverage and is nursing friendly and includes zippered side pockets.</p>
                            </div>
                            <img src={umbrella} alt="Umbrella" className='w-full h-full object-cover' />
                        </NavLink>
                        <NavLink className='md:w-[22%] w-full h-full relative' {...hoverEffect} to='/shop?category=Tye Dye'>
                            <div className='absolute w-full h-0 overflow-hidden bg-opacity-80 bg-gradient-to-t from-[#000000ff] to-transparent text-gray-200 flex flex-col items-center justify-center gap-2 px-4 transition-all bottom-0 duration-200'>
                                <h1 className='font-bold underline'>Tye Dye Abayas</h1>
                                <p className='text-white text-center'>Tye Dye Abayas come in various designs and styles. Some are simple and plain, while others may feature intricate embroidery, beadwork, or other</p>
                            </div>
                            <img src={tyedye} alt="Tye Dye" className='w-full h-full object-cover' />
                        </NavLink>
                        <NavLink className='md:w-[22%] w-full h-full relative' {...hoverEffect} to='/shop?category=Farasha'>
                            <div className='absolute w-full h-0 overflow-hidden bg-opacity-80 bg-gradient-to-t from-[#000000ff] to-transparent text-gray-200 flex flex-col items-center justify-center gap-2 px-4 transition-all bottom-0 duration-200'>
                                <h1 className='font-bold underline'>Farasha Abayas</h1>
                                <p className='text-white text-center'>A Farasha is a style of abaya with butterfly sleeves and flowy fabric. It is a perfect clothing option for a special occasion</p>
                            </div>
                            <img src={farasha} alt="Farasha" className='w-full h-full object-cover' />
                        </NavLink>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-6 md:mb-10 mb-4'>
                    <div className='h-[3px] bg-stone-800 dark:bg-[#e4e4e4] w-[30%] rounded-full md:block hidden'></div>
                    <h1 className='font-bold text-stone-800 dark:text-[#e4e4e4] text-center text-[1.35rem] decoration-stone-700 md:w-[30%] w-full'>NEW ARRIVALS</h1>
                    <div className='h-[3px] bg-stone-800 dark:bg-[#e4e4e4] w-[30%] rounded-full md:block hidden'></div>
                </div>
                <div className='flex flex-col items-center justify-start'>
                    {!loader ?
                        <div className='grid md:grid-cols-4 grid-cols-2 w-full overflow-scroll md:gap-6 gap-2 px-4 m-10 bg-transparent'>
                            {response.map((res, index) => <Card res={res} key={index} productLoader={productLoader} />)}
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