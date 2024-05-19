import React, { useState } from 'react'
import logo from "../assets/logo.avif"
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from './Button';
import darkLogo from "../assets/darkLogo.png"
import { toggleTheme as toggleReduxTheme } from '../store/themeslice.js';

function Header() {

    const status = useSelector(state => state.auth.status);
    const [dropdown, setDropdown] = useState(false);
    const theme = useSelector(state => state.theme.theme);
    const dispatch = useDispatch();

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

    const activeClasses = ({ isActive }) => `py-2 px-4 rounded-full hover:bg-black relative hover:text-white hover:dark:bg-[#00224d] transition ${isActive && 'bg-black dark:bg-[#00224d] text-white shadow-lg px-4 py-2'}`

    return (
        <nav className='w-full h-[10vh] sticky top-0 left-0 z-30 bg-transparent flex items-center justify-center backdrop-blur-xl dark:bg-primary-color dark:text-white'>
            <img src={theme == 'dark' ? darkLogo : logo} className='w-[20%] h-auto ml-10' />
            <div className='w-[50%] h-full'>
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
            <div className='w-[30%] h-full'>
                <ul className='w-full h-full flex items-center justify-center gap-8 font-semibold text-xl'>
                    <li><i className="fi fi-rr-search"></i></li>
                    {status && <NavLink to='/cart' className={({ isActive }) => isActive && `bg-black text-white py-2 px-3 rounded-full`}><i className="fi fi-rr-shopping-cart"></i></NavLink>}
                    {
                        !status &&
                            <>
                                <NavLink to='/signin'><Button className='transition py-2 px-3'>Sign In</Button></NavLink>
                                <NavLink to='/signup'><Button className='transition box-border py-2 px-3'>Sign Up</Button></NavLink>
                            </>
                    }
                    <li onClick={toggleTheme}><i className={`fi fi-rr-${theme === 'dark' ? 'sun' : 'moon-stars'}`}></i></li>
                </ul>
            </div>
        </nav>
    )
}

export default Header