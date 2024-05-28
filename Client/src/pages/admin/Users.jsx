import React, { useEffect, useState } from 'react'
import { Container, Spinner, SearchBar } from '../../components'
import axios from 'axios';

// TODO : ADD USERPAGE AND OTHER DETAILS OF PRODUCTS AND ETC

function Users() {

    const [loader, setLoader] = useState(true);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

            ; (async () => {
                try {
                    let response;
                    if (search) {
                        response = await axios.get(`/api/v1/users/search?search=${search}`, {
                            baseURL: import.meta.env.VITE_BACKEND_URL, WithCredentials: true
                        });
                    } else {
                        response = await axios.get("/api/v1/users", {
                            baseURL: import.meta.env.VITE_BACKEND_URL, WithCredentials: true
                        });
                    }
                    setUsers(response.data.data);
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoader(false);
                }
            })()

    }, [search]);

    return (
        !loader ?
            <Container className='flex flex-col items-center justify-start gap-10 mt-10'>
                <SearchBar value={search} className='h-14' onChange={(e) => setSearch(e.target.value)} />
                <div className='w-full flex flex-col items-center justify-center divide-y-2'>
                    {users.map((user, index) => <div key={index} className='w-full p-2 mx-4 flex items-center justify-between hover:bg-gray-200 cursor-pointer transition-colors'>
                        <h1 className='text-xl text-stone-700 font-medium w-[20%]'>{user.firstName + ' ' + user.lastName}</h1>
                        <h1 className='w-[20%]'>{user.number}</h1>
                        <h1 className='w-[20%]'>{user.email}</h1>
                        <h1 className='w-[20%]'>{user.address}</h1>
                        <h1 className='w-[20%]'>{user.city}</h1>
                        {/* <h1>{user.country}</h1> */}
                    </div>)}
                </div>
            </Container>
            : <Spinner />
    )
}

export default Users