import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import router from "./Routers/Router";
import AuthProvider from "./Provider/AuthProvider";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className=" bg-white text-black font-sans">
        <AuthProvider>
          <HelmetProvider>
            <div className="max-w-screen-xl mx-auto">
              <RouterProvider router={router} />
            </div>
            <Toaster></Toaster>
          </HelmetProvider>
        </AuthProvider>
      </div>
    </QueryClientProvider>
  </StrictMode>
);
