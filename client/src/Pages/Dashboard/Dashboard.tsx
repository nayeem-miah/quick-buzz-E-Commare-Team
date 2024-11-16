import React from 'react';
import {  Outlet } from 'react-router-dom';
import Sidebar from '../../Layouts/Dashboard/Dashboard';

const Dashboard: React.FC = () => {
    return (
        <div className=''>
            <Sidebar></Sidebar>
           <div className='mr-24'>
           <Outlet />
           </div>
        </div>
    );
};

export default Dashboard;