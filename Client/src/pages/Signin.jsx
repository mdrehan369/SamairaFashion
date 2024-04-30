import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { login } from '../store/authslice.js';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { Input, Button, Container } from "../components/index.js"
import logo from "../assets/logo.avif"

function Signin() {

    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState(false);

    const submit = async (data) => {
        try {
            const response = await axios.post('/api/v1/users/signin', data);
            dispatch(login(response.data.data));
            navigate("/");
        } catch (e) {
            // console.log(e);
            setError(e.response.data.message);
        }
    }

  return (
    <Container className='flex flex-col items-center justify-center gap-8 relative'>
        <div className={`p-2 bg-red-400 rounded-lg ${error?'visible':'invisible'} absolute left-[50%] translate-x-[-50%] top-10`}>{error}</div>
        <img src={logo} className='w-[20vw]'/>
        <form onSubmit={handleSubmit(submit)} className='flex flex-col items-center justify-center gap-4'>
            <Input type="text" name='email' register={register} placeholder='Email' required />
            <Input type={showPass?"text":"password"} name='password' register={register} placeholder='Password' required />
            <div className='ml-3 self-start space-x-2'>
                <input type="checkbox" className='cursor-pointer' id="showpass" onClick={() => setShowPass((prev) => !prev)} />
                <label htmlFor="showpass" className='cursor-pointer dark:text-white'>Show Password</label>
            </div>
            <NavLink to='/signup' className='text-blue-500 underline hover:text-blue-800 self-start ml-4'>New User? Sign Up Here</NavLink>
            <Button>
                Log In
            </Button>
        </form>
    </Container>
  )
}

export default Signin