import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/Error.tsx";
import HomePage from "./pages/Home.tsx";
import LoginPage from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import SettingsPage from "./pages/Settings.tsx";

// Create the router in "data mode"
const router = createBrowserRouter([
  // routes that SHOULD NOT show header/footer
  {
    path: "/login",
    errorElement: <ErrorPage />,
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: "/",
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
