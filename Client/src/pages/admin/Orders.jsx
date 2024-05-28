import React, { useEffect, useState } from 'react'
import { Container, Spinner } from '../../components'
import axios from 'axios';

function Orders() {

  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(true);

  const handleData = async () => {
    try {
      const response = await axios.get(`/api/v1/orders`, {
        baseURL: import.meta.env.VITE_BACKEND_URL,
        WithCredentials: true
    });
      setOrders(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    handleData();
  }, []);

  return (
    !loader ?
      <Container className='flex flex-col items-start justify-start p-20 divide-y-2'>
        <h1 className='text-2xl py-4 font-bold uppercase'>Orders</h1>
        <div className='w-full flex items-center justify-between'>
          <span className='w-[25%] text-start'>ORDER ID</span>
          <span className='w-[25%] text-start'>NAME</span>
          <span className='w-[25%] text-start'>COUNTRY</span>
          <span className='w-[25%] text-start'>STATUS</span>
        </div>
        <div className='w-full py-4'>
          {orders.map((order, index) => <div key={index} className='flex items-center justify-between w-full'>
            <span className='w-[25%] text-start'>{order._id}</span>
            <span className='w-[25%] text-start'>{order.shippingDetails.firstName + ' ' + order.shippingDetails.lastName}</span>
            <span className='w-[25%] text-start'>{order.shippingDetails.country}</span>
            {
              order.isPending ?
               <span className='px-2 py-1 font-bold text-xs rounded-sm bg-yellow-400'>Pending</span>
               : order.isCancelled ?
               <span className='px-2 py-1 font-bold text-xs rounded-sm bg-red-500'>Cancelled</span>
               : <span className='px-2 py-1 font-bold text-xs rounded-sm bg-green-500'>Delivered</span> 
              }
          </div>)}
        </div>
      </Container>
      : <Spinner />
  )
}

export default Orders