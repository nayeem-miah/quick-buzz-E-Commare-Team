import React from 'react';
import useAuth from '../../Hooks/UseAuth';

const Profile: React.FC = () => {
    const {user} = useAuth();
   
    const {displayName,photoURL,email} = user;
    
    return (
        <div>
            <div className="flex flex-col justify-center w-[500px] mx-auto mt-44 bg-[#FFE4E6] p-6 shadow-md rounded-xl sm:px-12 dark:bg-gray-50 dark:text-gray-800">
	<img src={photoURL} alt="" className="w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square" />
	<div className="space-y-4 text-center divide-y dark:divide-gray-300">
		<div className="my-2 space-y-1">
			<h2 className="text-xl font-semibold sm:text-2xl">{displayName}</h2>
			<p className="px-5 text-xs sm:text-base dark:text-gray-600">{email}</p>
		</div>
		<div className="flex justify-center pt-2 space-x-4 align-center">
			
		</div>
	</div>
</div>
            
        </div>
    );
};

export default Profile;