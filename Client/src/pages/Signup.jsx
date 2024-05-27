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
            navigate("/");
        } catch (e) {
            console.log(e);
            setError(e.response.data.message);
        }
    }

    return (
        <Container className='flex flex-col items-center justify-center gap-4'>
            <div className={`p-2 bg-red-400 rounded-lg ${error ? 'visible' : 'invisible'} absolute left-[50%] translate-x-[-50%] top-10`}>{error}</div>
            <img src={logo} className='md:w-[20vw] w-[80vw]' />
            <form onSubmit={handleSubmit(submit)} className='flex flex-col items-center gap-2 justify-center md:w-[50%] w-[80%]'>
                <div className='flex flex-col items-center justify-start h-[90%] gap-2'>
                    <div className='w-full flex items-center justify-center gap-2'>
                        <Input type="text" name="firstName" register={register} label='First Name' placeholder='ex. John' className='w-full' required />
                        <Input type="text" name="lastName" register={register} placeholder='ex. Smith' label='Last Name' className='w-full' required />
                    </div>
                    <Input type="text" name="email" label='Email' register={register} placeholder='ex. john123@example.com' className='w-full' required />
                    <Input type="text" name="number" register={register} placeholder='ex. +91 9435312525' label='Number' className='w-full' required />
                    <Input type={showPass ? "text" : "password"} name="password" register={register} label='8+ Characters' placeholder='password' className='w-full' required />
                    <div className='ml-3 self-start space-x-2'>
                        <input type="checkbox" className='cursor-pointer' id="showpass" onClick={() => setShowPass((prev) => !prev)} />
                        <label htmlFor="showpass" className='cursor-pointer'>Show Password</label>
                    </div>
<<<<<<< HEAD
=======
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
>>>>>>> admin
                </div>
                {/* <div className='flex flex-col items-center justify-start gap-2 h-[90%]'> */}
                {/* <Input type="text" name="address" register={register} placeholder='address' className='w-full' required />
                    <Input type='text' name='city' register={register} placeholder='City' className='w-full' required />
                    <Input type='text' name='State' register={register} placeholder='State' className='w-full' required />
                    <Input type='number' name='Pincode' register={register} placeholder='Pincode' className='w-full' required /> */}
                {/* </div> */}
                <Button type='submit'>
                    Sign Up
                </Button>
            </form>
        </Container>
    )
}

export default Signup