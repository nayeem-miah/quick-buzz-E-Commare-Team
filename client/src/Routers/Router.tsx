import React from "react";
import {
    createBrowserRouter,
} from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Product from "../Pages/Product/Product";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: '/',
                element: <Home />
            },

            {
                path: '/about',
                element: <About />
            },
            {
                path: '/contact',
                element: <Contact />
            },
            {
                path: "/product",
                element: <Product />
            }
        ]
    },
]);
export default router;