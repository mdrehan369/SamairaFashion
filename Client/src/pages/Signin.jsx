import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { login } from '../store/authslice.js';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { Input, Button, Container, LightSpinner } from "../components/index.js"
import logo from "../assets/logo.avif"
import darkLogo from "../assets/darkLogo.png"

function Signin() {

    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);

    const submit = async (data) => {
        try {
            setLoader(true);
            const response = await axios.post('/api/v1/users/signin', data, {
                baseURL: import.meta.env.VITE_BACKEND_URL,
                withCredentials: true,
            });
            dispatch(login(response.data.data));
            if (data.email === 'admin') {
                navigate('/admin/overview');
                return;
            }
            navigate("/");
        } catch (e) {
            // console.log(e);
            setError(e.response.data.message);
        } finally {
            setLoader(false);
        }
    }

    return (
        <Container className='flex flex-col items-center justify-center gap-8 relative'>
            <div className={`p-2 bg-red-400 transition-all duration-300 rounded-lg ${error ? 'bg-opacity-1 translate-y-3' : 'bg-opacity-0 translate-y-[-12px]'} absolute left-[50%] translate-x-[-50%] top-10`}>{error}</div>
            <img src={localStorage.getItem("theme") === 'dark' ? darkLogo : logo} className='md:w-[20vw] w-[80vw]' />
            <form onSubmit={handleSubmit(submit)} className='flex flex-col items-center justify-center gap-4 md:w-[25%] w-[80%]'>
                <Input type="text" name='email' register={register} placeholder='ex. john123@example.com' required className={`w-full ${error && 'border-red-500'}`} onChange={() => error && setError(null)} label='Email' />
                <Input type={showPass ? "text" : "password"} name='password' register={register} placeholder='8+ Characters' className={`w-full ${error && 'border-red-500'}`} onChange={() => error && setError(null)} label='Password' required />
                <div className='ml-3 self-start space-x-2'>
                    <input type="checkbox" className='cursor-pointer' id="showpass" onClick={() => setShowPass((prev) => !prev)} />
                    <label htmlFor="showpass" className='cursor-pointer dark:text-white'>Show Password</label>
                </div>
                <NavLink to='/signup' className='text-blue-500 underline hover:text-blue-800 self-start ml-4'>New User? Sign Up Here</NavLink>
                <Button type='submit' disabled={loader} className='p-0 w-52 h-16 uppercase text-sm font-bold'>
                    {
                        loader ?
                        <LightSpinner />
                        : 'Log In'
                    }
                </Button>
            </form>
        </Container>
    )
}

export default Signin