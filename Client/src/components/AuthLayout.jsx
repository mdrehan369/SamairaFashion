import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useAxios } from '../hooks/useAxios.js';
import Spinner from './Spinner.jsx';
import { login } from "../store/authslice.js"

function AuthLayout({ children }) {

    const status = useSelector(state => state.auth.status);
    const dispatch = useDispatch();

    const [loading, error, response] = useAxios('/api/v1/users/user', 'GET', {});

    useEffect(() => {
        if(!error && !loading) {
            dispatch(login(response.data));
        }
    }, [loading]);

    return (
        !loading ?
        <>
            {children}
        </>:
        <Spinner />
    )
}

export default AuthLayout