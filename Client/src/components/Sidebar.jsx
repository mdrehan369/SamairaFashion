// src/components/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-[20%] flex flex-col justify-between">
      <div className="p-4 flex flex-col items-start justify-start gap-4">
        {/* Sidebar content */}
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <NavLink to='/admin/products' className='text-xl font-medium'>Products</NavLink>
        <NavLink to='/admin/orders' className='text-xl font-medium'>Orders</NavLink>
        <NavLink to='/admin' className='text-xl font-medium'>Users</NavLink>
        <NavLink to='/admin/addProduct' className='text-xl font-medium'>Add Product</NavLink>
        {/* Add sidebar links here */}
      </div>
      <div className="p-4">
        {/* Sidebar footer */}
        <p className="text-sm">&copy; 2024 Your Company</p>
      </div>
    </div>
  );
};

export default Sidebar;
