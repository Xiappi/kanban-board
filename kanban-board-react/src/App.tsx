// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";

export default function AppLayout() {
  return (
    <div className="app">
      <Header />
      <main>
        <Outlet /> {/* children render here */}
      </main>
      <Footer />
    </div>
  );
}
