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
            if (doc.classList.contains('translate-x-[-30vw]')) {
                doc.classList.remove('translate-x-[-30vw]');
            } else {
                doc.classList.add('translate-x-[-30vw]');
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
        <NavLink to={`/product/${currProduct?._id}`} id='popup' className='fixed border-2 border-gray-200 font-sans translate-x-[-30vw] cursor-pointer hover:scale-[1.01] transition-transform ease-in-out duration-500 left-6 bottom-10 w-[25vw] bg-gray-100 shadow-md dark:bg-secondary-color rounded z-40 h-[15vh] flex items-start justify-start gap-4'>
            <FontAwesomeIcon icon={faXmark} className='absolute top-2 right-2 hover:bg-gray-200 dark:hover:bg-blue-950 p-2 transition-colors cursor-pointer' />
            <img src={currProduct?.image?.url || currProduct?.images[0]?.url} className='w-[30%] h-full object-cover' alt="Image" />
            <div className='w-[50%] text-sm font-medium text-gray-800 py-4 pr-2 flex items-center justify-end'>{currProduct?.title.slice(0, 50)}...</div>
        </NavLink>
    )
}

export default Offer