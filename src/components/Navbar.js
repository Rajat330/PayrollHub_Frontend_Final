
import { Link, NavLink } from "react-router-dom";

function Navbar() {
 const links = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/#features" },
  { name: "How It Works", path: "/#how-it-works" },
  { name: "About Us", path: "/#about" },
  { name: "Contact", path: "/#contact" },
];
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-2xl font-black text-white">
            ₹
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              PayrollHub
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">
              People. Payroll. Simplicity.
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm font-medium transition ${
                  isActive
                    ? "text-indigo-700"
                    : "text-slate-600 hover:text-indigo-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/login"
            className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:px-4"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 sm:px-5"
          >
            Get Started <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
