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
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
            
        </div>
    );
};

export default Main;