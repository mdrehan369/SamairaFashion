import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '../components';


function Success() {

    const { orderId } = useParams();
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState("");
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        ; (async () => {
            setLoader(true);
            try {
                if (!orderId) throw new Error("No OrderId Found");

                const response = await axios.get(`/api/v1/orders/order/${orderId}`);
                const sessionId = response.data.data.sessionId;
                const session = await axios.get(`/api/v1/products/retrieve/${sessionId}`);

                if (session.data.data.payment_status === 'paid') setIsPaid(true);
                await axios.put(`/api/v1/orders/order/${orderId}`);
                
                // await axios.delete('/api/v1/users/cart');

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