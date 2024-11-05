import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
    return (
        <div>
            <div className="bg-red-500 text-black text-center justify-center h-screen my-auto">
                <h3>no page found</h3>
                <button className="border rounded p-2 bg-green-50"><Link to={'/'}>go Back</Link></button></div>
        </div>
    );
};

export default ErrorPage;