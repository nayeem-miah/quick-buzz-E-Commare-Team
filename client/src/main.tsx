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
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className='bg-white text-black'>
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  </StrictMode>,
)


