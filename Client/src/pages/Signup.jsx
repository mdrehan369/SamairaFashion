import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { login } from '../store/authslice.js';
import axios from 'axios';
import { Input, Button, Container } from "../components/index.js"
import logo from "../assets/logo.avif";
import { useNavigate } from 'react-router-dom';

function Signup() {

    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submit = async (data) => {
        try {
            const response = await axios.post('/api/v1/users/signup', data);
            dispatch(login(response.data.data));
        } catch (e) {
            console.log(e);
            setError(e.response.data.message);
        }
    }

    return (
        <Container className='flex flex-col items-center justify-center gap-4'>
            <div className={`p-2 bg-red-400 rounded-lg ${error ? 'visible' : 'invisible'} absolute left-[50%] translate-x-[-50%] top-10`}>{error}</div>
            <img src={logo} className='w-[20vw]' />
            <form onSubmit={handleSubmit(submit)} className='flex items-center justify-center'>
                <div className='flex flex-col items-center justify-start h-[90%]'>
                    <Input type="text" name="firstName" register={register} placeholder='firstName' required />
                    <Input type="text" name="lastName" register={register} placeholder='lastName' required />
                    <Input type="text" name="email" register={register} placeholder='email' required />
                    <Input type={showPass?"text":"password"} name="password" register={register} placeholder='password' required />
                    <div className='ml-3 self-start space-x-2'>
                        <input type="checkbox" className='cursor-pointer' id="showpass" onClick={() => setShowPass((prev) => !prev)} />
                        <label htmlFor="showpass" className='cursor-pointer'>Show Password</label>
                    </div>
                    <Input type="text" name="number" register={register} placeholder='number' required />
                </div>
                <div className='flex flex-col items-center justify-start h-[90%]'>
                    <Input type="text" name="address" register={register} placeholder='address' required />
                    <Input type='text' name="city" register={register} placeholder='City' required />
                    <Input type='text' name="state" register={register} placeholder='State' required />
                    <Input type='number' name="pincode" register={register} placeholder='Pincode' required />
                    <Button type='submit'>
                        Sign Up
                    </Button>
                </div>
            </form>
        </Container>
    )
}

export default Signup