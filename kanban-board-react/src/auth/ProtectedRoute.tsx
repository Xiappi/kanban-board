import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProtectedRoute() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  // If auth check finished and no user: bounce to login
  if (!authLoading && (user === undefined || user === null)) {
    return <Navigate to="/login" replace />;
  }

  // Layout wrapper stays rendered so spinner can overlay it
  return (
    <div className="app min-h-screen flex flex-col items-center bg-gray-100 relative">
      <Header />
      <main
        key={location.pathname}
        className="max-w-7xl w-full flex-grow animate-fadeIn transition-opacity duration-300"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
