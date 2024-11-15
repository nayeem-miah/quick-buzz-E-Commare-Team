import React from 'react';
import {  Outlet } from 'react-router-dom';
import Sidebar from '../../Layouts/Dashboard/Dashboard';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Sidebar></Sidebar>
            <Outlet />
        </div>
    );
};

export default Dashboard;