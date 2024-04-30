import React, { useEffect, useState } from 'react'
import pic1 from "../assets/banner1.webp"
import pic2 from "../assets/banner2.webp"
import pic3 from "../assets/banner3.webp"
// import pic4 from "../assets/pic4.jpg"
import { Button } from "./index"

function Carousel() {

    useEffect(() => {
        const slider = document.getElementById('slider');
        let counter = 0;
        setInterval(() => {
            if (slider) {
                if (counter === 2) {
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

            <div className='w-[100vw] h-[90vh] relative overflow-hidden m-auto'>
                <div className='w-full h-full absolute top-0 left-0 transition duration-300 scroll-smooth ' id='slider'>
                    <img src={pic2} className='absolute left-0 top-0 w-full h-full object-cover' />
                    <img src={pic1} className='absolute left-[100%] top-0 w-full h-full object-cover' />
                    <img src={pic3} className='absolute left-[200%] top-0 w-full h-full object-cover' />
                    {/* <img src={pic4} className='absolute left-[300%] top-0 w-full h-full object-cover' /> */}
                </div>
            </div>

        </>
    );
}

export default Carousel;
