import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { Container } from '../components';

const Dashboard = () => {
  return (
    <Container className="flex h-screen">
      <Sidebar />
      <Outlet />
    </Container>
  );
};

export default Dashboard;

