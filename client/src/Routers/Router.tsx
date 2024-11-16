
import {
    createBrowserRouter,
} from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Product from "../Pages/Product/Product";
import Dashboard from "../Pages/Dashboard/Dashboard";
import AdminHome from "../Components/Dashboard/Admin/AdminHome";
import ManageUsers from "../Components/Dashboard/Admin/ManageUsers";
import ErrorPage from "./ErrorPage";
import Signin from "../Pages/Page/Login";
import Signup from "../Pages/Page/Singup";
import PrivateRoute from "./PribetRoute";
import Profile from "../Pages/DashboardPage/Profile";
import HostAddProduct from "../Components/Dashboard/Host/HostAddProduct";
import HostHome from "../Components/Dashboard/Host/HostHome";
import MyAddedProduct from "../Components/Dashboard/Host/MyAddedProduct";
import ManageBooking from "../Components/Dashboard/Host/ManageBooking";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <ErrorPage />,
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
            },
           
        ]
    },
    { path: '/login', element: <Signin /> },
    { path: '/signup', element: <Signup /> },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <Dashboard />
        </PrivateRoute>,
        children: [
           {
              path:'profile',
              element:<Profile></Profile>

           },
            {
                path: 'adminHome',
                element: <AdminHome />
            },
            {
                path: 'manageUsers',
                element: <ManageUsers />
            },
            // host dashboard
            {
                path: 'hostHome',
                element: <HostHome />
            },
            {
                path: 'hostAddProduct',
                element: <HostAddProduct />
            },
            {
                path: 'my-host-listings',
                element: <MyAddedProduct />
            },
            {
                path: 'host-manageBooking',
                element: <ManageBooking />
            },


        ]
    }
]);
export default router;