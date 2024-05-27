import React, { useEffect, useState } from 'react'
import { Card, Container, SearchBar } from '../components'
import axios from 'axios';

function SearchPage() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [productLoader, setProductLoader] = useState(true);

    useEffect(() => {
        ; (async () => {
            setProductLoader(true);
            try {
                const response = await axios.get(`/api/v1//products/search?search=${search}`, {
                    baseURL: import.meta.env.VITE_BACKEND_URL
                });
                setProducts(response.data.data);
            } catch (err) {
                console.log(err)
            } finally {
                setProductLoader(false);
            }
        })();
    }, [search]);


    return (
        <Container className='flex flex-col items-center justify-start gap-10 animate-animate-appear'>
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className='grid grid-cols-4 gap-6'>
                {
                    products.map((product, index) => <Card key={index} res={product} productLoader={productLoader} />)
                }
            </div>
            {search && !products.length && <div className='w-full h-[60vh] text-2xl font-bold text-center'>
                Sorry! No Product Matched Your Query
            </div>}
        </Container>
    )
}

export default SearchPage