import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '../components';


function Success() {

    const [loader, setLoader] = useState(true);
    const [error, setError] = useState("");
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        ; (async () => {
            setLoader(true);
            try {
                
                const session = await axios.get(`/api/v1/products/retrieve`);
                if (session.data.data.payment_status === 'paid') setIsPaid(true);
                else setError("No Transaction Done");

            } catch (err) {
                console.log(err)
                setError("Wrong Transaction! Please try again");
            } finally {
                setLoader(false);
            }
        })();
    }, []);

    return (
        !loader &&
            isPaid ?
            <Container>
                Success
            </Container>
            : <Container>
                {error}
            </Container>
    )
}

export default Success