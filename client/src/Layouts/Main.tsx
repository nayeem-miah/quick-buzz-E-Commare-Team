import React from 'react';
import { Outlet } from 'react-router-dom';

const Main: React.FC = () => {
    return (
        <div>
            {/* navbar  */}
            <Outlet></Outlet>
            {/* footer */}
        </div>
    );
};

export default Main;