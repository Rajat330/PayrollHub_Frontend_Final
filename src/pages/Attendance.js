
import { useEffect, useMemo, useState } from "react";
import { useEmployees } from "../context/EmployeeContext";
function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


const statusOptions = ["Present", "Absent", "Late", "On Leave"];

const emptyForm = {
  employeeId: "",
  status: "Present",
  checkIn: "09:00",
  checkOut: "",
};

const statusStyles = {
  Present: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Absent: "bg-red-50 text-red-700 ring-red-200",
  Late: "bg-amber-50 text-amber-700 ring-amber-200",
  "On Leave": "bg-violet-50 text-violet-700 ring-violet-200",
  Unmarked: "bg-slate-100 text-slate-600 ring-slate-200",
};

function Attendance() {
  const { employees } = useEmployees();
  const [records, setRecords] = useState([]);
const [loadingAttendance, setLoadingAttendance] = useState(true);
const [apiError, setApiError] = useState("");
const [refreshAttendance, setRefreshAttendance] = useState(0);
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  
useEffect(() => {
  let cancelled = false;

  async function fetchAttendance() {
    setLoadingAttendance(true);
    setApiError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as admin again.");
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/attendance?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load attendance."
        );
      }

      if (!cancelled) {
        setRecords(
          (data.records || []).map((record) => ({
            ...record,
            employeeId: String(record.employeeId),
          }))
        );
      }
    } catch (error) {
      if (!cancelled) {
        setApiError(
          error.message || "Failed to load attendance."
        );
      }
    } finally {
      if (!cancelled) {
        setLoadingAttendance(false);
      }
    }
  }

  fetchAttendance();

  return () => {
    cancelled = true;
  };
}, [selectedDate, refreshAttendance]);


