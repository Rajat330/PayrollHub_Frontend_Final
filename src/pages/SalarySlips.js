
import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000";

function SalarySlips() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);

  const fetchSlips = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (month) params.set("month", month);
      if (status) params.set("status", status);

      const response = await fetch(`${API_URL}/api/admin/payroll?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("The server returned HTML instead of JSON. Check that the backend is running on port 5000.");
      }
      if (!response.ok) throw new Error(data.message || "Could not load salary slips.");
      setRecords(Array.isArray(data.payroll) ? data.payroll : Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load salary slips.");
    } finally {
      setLoading(false);
    }
  }, [month, status]);

  useEffect(() => {
    fetchSlips();
  }, [fetchSlips]);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return records;
    return records.filter((item) => {
      const employee = item.employeeId || {};
      return [employee.name, employee.email, item.month, item.status]
        .some((value) => String(value || "").toLowerCase().includes(term));
    });
  }, [records, search]);

  const currency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  const monthLabel = (value) => {
    if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return value || "—";
    const [year, monthNumber] = value.split("-");
    return new Date(Number(year), Number(monthNumber) - 1, 1).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  const printSlip = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #admin-salary-slip, #admin-salary-slip * { visibility: visible !important; }
          #admin-salary-slip { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">PayrollHub / Administration</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Salary Slips</h1>
            <p className="mt-2 text-sm text-slate-500">Find payroll records and view or print employee salary slips.</p>
          </div>
          <button onClick={fetchSlips} type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100">
            ↻ Refresh records
          </button>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Matching Records</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{filteredRecords.length}</p>
            <p className="mt-1 text-xs text-slate-400">Based on current filters</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Paid Records</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{filteredRecords.filter((item) => item.status === "Paid").length}</p>
            <p className="mt-1 text-xs text-slate-400">Ready for employee distribution</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
            <p className="text-sm font-medium text-slate-500">Net Salary Total</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {currency(filteredRecords.reduce((sum, item) => sum + Number(item.netSalary || 0), 0))}
            </p>
            <p className="mt-1 text-xs text-slate-400">For the displayed records</p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_180px]">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employee, email or month..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} aria-label="Filter by month" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
              <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by payment status" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500">
                <option value="">All statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {error && <div className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading salary slips...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">▤</div>
              <h2 className="mt-4 font-semibold text-slate-900">No salary records found</h2>
              <p className="mt-1 text-sm text-slate-500">Try another month or status, or create payroll first.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    {["Employee", "Pay Period", "Net Salary", "Status", "Salary Slip"].map((heading) => (
                      <th key={heading} className="whitespace-nowrap px-5 py-4 font-semibold">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((item) => (
                    <tr key={item._id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{item.employeeId?.name || "Employee"}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.employeeId?.email || "—"}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">{monthLabel(item.month)}</td>
                      <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900">{currency(item.netSalary)}</td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.status || "Pending"}</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <button type="button" onClick={() => setSelectedSlip(item)} className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700">
                          View / Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 sm:p-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="no-print mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">PayrollHub</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Salary Slip</h2>
              </div>
              <button type="button" onClick={() => setSelectedSlip(null)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Close</button>
            </div>

            <div id="admin-salary-slip" className="border border-slate-200 p-5 sm:p-8">
              <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold text-slate-950">PayrollHub</h1>
                <p className="mt-1 text-sm text-slate-500">Employee Salary Slip</p>
                <p className="mt-4 text-lg font-bold text-slate-900">{monthLabel(selectedSlip.month)}</p>
              </div>
              <div className="grid gap-4 border-b border-slate-200 py-5 sm:grid-cols-2">
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Employee Name</p><p className="mt-1 font-semibold text-slate-900">{selectedSlip.employeeId?.name || "Employee"}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Email</p><p className="mt-1 break-words font-semibold text-slate-900">{selectedSlip.employeeId?.email || "—"}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Payment Status</p><p className="mt-1 font-semibold text-slate-900">{selectedSlip.status || "Pending"}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Paid Date</p><p className="mt-1 font-semibold text-slate-900">{selectedSlip.paidAt ? new Date(selectedSlip.paidAt).toLocaleDateString("en-IN") : "Not paid yet"}</p></div>
              </div>
              <div className="py-5">
                {[
                  ["Basic Salary", selectedSlip.basicSalary],
                  ["Allowances", selectedSlip.allowances],
                  ["Gross Salary", selectedSlip.grossSalary],
                  ["Deductions", -Number(selectedSlip.deductions || 0)],
                ].map(([label, amount]) => (
                  <div key={label} className="flex justify-between border-b border-slate-100 py-3 text-sm">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-medium text-slate-900">{label === "Deductions" ? "− " : ""}{currency(Math.abs(Number(amount || 0)))}</span>
                  </div>
                ))}
                <div className="mt-3 flex justify-between rounded-xl bg-blue-50 px-4 py-4">
                  <span className="font-bold text-blue-950">Net Salary</span>
                  <span className="text-xl font-bold text-blue-950">{currency(selectedSlip.netSalary)}</span>
                </div>
              </div>
              <p className="mt-5 text-xs text-slate-400">Generated by PayrollHub.</p>
            </div>

            <div className="no-print mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedSlip(null)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button>
              <button type="button" onClick={printSlip} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Print / Save PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalarySlips;
