import React, { useEffect, useState } from 'react'
import { Card, Container, SearchBar, Spinner } from '../components'
import axios from 'axios';

function SearchPage() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [productLoader, setProductLoader] = useState(true);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        ; (async () => {
            setProductLoader(true);
            try {
                const response = await axios.get(`/api/v1/products/search?search=${search}`, {
                    baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
                });
                setProducts(response.data.data);
            } catch (err) {
                console.log(err)
            } finally {
                setProductLoader(false);
                setLoader(false);
            }
        })();
    }, [search]);


    return (
        !loader ?
        <Container className='flex flex-col items-center justify-start gap-10 animate-animate-appear'>
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className='grid md:grid-cols-4 grid-cols-2 md:m-0 m-4 gap-6'>
                {
                    products.map((product, index) => <Card key={index} res={product} productLoader={productLoader} />)
                }
            </div>
            {search && !products.length && <div className='w-full h-[60vh] text-2xl font-bold text-center'>
                Sorry! No Product Matched Your Query
            </div>}
        </Container>
        : <Spinner />
    )
}

export default SearchPage