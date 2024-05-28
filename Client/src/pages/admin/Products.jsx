import React, { useEffect, useState } from 'react'
// import { useAxios } from "../../hooks/useAxios.js"
import { Container, Spinner, SearchBar } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

//TODO text color highlighting on searching

function Products() {

    // const [loader, error, response] = useAxios('/api/v1/products');
    const [loader, setLoader] = useState(true);
    const [response, setResponse] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCatgory] = useState('All');

    // useEffect(() => {
    //     ; (async () => {
    //         try {
    //             const res = await axios.get("/api/v1/products");
    //             setResponse(res.data.data);
    //         } catch (err) {
    //             console.log(err)
    //         } finally {
    //             setLoader(false);
    //         }
    //     })()
    // }, []);

    useEffect(() => {
        setLoader(true);
        ; (async () => {
            try {
                const res = await axios.get(`/api/v1/products/search?search=${search}`, {
                    baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
                });
                setResponse(res.data.data);
            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
            }
        })()
    }, [search])

    return (
        <Container className='overflow-y-scroll h-full mt-10'>
            <div className='w-full flex items-center justify-center gap-10'>
                <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
                <select className='w-[10%] p-4 rounded-lg text-lg font-medium' value={category} onChange={(e) => setCatgory(e.target.value)}>
                    <option value="Umbrella">Umbrella</option>
                    <option value="Straight">Straight</option>
                    <option value="Farasha">Farasha</option>
                    <option value="Tye Dye">Tye Dye</option>
                    <option value="All">All</option>
                </select>
            </div>
            {!loader ?
                <div className='grid grid-cols-3 overflow-scroll gap-10 m-8'>
                    {response.map((res, index) => (res.category === category || category === 'All') && <NavLink to={`/admin/product/${res._id}`} key={index} className='flex flex-col items-start justify-start bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-all'>
                        <img src={res.image.url} className='w-[100%] p-4 h-[80%] object-cover' />
                        <h1 className='px-4 text-stone-700 font-bold text-xl'>{res.title}</h1>
                        <h2 className='px-4 text-xl font-bold text-stone-900'>
                            <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' />{res.price}
                        </h2>
                    </NavLink>)}
                </div>
                : <Spinner />
            }
        </Container>
    )
}

export default Products