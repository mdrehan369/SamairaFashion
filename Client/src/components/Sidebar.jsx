// src/components/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { FaProductHunt, FaUser, FaBoxes } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white w-[20%] flex flex-col justify-between">
            <div className="p-4 flex flex-col items-start justify-start gap-2">

                <h2 className="text-2xl font-bold mb-10">Dashboard</h2>
                <NavLink to='/admin/overview' className={({ isActive }) => `text-xl font-medium w-full p-3 rounded-md flex items-center gap-3 ${isActive && 'bg-gray-900'} hover:bg-gray-900 transition-colors`}>
                    <MdDashboard />
                    <span className='text-sm uppercase font-semibold tracking-widest'>Overview</span>
                </NavLink>
                <NavLink to='/admin/products' className={({ isActive }) => `text-xl font-medium w-full p-3 rounded-md flex items-center gap-3 ${isActive && 'bg-gray-900'} hover:bg-gray-900 transition-colors`}>
                    <FaProductHunt />
                    <span className='text-sm uppercase font-semibold tracking-widest'>Products</span>
                </NavLink>
                <NavLink to='/admin/orders' className={({ isActive }) => `text-xl font-medium w-full p-3 rounded-md flex items-center gap-3 ${isActive && 'bg-gray-900'} hover:bg-gray-900 transition-colors`}>
                    <FaBoxes />
                    <span className='text-sm uppercase font-semibold tracking-widest'>Orders</span>
                </NavLink>
                <NavLink to='/admin/users' className={({ isActive }) => `text-xl font-medium w-full p-3 rounded-md flex items-center gap-3 ${isActive && 'bg-gray-900'} hover:bg-gray-900 transition-colors`}>
                    <FaUser />
                    <span className='text-sm uppercase font-semibold tracking-widest'>Users</span>
                </NavLink>
                <NavLink to='/admin/addProduct' className={({ isActive }) => `text-xl font-medium w-full p-3 rounded-md flex items-center gap-3 ${isActive && 'bg-gray-900'} hover:bg-gray-900 transition-colors`}>
                    <IoIosAddCircle />
                    <span className='text-sm uppercase font-semibold tracking-widest'>Add Product</span>
                </NavLink>
            </div>
            <div className="p-4">
                {/* Sidebar footer */}
                <p className="text-sm">&copy; 2024 Your Company</p>
            </div>
        </div>
    );
};

export default Sidebar;
