import React, { useEffect, useState } from 'react'
import pic1 from "../assets/banner1.webp"
import pic2 from "../assets/banner2.webp"
import pic3 from "../assets/banner3.webp"
import pic4 from "../assets/banner5.png"
import pic2ph from "../assets/pic2ph.webp"
import pic1ph from "../assets/pic1ph.webp"
// import pic4 from "../assets/pic4.jpg"
// import { Button } from "./index"

function Carousel({ ...props }) {

    useEffect(() => {
        const slider = document.getElementById('slider');
        const bar = document.getElementById('bar');
        let counter = 0;

        setInterval(() => {
            if (slider) {
                if (counter === 3) {
                    counter = 0;
                    slider.childNodes.forEach(node => node.classList.replace('opacity-0', 'opacity-100'))
                } else {
                    slider.childNodes[4 - counter - 1].classList.replace('opacity-100', 'opacity-0');
                    counter++;
                }
                bar.childNodes.forEach((node, index) => {
                    if (index === counter) {
                        node.classList.add('bg-white')
                        node.classList.add('scale-125')
                    }
                    else {
                        node.classList.remove('bg-white')
                        node.classList.remove('scale-125')
                    }
                })
            }
        }, 5000);

        return () => clearInterval();
    }, [])

    return (
        <>

            <div {...props} className='w-[100vw] h-[90vh] animate-animate-appear cursor-pointer relative overflow-hidden m-auto'>
                <div className='w-full h-full absolute top-0 left-0 transition duration-500 scroll-smooth ' id='slider'>
                    <img src={window.screen.width > 500 ? pic3 : pic1ph} className='absolute left-0 top-0 w-full md:h-full h-[80%] transition-opacity duration-500 opacity-100  md:object-cover object-cover' />
                    <img src={window.screen.width > 500 ? pic1 : pic2ph} className='absolute transition-opacity duration-500 opacity-100 left-0 top-0 w-full md:h-full md:object-cover h-[90%]' />
                    <img src={window.screen.width > 500 ? pic2 : pic1ph} className='absolute transition-opacity duration-500 opacity-100 left-0 top-0 w-full md:h-full h-[90%] md:object-cover' />
                    <img src={window.screen.width > 500 ? pic4 : pic2ph} className='absolute transition-opacity duration-500 opacity-100 left-0 top-0 w-full md:h-full h-[90%] md:object-cover' />
                    <div id='bar' className='absolute flex items-center border-[1px] border-black justify-center gap-2 rounded-md bg-black opacity-20 px-2 bottom-10 left-[50%] translate-x-[-50%] p-1'>
                        <div className='rounded-full size-2 border-[1px] border-white bg-white scale-125'></div>
                        <div className='rounded-full size-2 border-[1px] border-white'></div>
                        <div className='rounded-full size-2 border-[1px] border-white'></div>
                        <div className='rounded-full size-2 border-[1px] border-white'></div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Carousel;
