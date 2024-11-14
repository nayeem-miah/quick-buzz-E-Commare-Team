import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import { RouterProvider } from "react-router-dom";
import router from "./Routers/Router";
import AuthProvider from "./Provider/AuthProvider";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="bg-white text-black">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </div>
    </QueryClientProvider>
  </StrictMode>
);
