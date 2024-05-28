import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import { Container, Spinner } from "../components/index.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupee} from '@fortawesome/free-solid-svg-icons';

// TODO : ADD PRODUCT DETAILS LIKE NO. OF PRODUCTS SOLD AND ORDERED ETC

function ProductPage() {

    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        ; (async () => {
            try {
                setLoader(true)
                window.scrollTo(0, 0);
                const response = await axios.get(`/api/v1/products/product/${productId}`, {
                    baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
                });
                setProduct(response.data.data);
            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
            }

        })()
    }, [])

    return (
        !loader ?
            <Container className='h-full'>
                <div className='flex items-center justify-center w-full h-[100%]'>
                    <div className='w-[50%] h-[90%] flex items-center justify-center'>
                        <img src={product.image.url} className='w-auto h-[90%]' />
                    </div>
                    <form className='w-[40%] h-[90%] flex flex-col items-start justify-start gap-10'>
                        <h1 className='text-3xl font-bold text-stone-700 mt-10'>{product.title}</h1>
                        <h2 className='text-lg text-stone-600 font-medium'>{product.description}</h2>
                        <div>
                            <h1 className='text-md relative font-bold text-gray-500 w-[80%]'>
                                <div className=' absolute bg-gray-500 top-[50%] left-0 w-full h-[2px]'></div>
                                <FontAwesomeIcon icon={faIndianRupee} />{product.comparePrice}</h1>
                            <h1 className='text-2xl font-bold text-stone-700 mt-2'><FontAwesomeIcon icon={faIndianRupee} />{product.price}</h1>
                        </div>
                        <div></div>
                        <div></div>
                    </form>
                </div >
            </Container>
            : <Spinner />
    )
}

export default ProductPage