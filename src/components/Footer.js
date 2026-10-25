
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#070D1B] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">

        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-black shadow-lg shadow-blue-500/20">
              ₹
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                PayrollHub
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                Payroll Management
              </p>
            </div>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            Simplify employee management, attendance and payroll with one
            modern platform designed to make work easier.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Smarter workforce management
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
            Quick Links
          </h3>
          <div className="space-y-4 text-sm text-slate-400">
            <Link to="/" className="block transition hover:text-blue-400">Home</Link>
            <Link to="/about" className="block transition hover:text-blue-400">About Us</Link>
            <Link to="/contact" className="block transition hover:text-blue-400">Contact Us</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
            Your Account
          </h3>
          <div className="space-y-4 text-sm text-slate-400">
            <Link to="/login" className="block transition hover:text-blue-400">Login</Link>
            <Link to="/register" className="block transition hover:text-blue-400">Create Account</Link>
          </div>

          <Link
            to="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Get Started <span>→</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PayrollHub. All rights reserved.</p>
          <p>Built for simpler, smarter payroll management.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
