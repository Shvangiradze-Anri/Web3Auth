import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import AdminDashboard from "./pages/adminDashboard.tsx";
import MetaMaskLoginPage from "./pages/login.tsx";
import ProtectedRoute from "./components/protectedRoutes.tsx";
import NotFound from "./components/notFound.tsx";
import Profile from "./pages/profile.tsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<MetaMaskLoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute role={["Verified", "Admin", "Premium"]}>
            <App />
          </ProtectedRoute>
        }
      >
        <Route index element={<Profile />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={["Admin", "Premium"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  )
);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
