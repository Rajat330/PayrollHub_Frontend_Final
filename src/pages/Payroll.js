

import { useCallback, useEffect, useState } from "react";

const API = "http://localhost:5000";

const emptyForm = {
  employeeId: "",
  month: new Date().toISOString().slice(0, 7),
  basicSalary: "",
  allowances: "0",
  deductions: "0",
};

function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [editForm, setEditForm] = useState({
    basicSalary: "",
    allowances: "0",
    deductions: "0",
  });
  const [editSaving, setEditSaving] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams();
      if (monthFilter) query.set("month", monthFilter);
      if (statusFilter) query.set("status", statusFilter);

      const [payrollResponse, employeeResponse] = await Promise.all([
        fetch(`${API}/api/admin/payroll?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
       fetch(`${API}/api/admin/payroll/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const payrollData = await payrollResponse.json();
      const employeeData = await employeeResponse.json();

      if (!payrollResponse.ok) {
        throw new Error(payrollData.message || "Could not load payroll.");
      }

      if (!employeeResponse.ok) {
        throw new Error(
          employeeData.message || "Could not load employees."
        );
      }

      setPayroll(
        Array.isArray(payrollData)
          ? payrollData
          : Array.isArray(payrollData.payroll)
            ? payrollData.payroll
            : []
      );

      const employeeList = Array.isArray(employeeData)
        ? employeeData
        : employeeData.employees || employeeData.users || [];

      setEmployees(
        employeeList.filter((employee) => employee.role !== "admin")
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [token, monthFilter, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const basic = Number(form.basicSalary) || 0;
  const allowances = Number(form.allowances) || 0;
  const deductions = Number(form.deductions) || 0;
  const gross = basic + allowances;
  const net = gross - deductions;

 
const createPayroll = async (event) => {
  event.preventDefault();
  setError("");
  setMessage("");

  // Employee validation
  if (!form.employeeId) {
    setError("Please select an employee.");
    return;
  }

  // Salary month validation: YYYY-MM
  const validMonth =
    /^\d{4}-(0[1-9]|1[0-2])$/.test(form.month);

  if (!validMonth) {
    setError("Please select a valid salary month and year.");
    return;
  }

  // Basic salary validation
  if (
    form.basicSalary.trim() === "" ||
    !Number.isFinite(Number(form.basicSalary)) ||
    Number(form.basicSalary) < 0
  ) {
    setError("Please enter a valid basic salary (zero or more).");
    return;
  }

  // Allowances validation
  if (
    form.allowances.trim() === "" ||
    !Number.isFinite(Number(form.allowances)) ||
    Number(form.allowances) < 0
  ) {
    setError("Please enter valid allowances (zero or more).");
    return;
  }

  // Deductions validation
  if (
    form.deductions.trim() === "" ||
    !Number.isFinite(Number(form.deductions)) ||
    Number(form.deductions) < 0
  ) {
    setError("Please enter valid deductions (zero or more).");
    return;
  }

  const basic = Number(form.basicSalary);
  const allowances = Number(form.allowances);
  const deductions = Number(form.deductions);
  const gross = basic + allowances;

  if (deductions > gross) {
    setError("Deductions cannot exceed gross salary.");
    return;
  }

  setSaving(true);

  try {
    const response = await fetch(`${API}/api/admin/payroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        employeeId: form.employeeId,
        month: form.month,
        basicSalary: basic,
        allowances,
        deductions,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not create payroll.");
    }

    setMessage("Payroll created successfully!");
    setForm(emptyForm);
    await fetchData();
  } catch (err) {
    setError(err.message || "Could not create payroll.");
  } finally {
    setSaving(false);
  }
};


  const markAsPaid = async (id) => {
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API}/api/admin/payroll/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Paid" }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update payroll status.");
      }

      setMessage("Payroll marked as Paid.");
      await fetchData();
    } catch (err) {
      setError(err.message || "Could not update payroll status.");
    }
  };

  const openEditPayroll = (item) => {
    if (item.status === "Paid") {
      setError("Paid payroll records cannot be edited.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");
    setEditingPayroll(item);
    setEditForm({
      basicSalary: String(item.basicSalary ?? ""),
      allowances: String(item.allowances ?? 0),
      deductions: String(item.deductions ?? 0),
    });
  };

  const updateEditForm = (event) => {
    setEditForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const savePayrollEdit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const basicSalary = Number(editForm.basicSalary);
    const allowances = Number(editForm.allowances);
    const deductions = Number(editForm.deductions);
    const grossSalary = basicSalary + allowances;
    const netSalary = grossSalary - deductions;

    if (
      editForm.basicSalary === "" ||
      !Number.isFinite(basicSalary) ||
      !Number.isFinite(allowances) ||
      !Number.isFinite(deductions) ||
      basicSalary < 0 ||
      allowances < 0 ||
      deductions < 0 ||
      deductions > grossSalary
    ) {
      setError("Enter valid salary amounts. Deductions cannot exceed gross salary.");
      return;
    }

    setEditSaving(true);
    try {
      const response = await fetch(
        `${API}/api/admin/payroll/${editingPayroll._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            basicSalary,
            allowances,
            deductions,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not update payroll record.");
      }

      setMessage("Payroll record updated successfully.");
      setEditingPayroll(null);
      await fetchData();
    } catch (err) {
      setError(err.message || "Could not update payroll record.");
    } finally {
      setEditSaving(false);
    }
  };

  const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const totalPayroll = payroll.reduce(
    (sum, item) => sum + (Number(item.netSalary) || 0),
    0
  );

  const paidAmount = payroll
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + (Number(item.netSalary) || 0), 0);

  const pendingCount = payroll.filter(
    (item) => item.status === "Pending"
  ).length;
  
  const [selectedSlip, setSelectedSlip] = useState(null);

  const viewSalarySlip = (item) => {
    setSelectedSlip(item);
  };

  
const printSalarySlip = () => {
  document.body.classList.add("printing-salary-slip");
  window.print();
  document.body.classList.remove("printing-salary-slip");
};


  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Payroll Management
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Salary Overview
            </h1>
            <p className="mt-2 text-slate-500">
              Create salary records and manage monthly payroll.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-slate-500">Selected month</p>
            <p className="mt-1 font-bold text-indigo-700">
              {new Date(
                `${form.month}-01T12:00:00`
              ).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Net Payroll",
              value: money(totalPayroll),
              note: "Based on current records",
              icon: "₹",
              color: "bg-indigo-100 text-indigo-700",
            },
            {
              label: "Employees in Payroll",
              value: payroll.length,
              note: "Salary records shown",
              icon: "U",
              color: "bg-blue-100 text-blue-700",
            },
            {
              label: "Pending Payments",
              value: pendingCount,
              note: "Awaiting payment",
              icon: "◷",
              color: "bg-amber-100 text-amber-700",
            },
            {
              label: "Paid Amount",
              value: money(paidAmount),
              note: "Marked as paid",
              icon: "✓",
              color: "bg-emerald-100 text-emerald-700",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    {card.value}
                  </p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">{card.note}</p>
            </div>
          ))}
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Create Salary Record
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter employee salary details for one month.
            </p>
          </div>

          <form noValidate onSubmit={createPayroll} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <label className="text-sm font-medium text-slate-700">
              Employee
              <select
                name="employeeId"
                value={form.employeeId}
                onChange={updateForm}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name || employee.email}
                    {employee.department ? ` — ${employee.department}` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Salary Month
              <input
                type="month"
                name="month"
                value={form.month}
                onChange={updateForm}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Basic Salary (₹)
              <input
                type="number"
                name="basicSalary"
                min="0"
                step="0.01"
                value={form.basicSalary}
                onChange={updateForm}
                required
                placeholder="e.g. 25000"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Allowances (₹)
              <input
                type="number"
                name="allowances"
                min="0"
                step="0.01"
                value={form.allowances}
                onChange={updateForm}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Deductions (₹)
              <input
                type="number"
                name="deductions"
                min="0"
                step="0.01"
                value={form.deductions}
                onChange={updateForm}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </label>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Gross salary</span>
                <span className="font-semibold">{money(gross)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-slate-600">
                <span>Deductions</span>
                <span className="font-semibold">{money(deductions)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-slate-200 pt-3">
                <span className="font-semibold text-slate-900">Net salary</span>
                <span className="text-lg font-bold text-indigo-700">
                  {money(net)}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <button
                type="submit"
                disabled={saving || employees.length === 0}
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create Payroll"}
              </button>
              {employees.length === 0 && (
                <p className="mt-2 text-sm text-amber-700">
                  No employees loaded. Check the employee API endpoint.
                </p>
              )}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:p-7">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Payroll Records
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review salary records and payment status.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="month"
                value={monthFilter}
                onChange={(event) => setMonthFilter(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                aria-label="Filter by month"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                aria-label="Filter by payment status"
              >
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="p-8 text-center text-slate-500">Loading payroll...</p>
          ) : payroll.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                ₹
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                No payroll records found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Create a salary record using the form above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Month</th>
                    <th className="px-6 py-4">Basic Salary</th>
                    <th className="px-6 py-4">Net Salary</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                
<tbody className="divide-y divide-slate-100">
  {payroll.map((item) => {
    const employee =
      item.employeeId && typeof item.employeeId === "object"
        ? item.employeeId
        : {};

    return (
      <tr key={item._id} className="hover:bg-slate-50">
        <td className="px-6 py-4">
          <p className="font-semibold text-slate-900">
            {employee.name || "Name unavailable"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {employee.email || ""}
          </p>
        </td>

        <td className="px-6 py-4 font-medium text-slate-700">
          {item.month || "—"}
        </td>

        <td className="px-6 py-4 text-slate-700">
          {money(item.basicSalary)}
        </td>

        <td className="px-6 py-4 font-semibold text-slate-900">
          {money(item.netSalary)}
        </td>

        <td className="px-6 py-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              item.status === "Paid"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {item.status || "Pending"}
          </span>
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {item.status === "Pending" && (
              <button
                type="button"
                onClick={() => openEditPayroll(item)}
                className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600"
              >
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={() => viewSalarySlip(item)}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white"
            >
              View Slip
            </button>

            {item.status === "Pending" ? (
              <button
                type="button"
                onClick={() => markAsPaid(item._id)}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
              >
                Mark as Paid
              </button>
            ) : (
              <span className="self-center text-xs text-emerald-700">
                Paid
              </span>
            )}
          </div>
        </td>
      </tr>
    );
  })}
</tbody>

              </table>
            </div>
          )}
        </section>
      </div>
      
      {editingPayroll && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 p-4">
          <div className="mx-auto my-8 max-w-xl rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                  Payroll Management
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Edit Salary Record
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingPayroll.employeeId?.name || editingPayroll.employeeId?.email || "Employee"} · {editingPayroll.month}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPayroll(null)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>

            <form onSubmit={savePayrollEdit} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Basic Salary (₹)
                <input
                  type="number"
                  name="basicSalary"
                  min="0"
                  step="0.01"
                  required
                  value={editForm.basicSalary}
                  onChange={updateEditForm}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Allowances (₹)
                <input
                  type="number"
                  name="allowances"
                  min="0"
                  step="0.01"
                  required
                  value={editForm.allowances}
                  onChange={updateEditForm}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Deductions (₹)
                <input
                  type="number"
                  name="deductions"
                  min="0"
                  step="0.01"
                  required
                  value={editForm.deductions}
                  onChange={updateEditForm}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </label>

              <div className="rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Gross Salary</span>
                  <span className="font-semibold">
                    {money((Number(editForm.basicSalary) || 0) + (Number(editForm.allowances) || 0))}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-slate-600">Net Salary</span>
                  <span className="font-bold text-indigo-700">
                    {money((Number(editForm.basicSalary) || 0) + (Number(editForm.allowances) || 0) - (Number(editForm.deductions) || 0))}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPayroll(null)}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {editSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSlip && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 p-4">
          <div className="mx-auto my-8 max-w-3xl rounded-2xl bg-white p-6 shadow-2xl md:p-10 print:my-0 print:max-w-none print:p-0 print:shadow-none">
            <div className="mb-6 flex justify-between gap-3 print:hidden">
              <h2 className="text-xl font-bold text-slate-900">
                Salary Slip
              </h2>

              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>

            <div id="salary-slip" className="text-slate-800">
              <div className="border-b-2 border-indigo-600 pb-5">
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                  PayrollHub
                </p>
                <h1 className="mt-2 text-3xl font-bold">
                  Salary Slip
                </h1>
                <p className="mt-2 text-slate-500">
                  Salary month: {selectedSlip.month}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Payroll ID: {selectedSlip._id}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Employee Name
                  </p>
                  <p className="mt-1 font-semibold">
                    {selectedSlip.employeeId?.name || "Employee"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Email
                  </p>
                  <p className="mt-1 font-semibold">
                    {selectedSlip.employeeId?.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Department
                  </p>
                  <p className="mt-1 font-semibold">
                    {selectedSlip.employeeId?.department || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Payment Status
                  </p>
                  <p className="mt-1 font-semibold">
                    {selectedSlip.status}
                  </p>
                </div>
              </div>

              <h3 className="mb-3 text-lg font-bold">
                Salary Breakdown
              </h3>

              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">Basic Salary</td>
                    <td className="py-3 text-right font-medium">
                      {money(selectedSlip.basicSalary)}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-3">Allowances</td>
                    <td className="py-3 text-right font-medium">
                      {money(selectedSlip.allowances)}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-3">Gross Salary</td>
                    <td className="py-3 text-right font-medium">
                      {money(selectedSlip.grossSalary)}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-3">Deductions</td>
                    <td className="py-3 text-right font-medium">
                      − {money(selectedSlip.deductions)}
                    </td>
                  </tr>

                  <tr className="bg-indigo-50 font-bold">
                    <td className="px-3 py-4">Net Salary</td>
                    <td className="px-3 py-4 text-right text-lg text-indigo-700">
                      {money(selectedSlip.netSalary)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-8 border-t pt-5 text-xs text-slate-500">
                This salary slip is generated electronically by PayrollHub.
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <button
                type="button"
                onClick={printSalarySlip}
                className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Print / Save as PDF
              </button>

              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Payroll;
