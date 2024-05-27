import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import Spinner from './Spinner.jsx';
import { login, setLocation } from "../store/authslice.js"
import { setTheme } from "../store/themeslice.js"
import axios from 'axios';

function AuthLayout({ children }) {

    const dispatch = useDispatch();
    const [loader, setLoader] = useState(true);
    const theme = useSelector(state => state.theme.theme);

    useEffect(() => {
        if (theme === null && localStorage.getItem("theme") !== null) {
            if (localStorage.getItem("theme") === 'light') {
                document.documentElement.classList.remove('dark')
            } else {
                document.documentElement.classList.add('dark')
            }
            dispatch(setTheme(localStorage.getItem("theme")))
        } else if (theme === null) {
            localStorage.setItem("theme", 'light');
            document.documentElement.classList.remove('dark')
            dispatch(setTheme('light'));
        }
    }, [])

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

    useEffect(() => {
        ;(async () => {
            try {
                const response = await axios.get("/api/v1/users/user");
                dispatch(login(response.data.data))
            } catch (err) {
                console.log(err);
            }

        })();
    }, [])

    return (
            !loader ?
            <>
                {children}
            </> :
            <Spinner className='w-[100vw] h-[100vh]' />
    )
}

export default AuthLayout