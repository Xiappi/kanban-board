import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";

async function loginAction({ request }: any) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  // You could handle Firebase login here
  console.log("Logging in:", email, password);
  return { success: true };
}

async function dashboardLoader() {
  console.log("Dashboard loader called");
  return { success: true };
}

// Create the router in "data mode"
const router = createBrowserRouter([
  // routes that SHOULD NOT show header/footer
  {
    path: "/login",
    action: loginAction,
    errorElement: <ErrorPage />,
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardLoader, // for data fetching
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