const attendanceRows = useMemo(() => {
  return employees.map((employee) => {
    const record = records.find(
      (item) =>
        String(item.employeeId) === String(employee.id) &&
        item.date === selectedDate
    );

    return {
      ...employee,
      record,
      status: record?.status || "Unmarked",
      checkIn: record?.checkIn || "",
      checkOut: record?.checkOut || "",
    };
  });
}, [employees, records, selectedDate]);

  const filteredRows = useMemo(() => {
    return attendanceRows.filter((employee) => {
      const searchText =
        `${employee.name} ${employee.id} ${employee.email}`.toLowerCase();

      return (
        searchText.includes(search.toLowerCase()) &&
        (departmentFilter === "All" ||
          employee.department === departmentFilter) &&
        (statusFilter === "All" || employee.status === statusFilter)
      );
    });
  }, [attendanceRows, search, departmentFilter, statusFilter]);

  const presentCount = attendanceRows.filter(
    (employee) => employee.status === "Present"
  ).length;

  const absentCount = attendanceRows.filter(
    (employee) => employee.status === "Absent"
  ).length;

  const lateCount = attendanceRows.filter(
    (employee) => employee.status === "Late"
  ).length;

  const onLeaveCount = attendanceRows.filter(
    (employee) => employee.status === "On Leave"
  ).length;

  const markedCount = attendanceRows.filter(
    (employee) => employee.status !== "Unmarked"
  ).length;

  const attendancePercentage =
    employees.length > 0
      ? Math.round((presentCount / employees.length) * 100)
      : 0;

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
    setSuccess("");
  }

  function openMarkForm(employeeId = "") {
    setEditingEmployeeId(employeeId || null);

    if (employeeId) {
      const record = records.find(
        (item) =>
          item.employeeId === employeeId && item.date === selectedDate
      );

      setForm({
        employeeId,
        status: record?.status || "Present",
        checkIn: record?.checkIn || "09:00",
        checkOut: record?.checkOut || "",
      });
    } else {
      setForm(emptyForm);
    }

    setErrors({});
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingEmployeeId(null);
    setForm(emptyForm);
    setErrors({});
  }

  function validateForm() {
    const nextErrors = {};

    if (!selectedDate) {
      nextErrors.date = "Please select an attendance date.";
    }

    if (!form.employeeId) {
      nextErrors.employeeId = "Please select an employee.";
    }

    if (!statusOptions.includes(form.status)) {
      nextErrors.status = "Please select a valid attendance status.";
    }

    if (
      (form.status === "Present" || form.status === "Late") &&
      !form.checkIn
    ) {
      nextErrors.checkIn = "Check-in time is required for this status.";
    }

    if (
      form.checkIn &&
      form.checkOut &&
      form.checkOut < form.checkIn &&
      form.status !== "Absent" &&
      form.status !== "On Leave"
    ) {
      nextErrors.checkOut = "Check-out must not be earlier than check-in.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }


async function handleSubmit(event) {
  event.preventDefault();
  setSuccess("");
  setApiError("");

  if (!validateForm()) return;

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please log in as admin again.");
    }

    const response = await fetch(
      "http://localhost:5000/api/admin/attendance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: form.employeeId,
          date: selectedDate,
          status: form.status,
          checkIn:
            form.status === "Present" || form.status === "Late"
              ? form.checkIn
              : "",
          checkOut:
            form.status === "Present" || form.status === "Late"
              ? form.checkOut
              : "",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save attendance.");
    }

    setSuccess("Attendance saved successfully in MongoDB Atlas.");
    closeForm();
    setRefreshAttendance((previous) => previous + 1);
  } catch (error) {
    setApiError(error.message || "Failed to save attendance.");
  }
}


  function markAllPresent() {
    const confirmed = window.confirm(
      `Mark all ${employees.length} employees as Present for ${selectedDate}? Existing attendance for this date will be updated.`
    );

    if (!confirmed) return;

    setRecords((previous) => {
      const otherDates = previous.filter(
        (record) => record.date !== selectedDate
      );

      const todayRecords = employees.map((employee) => {
        const existing = previous.find(
          (record) =>
            record.employeeId === employee.id &&
            record.date === selectedDate
        );

        return {
          employeeId: employee.id,
          date: selectedDate,
          status: "Present",
          checkIn: existing?.checkIn || "09:00",
          checkOut: existing?.checkOut || "",
        };
      });

      return [...otherDates, ...todayRecords];
    });

    setSuccess(`All employees marked Present for ${selectedDate}.`);
  }

  function resetFilters() {
    setSearch("");
    setDepartmentFilter("All");
    setStatusFilter("All");
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-blue-600">
              Workforce Management
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Attendance Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track daily attendance, check-in times and employee status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={markAllPresent}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ✓ Mark All Present
            </button>
            <button
              type="button"
              onClick={() => openMarkForm()}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              + Mark Attendance
            </button>
          </div>
        </header>
    {apiError && (
  <div
    role="alert"
    className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
  >
    {apiError}
  </div>
)}
        {success && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            <span>{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss message"
              className="text-lg"
            >
              ×
            </button>
          </div>
        )}

        {/* Date selector */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-bold">Daily Attendance</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a date to view or update attendance records.
            </p>
          </div>

          <div>
            <label
              htmlFor="attendance-date"
              className="mb-2 block text-xs font-semibold text-slate-500"
            >
              Attendance Date
            </label>
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setSuccess("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-600">{errors.date}</p>
            )}
          </div>
        </section>

        {/* Summary cards */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Employees",
              value: employees.length,
              icon: "♙",
              color: "bg-blue-50 text-blue-600",
              note: `${markedCount} attendance records marked`,
            },
            {
              label: "Present",
              value: presentCount,
              icon: "✓",
              color: "bg-emerald-50 text-emerald-600",
              note: `${attendancePercentage}% of all employees`,
            },
            {
              label: "Absent",
              value: absentCount,
              icon: "×",
              color: "bg-red-50 text-red-600",
              note: "Employees marked absent",
            },
            {
              label: "Late",
              value: lateCount,
              icon: "◷",
              color: "bg-amber-50 text-amber-600",
              note: `${onLeaveCount} on leave`,
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${card.color}`}
                >
                  {card.icon}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold">{card.value}</p>
              <p className="mt-2 text-xs text-slate-400">{card.note}</p>
            </div>
          ))}
        </section>

        {/* Attendance progress */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Attendance Overview</h2>
              <p className="mt-1 text-sm text-slate-500">
                Present employees compared with the full workforce.
              </p>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {attendancePercentage}%
            </span>
          </div>

          <div
            className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Attendance percentage"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={attendancePercentage}
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
            <span>{presentCount} present</span>
            <span>{employees.length - markedCount} not marked</span>
            <span>{employees.length} employees total</span>
          </div>
        </section>

        {/* Mark attendance form */}
        {showForm && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">
                  {editingEmployeeId
                    ? "Update Attendance"
                    : "Mark Employee Attendance"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Record attendance for {selectedDate}.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close attendance form"
                className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <form noValidate onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label
                    htmlFor="attendance-employee"
                    className="mb-2 block text-sm font-medium"
                  >
                    Employee
                  </label>
                  <select
                    id="attendance-employee"
                    value={form.employeeId}
                    disabled={Boolean(editingEmployeeId)}
                    onChange={(event) =>
                      updateField("employeeId", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                  >
                    <option value="">Select employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.id})
                      </option>
                    ))}
                  </select>
                  {errors.employeeId && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.employeeId}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="attendance-status"
                    className="mb-2 block text-sm font-medium"
                  >
                    Attendance Status
                  </label>
                  <select
                    id="attendance-status"
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.status}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="attendance-checkin"
                    className="mb-2 block text-sm font-medium"
                  >
                    Check-in Time
                  </label>
                  <input
                    id="attendance-checkin"
                    type="time"
                    value={form.checkIn}
                    disabled={
                      form.status === "Absent" || form.status === "On Leave"
                    }
                    onChange={(event) =>
                      updateField("checkIn", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                  />
                  {errors.checkIn && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.checkIn}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="attendance-checkout"
                    className="mb-2 block text-sm font-medium"
                  >
                    Check-out Time
                  </label>
                  <input
                    id="attendance-checkout"
                    type="time"
                    value={form.checkOut}
                    disabled={
                      form.status === "Absent" || form.status === "On Leave"
                    }
                    onChange={(event) =>
                      updateField("checkOut", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                  />
                  {errors.checkOut && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.checkOut}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Attendance
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Attendance table */}
        {loadingAttendance && (
  <p className="px-5 py-3 text-sm text-slate-500">
    Loading attendance...
  </p>
)}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h2 className="text-lg font-bold">Employee Attendance</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, filter and update daily attendance records.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap sm:p-6">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employee name or ID..."
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 sm:min-w-[220px]"
            />

            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Departments</option>
              {[...new Set(employees.map((employee) => employee.department))]
                .sort()
                .map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              {[...statusOptions, "Unmarked"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Reset Filters
            </button>
          </div>

          <div className="overflow-x-auto px-5 pb-5 sm:px-6 sm:pb-6">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <th className="rounded-l-lg px-4 py-4">Employee</th>
                  <th className="px-4 py-4">Department</th>
                  <th className="px-4 py-4">Check In</th>
                  <th className="px-4 py-4">Check Out</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="rounded-r-lg px-4 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-12 text-center text-slate-500"
                    >
                      No attendance records match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-700">
                            {employee.photo ? (
                              <img
                                src={employee.photo}
                                alt={`${employee.name} profile`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              employee.name.charAt(0).toUpperCase()
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {employee.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {employee.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {employee.department}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {employee.checkIn || "—"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {employee.checkOut || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                            statusStyles[employee.status]
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => openMarkForm(employee.id)}
                          className="rounded-lg border border-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          {employee.status === "Unmarked"
                            ? "Mark Now"
                            : "Edit"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:px-6">
            Showing {filteredRows.length} of {employees.length} employees ·
            Date: {selectedDate}
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          PayrollHub · Attendance Management Preview
        </p>
      </div>
    </div>
  );
}

export default Attendance;
