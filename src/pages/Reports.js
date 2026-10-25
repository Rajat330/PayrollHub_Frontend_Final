import { useState } from "react";

const API_URL = "http://localhost:5000";

function downloadCSV(filename, headers, rows) {
  const escapeCSV = (value) => {
    const text = value == null ? "" : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function Reports() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  async function downloadReport(type) {
    setLoading(true);
    setMessage("");

    try {
      let endpoint = "";
      let filename = "";
      let headers = [];
      let rows = [];

      if (type === "employees") {
        endpoint = "/api/get-user";
        filename = "employees-report.csv";
      } else if (type === "attendance") {
        endpoint = "/api/admin-attendance";
        filename = "attendance-report.csv";
      } else if (type === "leaves") {
        endpoint = "/api/admin-leaves";
        filename = "leave-report.csv";
      } else if (type === "payroll") {
        endpoint = "/api/admin/payroll";
        filename = "payroll-report.csv";
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        throw new Error(`Request failed (${response.status}).`);
      }

      if (!contentType.includes("application/json")) {
        throw new Error(
          "API returned a non-JSON response. Check the endpoint URL."
        );
      }

      const result = await response.json();

      if (type === "employees") {
        const data = Array.isArray(result)
          ? result
          : result.users || result.data || [];

        headers = [
          "Name",
          "Email",
          "Role",
          "Department",
          "Designation",
          "Status",
        ];

        rows = data.map((employee) => [
          employee.name || employee.fullName || "",
          employee.email || "",
          employee.role || "",
          employee.department || "",
          employee.designation || "",
          employee.status || "",
        ]);
      } else if (type === "attendance") {
        const data = Array.isArray(result)
          ? result
          : result.attendance || result.data || [];

        headers = [
          "Employee",
          "Date",
          "Status",
          "Check In",
          "Check Out",
        ];

        rows = data.map((item) => [
          item.employeeName || item.employee?.name || "",
          item.date || "",
          item.status || "",
          item.checkIn || "",
          item.checkOut || "",
        ]);
      } else if (type === "leaves") {
        const data = Array.isArray(result)
          ? result
          : result.leaves || result.data || [];

        headers = [
          "Employee",
          "Leave Type",
          "Start Date",
          "End Date",
          "Reason",
          "Status",
        ];

        rows = data.map((item) => [
          item.employeeName || item.employee?.name || "",
          item.leaveType || item.type || "",
          item.startDate || "",
          item.endDate || "",
          item.reason || "",
          item.status || "",
        ]);
      } else if (type === "payroll") {
        const data = Array.isArray(result)
          ? result
          : result.payroll || result.data || [];

        headers = [
          "Employee",
          "Month",
          "Basic Salary",
          "Allowances",
          "Deductions",
          "Net Salary",
          "Status",
        ];

        rows = data.map((item) => [
          item.employeeName || item.employeeId?.name || "",
          item.month || "",
          item.basicSalary ?? item.basic ?? "",
          item.allowances ?? "",
          item.deductions ?? "",
          item.netSalary ?? item.salary ?? "",
          item.status || "",
        ]);
      }

      if (rows.length === 0) {
        setMessage(
          "API connected, but no records were found or the response format is different."
        );
        return;
      }

      downloadCSV(filename, headers, rows);
      setMessage(`${filename} downloaded successfully.`);
    } catch (error) {
      setMessage(error.message || "Could not download the report.");
    } finally {
      setLoading(false);
    }
  }

  const reportCards = [
    {
      type: "employees",
      title: "Employee Report",
      description: "Employee names, email, role and job details.",
      icon: "👥",
    },
    {
      type: "attendance",
      title: "Attendance Report",
      description: "Attendance dates, status and check-in/out details.",
      icon: "🕒",
    },
    {
      type: "leaves",
      title: "Leave Report",
      description: "Employee leave applications and their statuses.",
      icon: "📅",
    },
    {
      type: "payroll",
      title: "Payroll Report",
      description: "Salary, deductions, allowances and payroll status.",
      icon: "₹",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            PayrollHub / Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Reports & Downloads
          </h1>

          <p className="mt-2 text-slate-500">
            Download employee, attendance, leave and payroll reports as CSV
            files that open in Excel.
          </p>
        </div>

        {message && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
          >
            {message}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {reportCards.map((report) => (
            <div
              key={report.type}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                {report.icon}
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                {report.title}
              </h2>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                {report.description}
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={() => downloadReport(report.type)}
                className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Please wait..." : "⬇ Download CSV"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="font-bold text-blue-950">Important</h2>
          <p className="mt-2 text-sm leading-6 text-blue-900">
            These downloads depend on your backend API routes and response
            fields. The employee endpoint is taken from your existing project;
            the attendance and leave endpoints must match your actual backend.
            If an endpoint differs, share its route file so it can be corrected.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Reports;