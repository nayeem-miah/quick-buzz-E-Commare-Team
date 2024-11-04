import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Dashboard: React.FC = () => {
    return (
        <div>
            <h3>Dashboard</h3>
            <Outlet />
        </div>
    );
};

export default Dashboard;