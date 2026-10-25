
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import { EmployeeProvider } from "./context/EmployeeContext";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import SalarySlips from "./pages/SalarySlips";
import ProtectedRoute from "./ProtectedRoute";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function PageContent() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const timeout = setTimeout(() => {
        document
          .getElementById(location.hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      return () => clearTimeout(timeout);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.hash]);

  const isDashboard =
    location.pathname.startsWith("/admin-") ||
    location.pathname === "/employee-dashboard";

  return (
    <div className="flex min-h-screen flex-col">
      {!isDashboard && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-employees" element={<Employees />} />
            <Route path="/admin-attendance" element={<Attendance />} />
            <Route path="/admin-leaves" element={<Leave />} />
            <Route path="/admin-payroll" element={<Payroll />} />
            <Route path="/admin-salary-slips" element={<SalarySlips />} />
            <Route path="/admin-reports" element={<Reports />} />
            <Route path="/admin-settings" element={<Settings />} />
          </Route>

          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <EmployeeProvider>
      <BrowserRouter>
        <PageContent />
      </BrowserRouter>
    </EmployeeProvider>
  );
}

export default App;
