import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import {
  createBrowserRouter,
  Router,
  RouterProvider,
} from "react-router-dom";
import router from './Routers/router';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
