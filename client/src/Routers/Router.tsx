import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Product from "../Pages/Product/Product";
import DashboardLayout from "../Layouts/Dashboard/DashboardLayout";
import ManageUsers from "../Components/Dashboard/Admin/ManageUsers";
import ErrorPage from "./ErrorPage";
import Signin from "../Pages/Login-signup/Login";
import Signup from "../Pages/Login-signup/Singup";
import PrivateRoute from "./PribetRoute";
import Profile from "../Pages/DashboardPage/Profile";
import HostAddProduct from "../Components/Dashboard/Host/HostAddProduct";
import MyAddedProduct from "../Components/Dashboard/Host/MyAddedProduct";
import ManageBooking from "../Components/Dashboard/Host/ManageBooking";
import AdminManageBookings from "../Components/Dashboard/Admin/AdminManageBookings";
import AllPaymentHistory from "../Components/Dashboard/Admin/AllPaymentHistory";
import MyAddedCart from "../Components/Dashboard/User/MyAddedCart";
import UserPaymentHistory from "../Components/Dashboard/User/UserPaymentHistory";
import ProductPage from "../Pages/Product/ProductDetailsPage";
import UpdateProduct from "../Components/Dashboard/Host/UpdateProduct/UpdateProduct";
import BecomeAHost from "../Pages/Become a host/BecomeAHost";
import SellerRequest from "../Components/Dashboard/User/SellerRequest";
import AllHostRequest from "../Components/Dashboard/Admin/AllHostRequest";
import UpdateProfile from "../Pages/Dashboard/UpdateProfile";
import Fail from "../Components/SSLCommarze/Fail";
import Cancel from "../Components/SSLCommarze/Cancel";
import Success from "../Components/SSLCommarze/Success";
import SellerDataUpdated from "../Components/Dashboard/User/SellerDataUpdated/SellerDataUpdated";
import RoleBasedDashboard from "../Components/Dashboard/RoleBasedDashboard/RoleBasedDashboard";
import HostHome from "../Components/Dashboard/Host/HostHome";
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
        loader: () => fetch('https://quick-bazz.vercel.app/productsCount')
    },
      {
        path: "/product/:id",
        element: (
          // <PrivateRoute>
          <ProductPage></ProductPage>
          // </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: <Profile></Profile>,
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
        path: "/updated-seller/:id",
        element: (
          <PrivateRoute>
            <SellerDataUpdated></SellerDataUpdated>
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
  // fail success and cancel
  {
    path: "/success",
    element: (
      <PrivateRoute>
        <Success />
      </PrivateRoute>
    ),
  },
  {
    path: "/cancel",
    element: (
      <PrivateRoute>
        <Cancel />
      </PrivateRoute>
    ),
  },
  {
    path: "/fail",
    element: (
      <PrivateRoute>
        <Fail />
      </PrivateRoute>
    ),
  },
  {
    path: "edit-profile",
    element: <UpdateProfile></UpdateProfile>,
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
      // Dynamic role-based index
      {
        index: true,
        element: <RoleBasedDashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      // Admin routes
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
      // Host routes
      {
        path: "host-add-product",
        element: <HostAddProduct />,
      },
      {
        path: "overview",
        element: <HostHome />,
      },
      {
        path: "my-host-listings",
        element: <MyAddedProduct />,
      },
      {
        path: "host-manage-booking",
        element: <ManageBooking />,
      },
      // User routes
      {
        path: "my-listings",
        element: <MyAddedCart />,
      },
      {
        path: "seller-request",
        element: (
          <SellerRequest
            sellerData={{
              _id: "",
              sellerName: "",
              sellerEmail: "",
              sellerPhoto: "",
              mobile: "",
              reason: "",
              address: "",
              other: "",
              imageUrl: "",
            }}
          />
        ),
      },
      {
        path: "my-payment-history",
        element: <UserPaymentHistory />,
      },
    ],
  },
]);
export default router;
