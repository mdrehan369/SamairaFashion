import React, { useState } from 'react'
import logo from "../assets/logo.avif"
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from './Button';
import darkLogo from "../assets/darkLogo.png"
import { toggleTheme as toggleReduxTheme } from '../store/themeslice.js';
import { logout } from "../store/authslice.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { BsTruck } from "react-icons/bs";
import { IoExitOutline } from "react-icons/io5";
import { PiMoon } from "react-icons/pi";
import { LuSun } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import LightSpinner from './LightSpinner.jsx';

function Header() {

    const status = useSelector(state => state.auth.status);
    const [dropdown, setDropdown] = useState(false);
    const theme = useSelector(state => state.theme.theme);
    const dispatch = useDispatch();
    const [sidebar, setSidebar] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [loader, setLoader] = useState(false);

    const toggleTheme = (e) => {
        e.preventDefault();
        if (!localStorage.getItem("theme") || localStorage.getItem("theme") === 'dark') {
            localStorage.setItem("theme", "light");
            document.documentElement.classList.remove('dark')
            document.getElementById('switch').style.transform = 'rotate(360deg)'
        } else {
            localStorage.setItem("theme", "dark");
            document.documentElement.classList.add('dark');
            document.getElementById('switch').style.transform = 'rotate(0deg)'
        }
        dispatch(toggleReduxTheme());
    }

    const handleLogout = async () => {
        try {
            setLoader(true);
            await axios.get('/api/v1/users/logout', {
                baseURL: import.meta.env.VITE_BACKEND_URL,
                withCredentials: true
            });
            dispatch(logout());
            window.location.href = '/';
        } catch (err) {
            console.log(err);
        } finally {
            setLoader(false);
        }
    }

    const activeClasses = ({ isActive }) => `py-2 px-4 rounded-full hover:bg-black relative hover:text-white hover:dark:bg-[#00224d] transition ${isActive && 'bg-black dark:bg-[#00224d] text-white shadow-lg px-4 py-2'}`
    // bg-black dark:bg-[#00224d] text-white shadow-lg px-4 py-2PiMoon


    return (
        <>
            {
                <div className={`fixed w-[100vw] h-[100vh] ${!openModal ? 'bg-opacity-0 backdrop-blur-0 -z-30' : 'bg-opacity-50 backdrop-blur-md z-30'} flex items-center justify-center transition-all bg-black duration-900`}>
                    <div className={`${openModal ? 'md:w-[30%] w-[90%] h-[30%]' : 'w-0 h-0'} overflow-hidden bg-[#f1f1f1] rounded-lg shadow-md transition-all dark:bg-secondary-color duration-300 flex flex-col items-center justify-center gap-6 z-30`}>
                        {
                            openModal &&
                            <>
                                <div className='uppercase text-sm font-bold text-center dark:text-white'>Are You Sure You Want To Logout ?</div>
                                <div className='flex items-center justify-center gap-6 w-full'>
                                    <button className='w-24 h-10 bg-red-400 rounded-md hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600 text-sm font-bold' onClick={() => handleLogout()} disabled={loader}>{
                                        loader ?
                                            <LightSpinner />
                                            : 'Yes'
                                    }</button>
                                    <button className='w-24 h-10 bg-green-400 rounded-md hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-600 text-sm font-bold' onClick={() => setOpenModal(false)} disabled={loader}>No</button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            }
            <nav className='w-full md:h-[10vh] h-[8vh] animate-animate-appear sticky top-0 left-0 z-20 bg-transparent flex items-center md:justify-between justify-center md:gap-0 gap-4 backdrop-blur-xl dark:bg-primary-color dark:text-white'>
                <div className='md:hidden cursor-pointer' onClick={() => setSidebar((prev) => !prev)}><FontAwesomeIcon icon={faBars} className='size-6 absolute top-6 left-4' /></div>
                <img src={theme == 'dark' ? darkLogo : logo} className='md:w-[20%] w-[60%] h-auto md:mx-auto' />
                <NavLink to={'/search'} className='md:hidden absolute top-6 right-4'><FontAwesomeIcon icon={faSearch} className='size-6 cursor-pointer' /></NavLink>
                <div className={`md:hidden absolute ${sidebar ? 'w-[100vw]' : 'w-0'} z-20 bg-black bg-opacity-50 overflow-hidden overscroll-x-contain h-[100vh] overscroll-contain left-0 top-[8vh]`} onClick={() => setSidebar(false)}>
                    <div className={`bg-gray-100 dark:bg-secondary-color divide-y-2 dark:divide-slate-800 flex flex-col items-start ${sidebar ? 'w-[80%]' : 'w-0'} ease-in-out duration-300 transition-all overflow-hidden shadow-sm h-full justify-start`}>
                        {
                            sidebar &&
                            <>
                                <NavLink to={'/'} className='w-full min-w-fit py-4 px-6 text-sm'>Home</NavLink>
                                <NavLink to={'/shop?category=Straight'} className='w-full py-4 px-6 min-w-fit text-sm'>Straight Abaya</NavLink>
                                <NavLink to={'/shop?category=Umbrella'} className='w-full py-4 px-6 min-w-fit text-sm'>Umbrella Abaya</NavLink>
                                <NavLink to={'/shop?category=Farasha'} className='w-full py-4 px-6 min-w-fit text-sm'>Farasha Abaya</NavLink>
                                <NavLink to={'/shop?category=Tye Dye'} className='w-full py-4 px-6 min-w-fit text-sm'>Tye Dye Abaya</NavLink>
                                <NavLink to={'/policies/contact'} className='w-full py-4 px-6 min-w-fit text-sm'>Contact Us</NavLink>
                                <NavLink to={'/policies/aboutus'} className='w-full py-4 px-6 min-w-fit text-sm'>About</NavLink>
                                {
                                    !status ?
                                        <>
                                            <NavLink to={'/signin'} className='w-full py-4 px-6 text-sm'>Sign In</NavLink>
                                            <NavLink to={'/signup'} className='w-full py-4 px-6 text-sm'>Sign Up</NavLink>
                                        </>
                                        :
                                        <>
                                            <NavLink to='/orders' className='w-full py-4 px-6 text-sm'>My Orders</NavLink>
                                            <NavLink to='/cart' className='w-full py-4 px-6 text-sm'>My Cart</NavLink>
                                            <NavLink to='#' onClick={() => setOpenModal(true)} className='w-full py-4 px-6 text-sm'>Log Out</NavLink>
                                        </>
                                }
                                <NavLink to={'#'} onClick={toggleTheme} className='w-full py-4 px-6 min-w-fit text-sm'>Toggle Theme</NavLink>
                            </>
                        }
                    </div>
                </div>
                <div className='w-[40%] h-full hidden md:block'>
                    <ul className='w-full h-full flex items-center justify-center gap-10 font-semibold text-md'>
                        <NavLink to='/' className={activeClasses}>Home</NavLink>
                        <NavLink to='/shop' className={activeClasses}
                            onMouseEnter={() => setDropdown(true)}
                            onMouseLeave={() => setDropdown(false)}
                            onClick={(e) => e.preventDefault()}

                        >Shop
                            {
                                dropdown &&
                                <div className={`absolute top-10 divide-y-2 transition-all overflow-hidden flex flex-col items-center justify-start left-[-4vw] shadow-lg bg-white dark:bg-secondary-color dark:text-white text-black dark:divide-slate-950`} onClick={() => setDropdown(false)}>
                                    <NavLink to={'/shop?category=Straight'} className='px-4 py-4 w-52 text-start hover:underline hover:bg-gray-200 dark:hover:bg-[#132d6a]  transition-colors text-sm font-medium'>Straight</NavLink>
                                    <NavLink to={'/shop?category=Umbrella'} className='px-4 py-4 w-52 text-start hover:underline hover:bg-gray-200 dark:hover:bg-[#132d6a]  transition-colors text-sm font-medium'>Umbrella</NavLink>
                                    <NavLink to={'/shop?category=Tye Dye'} className='px-4 py-4 w-52 text-start hover:underline hover:bg-gray-200 dark:hover:bg-[#132d6a]  transition-colors text-sm font-medium'>Tye Dye</NavLink>
                                    <NavLink to={'/shop?category=Farasha'} className='px-4 py-4 w-52 text-start hover:underline hover:bg-gray-200  dark:hover:bg-[#132d6a] transition-colors text-sm font-medium'>Farasha</NavLink>
                                </div>
                            }
                        </NavLink>
                        <NavLink to='/policies/aboutus' className={activeClasses}>About Us</NavLink>
                        <NavLink to='/policies/contact' className={activeClasses}>Contact Us</NavLink>
                    </ul>
                </div>

                {/* // className={({ isActive }) => isActive && `bg-black text-white pt-3 pb-2 px-4 rounded-full` */}
                <div className='w-[30%] h-full hidden md:block'>
                    <ul className='w-full h-full flex items-center justify-center gap-4 font-semibold text-xl'>
                        <NavLink to='/search' className={({ isActive }) => `hover:bg-gray-300 hover:dark:bg-blue-950 ${isActive && 'bg-gray-300 dark:bg-blue-950'} transition px-2 py-2 rounded-full`}><IoIosSearch size='25' /></NavLink>
                        {status && <NavLink to='/cart' className={({ isActive }) => `hover:bg-gray-300 hover:dark:bg-blue-950 ${isActive && 'bg-gray-300 dark:bg-blue-950'} transition px-2 py-2 rounded-full`}><IoCartOutline size='25' /></NavLink>}
                        {
                            !status ?
                                <>
                                    <NavLink to='/signin'><Button className='transition py-2 px-3'>Sign In</Button></NavLink>
                                    <NavLink to='/signup'><Button className='transition box-border py-2 px-3'>Sign Up</Button></NavLink>
                                </>
                                : <>
                                    <NavLink to='/orders' className={({ isActive }) => `hover:bg-gray-300 hover:dark:bg-blue-950 ${isActive && 'bg-gray-300 dark:bg-blue-950'} transition px-2 py-2 rounded-full`}><BsTruck size='25' /></NavLink>
                                    <NavLink onClick={() => setOpenModal(true)} to='#' className={() => `hover:bg-gray-300 hover:dark:bg-blue-950 transition px-2 py-2 rounded-full`}><IoExitOutline size='25' /></NavLink>
                                </>
                        }
                        {
                            theme === 'light' ?
                                <NavLink onClick={toggleTheme} id='switch' className={() => `hover:bg-gray-300 hover:dark:bg-blue-950 transition px-2 py-2 rounded-full duration-300`} ><PiMoon size='25' /></NavLink>
                                :
                                <NavLink onClick={toggleTheme} id='switch' className={() => `hover:bg-gray-300 hover:dark:bg-blue-950 transition px-2 py-2 rounded-full duration-300`} ><LuSun size='25' /></NavLink>
                        }
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Header