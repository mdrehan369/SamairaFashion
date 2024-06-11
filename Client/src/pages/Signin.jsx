import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import signin from "../assets/signin.jpg"
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { Input, Button, Container, LightSpinner } from "../components/index.js"
import logo from "../assets/logo.avif"
import darkLogo from "../assets/darkLogo.png"
import { useGoogleLogin } from '@react-oauth/google';
import { login } from '../store/authslice.js';
// import FacebookLogin from "react-facebook-login";
// import { LoginSocialFacebook } from "reactjs-social-login";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
// import nodemailer from "nodemailer"

const OtpPage = ({ email, otp }) => {

    const [error, setError] = useState(null);
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            let inputOtp = '';
            Object.keys(data).forEach((elem) => inputOtp += data[elem]);

            if (inputOtp !== otp || inputOtp.length !== 4) {
                setError("Incorrect OTP");
                return;
            }

            const response = await axios.get(`/api/v1/users/signin/${email}`,
                {
                    baseURL: import.meta.env.VITE_BACKEND_URL,
                    withCredentials: true,
                }
            );
            dispatch(login(response.data.data));
            if (data.email === 'admin') {
                navigate('/admin/overview');
                return;
            }
            navigate("/");

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const form = document.getElementById('otp-form')
        const inputs = [...form.querySelectorAll('input[type=text]')]
        const submit = form.querySelector('button[type=submit]')

        const handleKeyDown = (e) => {
            if (
                !/^[0-9]{1}$/.test(e.key)
                && e.key !== 'Backspace'
                && e.key !== 'Delete'
                && e.key !== 'Tab'
                && !e.metaKey
            ) {
                e.preventDefault()
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                const index = inputs.indexOf(e.target);
                if (index > 0) {
                    inputs[index - 1].value = '';
                    inputs[index - 1].focus();
                }
            }
        }

        const handleInput = (e) => {
            const { target } = e
            const index = inputs.indexOf(target)
            if (target.value) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus()
                } else {
                    submit.focus()
                }
            }
        }

        const handleFocus = (e) => {
            e.target.select()
        }

        const handlePaste = (e) => {
            e.preventDefault()
            const text = e.clipboardData.getData('text')
            if (!new RegExp(`^[0-9]{${inputs.length}}$`).test(text)) {
                return
            }
            const digits = text.split('')
            inputs.forEach((input, index) => input.value = digits[index])
            submit.focus()
        }

        inputs.forEach((input) => {
            input.addEventListener('input', handleInput)
            input.addEventListener('keydown', handleKeyDown)
            input.addEventListener('focus', handleFocus)
            input.addEventListener('paste', handlePaste)
        })
    }, [])

    return (
        <div className="max-w-md mx-auto relative text-center bg-transparent px-4 sm:px-8 py-10 rounded-xl">
            {error &&
                <div className={`absolute top-[-20vh] w-[80%] left-[10%] bg-red-500 text-beige px-3 py-1 rounded-md animate-animate-appear `}><FontAwesomeIcon icon={faTriangleExclamation} className='mr-2' />{error}</div>
            }
            <header className="mb-8">
                <h1 className="text-2xl font-bold mb-1">OTP Verification</h1>
                <p className="text-[15px] text-gray-600">Enter the 4-digit verification code that was sent to your email address.</p>
            </header>
            <form id="otp-form" onSubmit={handleSubmit(handleLogin)}>
                <div className="flex items-center justify-center gap-3">
                    <input
                        type="text"
                        {...register('otp1')}
                        className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-beige border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-[#fffcf7] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        pattern="\d*" maxlength="1" />
                    <input
                        type="text"
                        {...register('otp2')}
                        className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-beige border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-[#fffcf7] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        maxlength="1" />
                    <input
                        type="text"
                        {...register('otp3')}
                        className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-beige border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-[#fffcf7] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        maxlength="1" />
                    <input
                        type="text"
                        {...register('otp4')}
                        className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-beige border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-[#fffcf7] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        maxlength="1" />
                </div>
                <div className="max-w-[260px] mx-auto mt-4">
                    <button type="submit"
                        className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-maroon px-3.5 py-2.5 text-sm font-medium text-beige shadow-sm shadow-indigo-950/10 hover:bg-[#561818] focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150">Verify
                        Account</button>
                </div>
            </form>
            <div className="text-sm text-gray-600 mt-4">Didn't receive code? <a className="font-medium text-maroon hover:text-blue-500" href="#0">Resend</a></div>
        </div>
    )
}

function Signin() {

    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [err, setError] = useState(null);
    const [loader, setLoader] = useState(false);
    const [otpPage, setOtpPage] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const Glogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${codeResponse.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then(async (res) => {
                    const response = await axios.get(`/api/v1/users/googleSignin/${res.data.id}`,
                        {
                            baseURL: import.meta.env.VITE_BACKEND_URL,
                            withCredentials: true
                        }
                    );

                    dispatch(login(response.data.data));
                    navigate('/');

                })
                .catch((err) => console.log(err));
        },

        onError: (err) => setError(err.error_description)

    });

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const submit = async (data) => {
        try {
            setLoader(true);

            if (!validateEmail(data.email)) {
                setError("Invalid Email Address");
                return;
            } else {
                setError(null);
            }

            const response = await axios.get(`/api/v1/users/send/${data.email}`, {
                baseURL: import.meta.env.VITE_BACKEND_URL,
                withCredentials: true,
            });
            setOtp(response.data.data);
            setEmail(data.email)
            response.status === '200' && setOtpPage(true);

            setOtpPage(true);

        } catch (e) {
            setError(e.response.data.message);
        } finally {
            setLoader(false);
        }
    }

    const handleWithoutLogin = async() => {
        try {

            let uuid = localStorage.getItem("uuid");
            if(uuid === null) {
                uuid = Date.now().toString();
            }

            const { data } = await axios.get(`/api/v1/users/uuid/${uuid}`, {
                withCredentials: true,
                baseURL: import.meta.env.VITE_BACKEND_URL,
            });

            localStorage.setItem("uuid", uuid);

            dispatch(login(data.data));
            navigate('/');

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container className='flex items-center justify-center gap-0 relative h-[100vh] w-[100vw] bg-[#fff]'>
            <img src={signin} alt="Stock" className='w-[70%] h-full animate-animate-appear hidden md:block' />
            <div className='md:w-[30%] w-full flex flex-col relative items-center justify-center gap-10 h-[100%] bg-[#ffefd2] border-l-2 shadow-md border-[rgb(129,30,30)]'>
                {err &&
                    <div className={`absolute top-[10vh] w-[80%] text-center left-[10%] bg-red-500 text-beige px-3 py-1 rounded-md animate-animate-appear `}>
                        <FontAwesomeIcon icon={faTriangleExclamation} className='mr-2' />{err}
                    </div>
                }
                {
                    !otpPage ?
                        <>
                            <img src={localStorage.getItem("theme") === 'dark' ? darkLogo : logo} className='md:w-[20vw] w-[80vw]' />
                            <form onSubmit={handleSubmit(submit)} className='flex flex-col items-center justify-center gap-4 md:w-[25%] w-[100%]'>
                                <input type="text" {...register('email')} className='md:w-[20vw] w-[80%] py-3 bg-[#fffcf7] px-4 border-[1px] border-[#ffefd2] text-sm focus:ring-0 focus:border-maroon focus:outline-none' placeholder='Email...' />
                                <Button type='submit' disabled={loader} className='w-[80%] p-0 md:w-[20vw] bg-[#800000] text-[#ffdfa8] h-12 uppercase text-sm font-bold'>
                                    {
                                        loader ?
                                            <LightSpinner color={'fill-[#900000]'} />
                                            : 'Log In'
                                    }
                                </Button>
                            </form>
                            <div className='flex items-center justify-center gap-4 w-full'>
                                <div className='w-[8vw] h-[2px] bg-[#c1a46e]'></div>
                                <div className='text-gray-800'>or</div>
                                <div className='w-[8vw] h-[2px] bg-[#c1a46e]'></div>
                            </div>
                            <div className='w-full flex flex-col items-center justify-center gap-4'>
                                <button className="flex w-[80%] items-center bg-[#fffcf7] dark:bg-gray-900 border-gray-300 rounded-md shadow-sm md:w-[20vw] justify-center py-3 text-sm font-medium text-gray-800 border-0 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-500" onClick={Glogin}>
                                    <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
                                    <span>Continue with Google</span>
                                </button>

                                <button className='flex w-[80%] items-center bg-[#fffcf7] dark:bg-gray-900 border-0 border-gray-300 rounded-md shadow-sm md:w-[20vw] justify-center py-3 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-500'>
                                    <FontAwesomeIcon icon={faFacebook} className='mr-2 text-blue-500 size-6' />
                                    Continue With Facebook</button>

                                <button className="flex w-[80%] items-center bg-[#fffcf7] dark:bg-gray-900 border-0 border-gray-300 rounded-md shadow-sm md:w-[20vw] justify-center py-3 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-500" onClick={handleWithoutLogin}>Continue Without Login</button>
                            </div>
                        </> :
                        <OtpPage otp={otp} email={email} />
                }
            </div>

            {/* <LoginSocialFacebook
                appId='1595366361249902'
                onResolve={(res) => console.log(res)}
                onReject={(res) => console.log(res)}
            >
                Login
            </LoginSocialFacebook>

            <button onClick={sendEmail}>
                send
            </button> */}

        </Container>
    )
}

export default Signin