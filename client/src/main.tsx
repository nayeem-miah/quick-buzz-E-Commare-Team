import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import {

  RouterProvider,
} from "react-router-dom";
import router from './Routers/Router';
import AuthProvider from './Provider/AuthProvider';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='bg-white text-black'>
     <AuthProvider>
     <RouterProvider router={router} />
     </AuthProvider>
    </div>
  </StrictMode>,
)


