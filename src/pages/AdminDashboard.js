
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [presentToday, setPresentToday] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  
useEffect(() => {
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again.");
      setLoading(false);
      setStatsLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const today = new Date();
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    try {
      // Fetch employee directory
      const employeeResponse = await fetch(
        "https://payrollhub-backend-final.onrender.com/api/get-user",
        { headers }
      );

      const employeeData = await employeeResponse.json();

      if (!employeeResponse.ok) {
        throw new Error(
          employeeData.message || "Could not load employees"
        );
      }

      const employeeList =
        employeeData.users || employeeData.data || [];

      setEmployees(employeeList);

      // Fetch today's attendance
      const attendanceResponse = await fetch(
        `https://payrollhub-backend-final.onrender.com/api/admin/attendance?date=${date}`,
        { headers }
      );

      const attendanceData = await attendanceResponse.json();

      if (!attendanceResponse.ok) {
        throw new Error(
          attendanceData.message || "Could not load attendance"
        );
      }

      const attendanceRecords = attendanceData.records || [];

      const presentCount = attendanceRecords.filter(
        (record) =>
          record.status === "Present" ||
          record.status === "Late"
      ).length;

      setPresentToday(presentCount);

      // Fetch pending leave requests
      const leaveResponse = await fetch(
        "https://payrollhub-backend-final.onrender.com/api/admin/leaves?status=Pending",
        { headers }
      );

      const leaveData = await leaveResponse.json();

      if (!leaveResponse.ok) {
        throw new Error(
          leaveData.message || "Could not load leave requests"
        );
      }

      setPendingLeaves(
        Array.isArray(leaveData.leaves)
          ? leaveData.leaves.length
          : 0
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  fetchDashboardData();
}, []);


  const admin = JSON.parse(localStorage.getItem("user") || "null");

  const registeredEmployees = employees.filter(
    (employee) => employee.role !== "admin"
  );

  const filteredEmployees = registeredEmployees.filter((employee) =>
    `${employee.name || ""} ${employee.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const adminCount = employees.filter(
    (employee) => employee.role === "admin"
  ).length;

  const employeeCount = registeredEmployees.length;

  const stats = [
    {
      label: "Total Employees",
      value: loading ? "..." : employeeCount,
      icon: "♙",
      color: "bg-blue-50 text-blue-600",
      note: "Registered workforce",
    },
    
{
  label: "Present Today",
  value: statsLoading ? "..." : presentToday,
  icon: "✓",
  color: "bg-emerald-50 text-emerald-600",
  note: "Employees present or late today",
},
{
  label: "Pending Leaves",
  value: statsLoading ? "..." : pendingLeaves,
  icon: "◷",
  color: "bg-amber-50 text-amber-600",
  note: "Awaiting approval",
},

    {
      label: "Payroll Status",
      value: "Ready",
      icon: "₹",
      color: "bg-violet-50 text-violet-600",
      note: "Payroll module preview",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Page Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Admin Workspace
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Here's what's happening with your workforce today.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">
              {(admin?.name || "A").charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold">
                {admin?.name || "Administrator"}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </header>

        {/* Statistics Cards */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>

                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${card.color}`}
                >
                  {card.icon}
                </span>
              </div>

              <p className="mt-4 text-3xl font-bold tracking-tight">
                {card.value}
              </p>

              <p className="mt-2 text-xs text-slate-400">{card.note}</p>
            </div>
          ))}
        </section>

        {/* Overview and Workforce Snapshot */}
        <section className="mb-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl bg-gradient-to-br from-[#14264c] to-blue-700 p-6 text-white shadow-lg">
            <p className="text-sm font-medium text-blue-100">
              PAYROLLHUB OVERVIEW
            </p>

            <h2 className="mt-4 max-w-lg text-2xl font-bold sm:text-3xl">
              Manage your workforce with confidence.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100">
              Keep employee information organised and access your workforce
              directory from one workspace.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/admin-employees";
              }}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50"
            >
              View Employees →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold">Workforce Snapshot</h2>

            <p className="mt-1 text-sm text-slate-500">
              Current registered account breakdown
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Employees</span>
                  <span className="font-semibold">
                    {loading ? "..." : employeeCount}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${
                        employees.length
                          ? (employeeCount / employees.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Admin accounts</span>
                  <span className="font-semibold">
                    {loading ? "..." : adminCount}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all"
                    style={{
                      width: `${
                        employees.length
                          ? (adminCount / employees.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Employee Directory */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-bold">Employee Directory</h2>
              <p className="mt-1 text-sm text-slate-500">
                Registered accounts in PayrollHub
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {loading ? "Loading..." : `${employeeCount} employees`}
            </span>
          </div>

          <div className="p-5 sm:p-6">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by employee name or email..."
              className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:max-w-md"
            />

            {loading ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Loading employees...
              </p>
            ) : error ? (
              <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                {error}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <th className="rounded-l-lg px-4 py-4 font-semibold">
                        Employee
                      </th>
                      <th className="px-4 py-4 font-semibold">Email</th>
                      <th className="px-4 py-4 font-semibold">Phone</th>
                      <th className="px-4 py-4 font-semibold">Role</th>
                      <th className="rounded-r-lg px-4 py-4 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-10 text-center text-slate-500"
                        >
                          {search
                            ? "No matching employees found."
                            : "No employees registered yet."}
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <tr
                          key={employee._id || employee.id}
                          className="border-t border-slate-100 transition hover:bg-slate-50/80"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">
                                {(employee.name || "E")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <span className="font-semibold text-slate-800">
                                {employee.name || "—"}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-slate-500">
                            {employee.email}
                          </td>

                          <td className="px-4 py-4 text-slate-500">
                            {employee.phone || "—"}
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              {employee.role || "employee"}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Registered
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          PayrollHub Admin Workspace · Dashboard
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
