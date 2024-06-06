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
        let counter = 0;
        setInterval(() => {
            if (slider) {
                if (counter === 3) {
                    counter = 0;
                } else {
                    counter++;
                }
                slider.style.transform = `translateX(-${counter * 100}%)`
            }
        }, 5000);

        return () => clearInterval();
    }, [])

    return (
        <>

            <div {...props} className='w-[100vw] h-[90vh] animate-animate-appear cursor-pointer relative overflow-hidden m-auto'>
                <div className='w-full h-full absolute top-0 left-0 transition duration-500 scroll-smooth ' id='slider'>
                    <img src={window.screen.width > 500 ? pic4 : pic2ph} className='absolute left-0 top-0 w-full md:h-full h-[90%] md:object-cover' />
                    <img src={window.screen.width > 500 ? pic2 : pic1ph} className='absolute left-[100%] top-0 w-full md:h-full h-[90%] md:object-cover' />
                    <img src={window.screen.width > 500 ? pic1 : pic2ph} className='absolute left-[200%] top-0 w-full md:h-full md:object-cover h-[90%]' />
                    <img src={pic3} className='absolute left-[300%] top-0 w-full md:h-full h-[80%]  md:object-cover object-cover' />
                </div>
            </div>

        </>
    );
}

export default Carousel;
