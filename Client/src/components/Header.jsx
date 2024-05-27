import React, { useState } from 'react'
import logo from "../assets/logo.avif"
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from './Button';
import darkLogo from "../assets/darkLogo.png"
import { toggleTheme as toggleReduxTheme } from '../store/themeslice.js';
import { logout } from "../store/authslice.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBox, faShoppingCart, faSignOut } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

function Header() {

    const status = useSelector(state => state.auth.status);
    const [dropdown, setDropdown] = useState(false);
    const theme = useSelector(state => state.theme.theme);
    const dispatch = useDispatch();
    const [sidebar, setSidebar] = useState(false);

    const toggleTheme = () => {
        if (!localStorage.getItem("theme") || localStorage.getItem("theme") === 'dark') {
            localStorage.setItem("theme", "light");
            document.documentElement.classList.remove('dark')
        } else {
            localStorage.setItem("theme", "dark");
            document.documentElement.classList.add('dark')
        }
        dispatch(toggleReduxTheme());
    }

    const handleLogout = async () => {
        try {
            await axios.get('/api/v1/users/logout', {
                baseURL: import.meta.env.VITE_BACKEND_URL
            });
            dispatch(logout());
            window.location.href = '/';
        } catch (err) {
            console.log(err);
        }
    }

    const activeClasses = ({ isActive }) => `py-2 px-4 rounded-full hover:bg-black relative hover:text-white hover:dark:bg-[#00224d] transition ${isActive && 'bg-black dark:bg-[#00224d] text-white shadow-lg px-4 py-2'}`
// bg-black dark:bg-[#00224d] text-white shadow-lg px-4 py-2


    return (
        <nav className='w-full md:h-[10vh] h-[8vh] animate-animate-appear sticky top-0 left-0 z-20 bg-transparent flex items-center md:justify-center justify-center md:gap-0 gap-4 backdrop-blur-xl dark:bg-primary-color dark:text-white'>
            <div className='md:hidden' onClick={() => setSidebar((prev) => !prev)}><FontAwesomeIcon icon={faBars} className='size-6 absolute top-6 left-4' /></div>
            <img src={theme == 'dark' ? darkLogo : logo} className='md:w-[20%] w-[60%] h-auto md:ml-10' />
            <NavLink to={status ? `/cart` : '/signin'} className='md:hidden'><FontAwesomeIcon icon={faShoppingCart} className='size-6 absolute top-6 right-4' /></NavLink>
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
                                        <NavLink to='#' onClick={handleLogout} className='w-full py-4 px-6 text-sm'>Log Out</NavLink>
                                    </>
                            }
                            <NavLink to={'#'} onClick={toggleTheme} className='w-full py-4 px-6 min-w-fit text-sm'>Toggle Theme</NavLink>
                        </>
                    }
                </div>
            </div>
            <div className='w-[50%] h-full hidden md:block'>
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
                <ul className='w-full h-full flex items-center justify-center gap-8 font-semibold text-xl'>
                    <NavLink to='/search'><i className="fi fi-rr-search"></i></NavLink>
                    {status && <NavLink to='/cart'><i className="fi fi-rr-shopping-cart"></i></NavLink>}
                    {
                        !status ?
                        <>
                            <NavLink to='/signin'><Button className='transition py-2 px-3'>Sign In</Button></NavLink>
                            <NavLink to='/signup'><Button className='transition box-border py-2 px-3'>Sign Up</Button></NavLink>
                        </>
                        : <>
                            <NavLink to='/orders'><FontAwesomeIcon icon={faBox} className='bg-transparent'/></NavLink>
                            <NavLink onClick={handleLogout} to='#'><FontAwesomeIcon icon={faSignOut} className=''/></NavLink>
                        </>
                    }
                    <li onClick={toggleTheme}><i className={`fi fi-rr-${theme === 'dark' ? 'sun' : 'moon-stars'}`}></i></li>
                </ul>
            </div>
        </nav>
    )
}

export default Header