import React from 'react';
import Navbar from '../../Shared/Navbar/Navbar';
import Banner from './Banner/Banner';


const Home: React.FC = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Banner></Banner>
            home page section
           
        </div>
    );
};

export default Home;