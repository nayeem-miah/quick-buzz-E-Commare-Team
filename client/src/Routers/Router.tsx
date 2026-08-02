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
import RoleProtectedRoute from "./RoleProtectedRoute";
import Profile from "../Pages/DashboardPage/Profile";
import HostAddProduct from "../Components/Dashboard/Host/HostAddProduct";
import MyAddedProduct from "../Components/Dashboard/Host/MyAddedProduct";
import AdminManageBookings from "../Components/Dashboard/Admin/AdminManageBookings";
import AdminManageCategories from "../Components/Dashboard/Admin/AdminManageCategories";
import AllPaymentHistory from "../Components/Dashboard/Admin/AllPaymentHistory";
import AdminManageOrders from "../Components/Dashboard/Admin/AdminManageOrders";
import AdminOrderDetails from "../Components/Dashboard/Admin/AdminOrderDetails";
import MyAddedCart from "../Components/Dashboard/User/MyAddedCart";
import UserPaymentHistory from "../Components/Dashboard/User/UserPaymentHistory";
import ProductPage from "../Pages/Product/ProductDetailsPage";
import UpdateProduct from "../Components/Dashboard/Host/UpdateProduct/UpdateProduct";
import BecomeAHost from "../Pages/Become a host/BecomeAHost";
import SellerRequest from "../Components/Dashboard/User/SellerRequest";
import AllHostRequest from "../Components/Dashboard/Admin/AllHostRequest";
import Fail from "../Components/SSLCommarze/Fail";
import Cancel from "../Components/SSLCommarze/Cancel";
import Success from "../Components/SSLCommarze/Success";
import SellerDataUpdated from "../Components/Dashboard/User/SellerDataUpdated/SellerDataUpdated";
import RoleBasedDashboard from "../Components/Dashboard/RoleBasedDashboard/RoleBasedDashboard";
import HostHome from "../Components/Dashboard/Host/HostHome";
import HostOrders from "../Components/Dashboard/Host/HostOrders";
import { API_BASE_URL } from "../utils/api";
import Checkout from "../Pages/Checkout/Checkout";
import MyOrders from "../Components/Dashboard/User/MyOrders";
import OrderDetails from "../Components/Dashboard/User/OrderDetails";

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
        loader: () => fetch(`${API_BASE_URL}/productsCount`)
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
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Signin /> },
  { path: "/signup", element: <Signup /> },
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
        element: (
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "manage-bookings",
        element: (
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminManageBookings />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "manage-categories",
        element: (
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminManageCategories />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "all-payment-history",
        element: (
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AllPaymentHistory />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "manage-orders",
        element: (
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminManageOrders />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "admin-order/:id",
        element: (
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminOrderDetails />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "all-host-request",
        element: (
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AllHostRequest />
          </RoleProtectedRoute>
        ),
      },
      // Host routes
      {
        path: "host-add-product",
        element: (
          <RoleProtectedRoute allowedRoles={["Host"]}>
            <HostAddProduct />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "overview",
        element: (
          <RoleProtectedRoute allowedRoles={["Host"]}>
            <HostHome />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "my-host-listings",
        element: (
          <RoleProtectedRoute allowedRoles={["Host"]}>
            <MyAddedProduct />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "host-orders",
        element: (
          <RoleProtectedRoute allowedRoles={["Host"]}>
            <HostOrders />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "update-product/:id",
        element: (
          <RoleProtectedRoute allowedRoles={["Host"]}>
            <UpdateProduct />
          </RoleProtectedRoute>
        ),
      },
      // User routes
      {
        path: "my-listings",
        element: (
          <RoleProtectedRoute allowedRoles={["user"]}>
            <MyAddedCart />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "seller-request",
        element: (
          <RoleProtectedRoute allowedRoles={["user"]}>
            <SellerRequest />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "my-payment-history",
        element: (
          <RoleProtectedRoute allowedRoles={["user"]}>
            <UserPaymentHistory />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "my-orders",
        element: (
          <RoleProtectedRoute allowedRoles={["user"]}>
            <MyOrders />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "order/:id",
        element: (
          <RoleProtectedRoute allowedRoles={["user"]}>
            <OrderDetails />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
]);
export default router;
