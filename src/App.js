
import { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { EmployeeProvider } from "./context/EmployeeContext";

// Lazy-loaded components
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const EmployeeDashboard = lazy(
  () => import("./pages/EmployeeDashboard")
);

const Employees = lazy(() => import("./pages/Employees"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Leave = lazy(() => import("./pages/Leave"));
const SalarySlips = lazy(() => import("./pages/SalarySlips"));
const Payroll = lazy(() => import("./pages/Payroll"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));

// Loading component
function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
        <p className="mt-4 text-sm font-medium text-gray-600">
          Loading PayrollHub...
        </p>
      </div>
    </div>
  );
}

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
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin routes */}
            <Route
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/admin-dashboard"
                element={<AdminDashboard />}
              />
              <Route
                path="/admin-employees"
                element={<Employees />}
              />
              <Route
                path="/admin-attendance"
                element={<Attendance />}
              />
              <Route
                path="/admin-leaves"
                element={<Leave />}
              />
              <Route
                path="/admin-payroll"
                element={<Payroll />}
              />
              <Route
                path="/admin-salary-slips"
                element={<SalarySlips />}
              />
              <Route
                path="/admin-reports"
                element={<Reports />}
              />
              <Route
                path="/admin-settings"
                element={<Settings />}
              />
            </Route>

            {/* Employee route */}
            <Route
              path="/employee-dashboard"
              element={
                <ProtectedRoute allowedRole="employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
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
