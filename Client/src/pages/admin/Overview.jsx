import React, { useEffect, useState } from 'react'
import { Container, Spinner } from "../../components/index.js"
import { FaBoxes } from 'react-icons/fa'
import axios from 'axios';
import { FaTruckFast } from "react-icons/fa6";
import { TiCancel } from "react-icons/ti";

import { Chart as chartjs, ArcElement, Tooltip, Legend } from "chart.js"
import { Line } from "react-chartjs-2"

chartjs.register(ArcElement, Tooltip, Legend);

function Overview() {

    const [loader, setLoader] = useState(true);
    const [counts, setCounts] = useState({});

    const generateClasses = (color) => {
        return `w-[20%] h-[30%] p-4 ${color} flex flex-col items-center rounded-md text-xl font-bold text-center`
    }

    useEffect(() => {
        ; (async () => {
            setLoader(true);
            try {
                const response = await axios.get(`/api/v1/orders/count`, {
                    baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
                });
                setCounts(response.data.data.counts[0])
            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
            }
        })();
    }, []);

    return (
        !loader ?
            <Container className='flex items-start justify-start gap-6 p-10'>
                <div className={generateClasses('bg-yellow-300')}>
                    <FaBoxes className='size-32' />
                    <span className='text-sm uppercase'>Orders Pending: {counts.pendingCount}</span>
                </div>
                <div className={generateClasses('bg-green-400')}>
                    <FaTruckFast className='size-32' />
                    <span className='text-sm uppercase'>Orders Delivered: {counts.deliveredCount}</span>
                </div>
                <div className={generateClasses('bg-red-400')}>
                    <TiCancel className='size-32' />
                    <span className='text-sm uppercase'>Orders Cancelled: {counts.cancelledCount}</span>
                </div>

                {/* <Line
                    data={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri'],
                        datasets: [
                            {
                                label: 'My Data',
                                data: [1, 5, 3, 7, 10],
                                fill: false,
                            }
                        ]
                    }}
                /> */}
                {/* <div className={generateClasses('')}></div> */}
            </Container>
            : <Spinner />
    )
}

export default Overview