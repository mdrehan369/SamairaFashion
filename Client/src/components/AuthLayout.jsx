import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import { useAxios } from '../hooks/useAxios.js';
import Spinner from './Spinner.jsx';
import { login, setLocation } from "../store/authslice.js"
import axios from 'axios';

function AuthLayout({ children }) {

    const dispatch = useDispatch();
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        ; (async () => {
            try {
                const response = await axios.get(`http://ip-api.com/json`);
                if(response.data.countryCode === 'IN') {
                    dispatch(setLocation({ isIndia: true }))
                } else {
                    const response = await axios.get('http://www.floatrates.com/daily/aed.json');
                    const dirham_to_rupees = Math.floor(response.data.inr.rate);
                    dispatch(setLocation({ isIndia: false, dirham_to_rupees }))
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoader(false);
            }
        })();
    }, []);

    const [loading, error, response] = useAxios('/api/v1/users/user', 'GET', {});

    useEffect(() => {
        if (!error && !loading) {
            dispatch(login(response.data));
        }
    }, [loading]);

    return (
        !loading && !loader ?
            <>
                {children}
            </> :
            <Spinner />
    )
}

export default AuthLayout