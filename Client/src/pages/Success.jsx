import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '../components';
// import Mailjet from "node-mailjet"
// import * as mailjet from "node-mailjet"

//template_xdr0el9
//POST https://api.emailjs.com/api/v1.0/email/send

// var data = {
//     service_id: 'YOUR_SERVICE_ID',
//     template_id: 'YOUR_TEMPLATE_ID',
//     user_id: 'YOUR_PUBLIC_KEY',
//     template_params: {
//         'username': 'James',
//         'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...'
//     }
// };

//-SJa_6Mlr8wpQPQDl
//FL46QHpRpYZrDPygkqYIP

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