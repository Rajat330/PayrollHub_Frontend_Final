
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { icon: "▦", label: "Dashboard", path: "/admin-dashboard" },
  { icon: "♙", label: "Employees", path: "/admin-employees" },
  { icon: "◷", label: "Attendance", path: "/admin-attendance" },
  { icon: "▤", label: "Leave Requests", path: "/admin-leaves" },
  { icon: "₹", label: "Payroll", path: "/admin-payroll" },
  { icon: "▣", label: "Salary Slips", path: "/admin-salary-slips" },
  { icon: "▥", label: "Reports", path: "/admin-reports" },
  { icon: "⚙", label: "Settings", path: "/admin-settings" },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-[#f5f7fb] md:flex">
      <aside className="flex w-full flex-col bg-[#101a35] text-white md:fixed md:inset-y-0 md:w-64">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-xl font-bold">
            P
          </div>
          <div>
            <h2 className="text-lg font-bold">PayrollHub</h2>
            <p className="text-xs text-slate-400">Admin Workspace</p>
          </div>
        </div>

        <p className="px-6 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
          Workspace
        </p>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                  active
                    ? "bg-blue-600 font-semibold text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="m-4 mt-auto hidden rounded-2xl border border-white/10 bg-white/5 p-4 md:block">
          <p className="text-sm font-semibold">PayrollHub Support</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Manage your workforce from one place.
          </p>
        </div>
                <button
          onClick={handleLogout}
          className="mx-4 mb-5 flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
        >
          <span>↪</span>
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
