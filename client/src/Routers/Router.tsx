import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Product from "../Pages/Product/Product";
import DashboardLayout from "../Layouts/Dashboard/DashboardLayout";
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
import AdminManageBookings from "../Components/Dashboard/Admin/AdminManageBookings";
import AllPaymentHistory from "../Components/Dashboard/Admin/AllPaymentHistory";
import UserHome from "../Components/Dashboard/User/UserHome";
import MyAddedCart from "../Components/Dashboard/User/MyAddedCart";
import UserPaymentHistory from "../Components/Dashboard/User/UserPaymentHistory";
import ProductPage from "../Pages/Product/ProductDetailsPage";
import UpdateProduct from "../Components/Dashboard/Host/UpdateProduct/UpdateProduct";
import Checkout from "../Pages/Product/Checkout";
import MyWishList from "../Components/Dashboard/User/MyWishList";
import BecomeAHost from "../Pages/Become a host/BecomeAHost";
import SellerRequest from "../Components/Dashboard/User/SellerRequest";
import AllHostRequest from "../Components/Dashboard/Admin/AllHostRequest";
import UpdateProfile from "../Pages/Dashboard/UpdateProfile";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/product/:id",
        element: <ProductPage></ProductPage>,
      },
      {
        path: "/profile",
        element: <Profile></Profile>,
      },
      {
        path: "/checkout/:id",
        element: <Checkout></Checkout>,
      },
      {
        path: "/updated-product/:id",
        element: (
          <PrivateRoute>
            <UpdateProduct></UpdateProduct>
          </PrivateRoute>
        ),
      },

      {
        path: "/become-host",
        element: (
          <PrivateRoute>
            <BecomeAHost />
          </PrivateRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Signin /> },
  { path: "/signup", element: <Signup /> },
  {
    path:':edit-profile',
    element:<UpdateProfile></UpdateProfile>
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "profile",
        element: <Profile></Profile>,
      },
     
      //   admin dashboard
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
      {
        path: "manage-bookings",
        element: <AdminManageBookings />,
      },
      {
        path: "all-payment-history",
        element: <AllPaymentHistory />,
      },
      {
        path: "all-host-request",
        element: <AllHostRequest />,
      },
      // host dashboard
      {
        index: true,
        element: <HostHome />,
      },
      {
        path: "host-add-product",
        element: <HostAddProduct />,
      },
      {
        path: "my-host-listings",
        element: <MyAddedProduct />,
      },
      {
        path: "host-manage-booking",
        element: <ManageBooking />,
      },
      // user dashboard route
      {
        index: true,
        element: <UserHome />,
      },
      {
        path: "my-listings",
        element: <MyAddedCart />,
      },
      {
        path: "my-wishlist",
        element: <MyWishList></MyWishList>,
      },
      {
        path: "seller-request",
        element: <SellerRequest />,
      },
      {
        path: "my-payment-history",
        element: <UserPaymentHistory />,
      },
    ],
  },
]);
export default router;
