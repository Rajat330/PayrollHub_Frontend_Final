
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // JavaScript validation
  const validateForm = () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      return "Email address is required.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Password is required.";
    }

    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (data.user.role === "employee") {
        navigate("/employee-dashboard", { replace: true });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw new Error("Unknown user role");
      }
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <div className="flex flex-col justify-center bg-gradient-to-br from-slate-950 to-blue-900 p-10 text-white md:p-14">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold">
              ₹
            </div>
            <div>
              <h1 className="text-2xl font-black">PayrollHub</h1>
              <p className="text-sm text-blue-300">Payroll Management</p>
            </div>
          </div>

          <h2 className="text-4xl font-black leading-tight">
            Welcome Back!
            <span className="mt-2 block text-blue-400">
              Manage payroll smarter.
            </span>
          </h2>

          <p className="mt-6 leading-7 text-slate-300">
            Sign in to manage employees, track attendance and access your
            payroll dashboard.
          </p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm leading-6 text-slate-300">
              “Simplifying payroll, empowering businesses.”
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-12">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Welcome Back
          </p>

          <h2 className="mt-3 text-3xl font-black text-slate-900">
            Login to your account
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Enter your details to continue.
          </p>

          <form
            onSubmit={handleLogin}
            noValidate
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="login-email"
                type="text"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Password
              </label>

              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="text-right">
              <button
                type="button"
                onClick={() => alert("Forgot password will be added later.")}
                className="text-sm font-bold text-blue-600 hover:text-blue-800"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:text-blue-800"
            >
              Create Account
            </Link>
          </p>

          <Link
            to="/"
            className="mt-5 text-center text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
