import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Components/Shared/Footer';

const Main: React.FC = () => {
    return (
        <div>
            {/* navbar  */}

            <div className=''>
                <Outlet></Outlet>
            </div>
            {/* footer */}
            <Footer />
        </div>
    );
};

export default Main;