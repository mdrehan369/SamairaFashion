import React, { useEffect, useRef, useState } from 'react'
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

function Offer() {

    const [products, setProducts] = useState([]);
    const [currProduct, setCurrProduct] = useState({});
    const [loader, setLoader] = useState(true);
    // const [index, setIndex] = useState(0);
    const index = useRef(0);

    useEffect(() => {

        ; (async () => {

            try {
                const res = await axios.get(`/api/v1/products?page=${1}`, {
                    baseURL: import.meta.env.VITE_BACKEND_URL,
                    withCredentials: true
                });
                setProducts(res.data.data);
                setCurrProduct(res.data.data[0]);
            } catch (err) {
                console.log(err);
            } finally {
                setLoader(false);
            }

        })();

    }, []);

    useEffect(() => {

        const interval = setInterval(async () => {

            const doc = document.getElementById('popup')
            if (doc.classList.contains('md:translate-x-[-30vw]')) {
                doc.classList.remove('md:translate-x-[-30vw]');
                doc.classList.remove('translate-x-[-52vw]');
            } else {
                doc.classList.add('md:translate-x-[-30vw]');
                doc.classList.add('translate-x-[-52vw]');
                index.current += 1;
                // await new Promise((res, rej) => {
                //     setTimeout(() => {
                //         setCurrProduct(products[index.current % 12]);
                //         res(1);
                //     }, 500)
                // });

                setTimeout(() => {
                    setCurrProduct(products[index.current % 12]);
                }, 500);
            }

        }, 5000);

        return () => {
            clearInterval(interval);
        }

    }, [products])

    return (
        !loader &&
        <NavLink to={`/product/${currProduct?._id}`} id='popup' className='fixed border-2 border-gray-200 font-sans md:translate-x-[-30vw] translate-x-[-52vw] cursor-pointer text-xs hover:scale-[1.01] transition-transform ease-in-out duration-500 md:left-6 left-2 md:bottom-10 bottom-10 overflow-hidden md:w-[25vw] w-[50vw] bg-gray-100 shadow-md dark:bg-secondary-color rounded z-40 md:h-[15vh] h-[10vh] flex items-start justify-start gap-4'>
            <FontAwesomeIcon icon={faXmark} className='absolute top-2 right-2 hover:bg-gray-200 dark:hover:bg-blue-950 p-2 transition-colors cursor-pointer' />
            <img src={currProduct?.image?.url || currProduct?.images[0]?.url} className='w-[30%] h-full object-cover' alt="Image" />
            <div className='w-[50%] md:text-sm text-xs font-medium text-gray-800 md:py-4 py-2 pr-2 flex items-center justify-end'>{currProduct?.title.slice(0, 50)}...</div>
        </NavLink>
    )
}

export default Offer