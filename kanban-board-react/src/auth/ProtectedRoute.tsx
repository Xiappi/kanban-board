// src/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="p-6">Checking your session…</div>;
  }

  if (user === undefined || user === null) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div className="app flex flex-col min-h-screen ">
        <Header />
        <main className="mx-auto max-w-7xl flex-grow">
          <Outlet /> {/* children render here */}
        </main>
        <Footer />
      </div>
    </>
  );
}
