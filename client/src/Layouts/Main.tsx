import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Shared/Footer/Footer';
import Navbar from '../Shared/Navbar/Navbar';


const Main: React.FC = () => {
    return (
        <div>
            <div className='mt-10'>
            <Navbar></Navbar>
            </div>

            <div className=''>
                <Navbar></Navbar>
            </div>
            <div className=''>
                <Outlet></Outlet>
            </div>
            <div className=''>
                <Footer></Footer>
            </div>

        </div>
    );
};

export default Main;