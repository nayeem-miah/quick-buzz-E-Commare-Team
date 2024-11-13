import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

import {

  RouterProvider,
} from "react-router-dom";
import router from './Routers/Router';
import AuthProvider from './Provider/AuthProvider';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
<<<<<<< HEAD
    <div className='bg-white text-black'>
     <AuthProvider>
     <RouterProvider router={router} />
     </AuthProvider>
    </div>
=======
    <QueryClientProvider client={queryClient}>
      <div className='bg-white text-black'>
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
>>>>>>> f0087dd2d2a1a2761ef0f33bb8a9080ea4922d03
  </StrictMode>,
)


