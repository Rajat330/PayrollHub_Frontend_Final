




import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://payrollhub-backend-final.onrender.com";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    photo: "",
    role: "employee",
    status: "Active",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const [form, setForm] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [leaves, setLeaves] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceError, setAttendanceError] = useState("");
  const [attendanceMonth, setAttendanceMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [payrollLoading, setPayrollLoading] = useState(true);
  const [payrollError, setPayrollError] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchMyLeaves = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/my-leaves`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load your leave requests.");
      }

      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load leave requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyLeaves();
  }, [fetchMyLeaves]);

  const fetchMyPayroll = useCallback(async () => {
    try {
      setPayrollLoading(true);
      setPayrollError("");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/my-payroll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load your salary history.");
      }

      setPayrollRecords(
        Array.isArray(data) ? data : Array.isArray(data.payroll) ? data.payroll : []
      );
    } catch (err) {
      setPayrollError(err.message || "Could not load your salary history.");
    } finally {
      setPayrollLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPayroll();
  }, [fetchMyPayroll]);

  const fetchMyAttendance = useCallback(async () => {
    try {
      setAttendanceLoading(true);
      setAttendanceError("");
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again to view your attendance.");
      }

      const response = await fetch(`${API_URL}/api/my-attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Attendance API returned HTML instead of JSON. Check the backend route and server.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not load your attendance.");
      }

      setAttendanceRecords(
        Array.isArray(data.records)
          ? data.records
          : Array.isArray(data)
            ? data
            : []
      );
    } catch (err) {
      setAttendanceError(err.message || "Could not load your attendance.");
    } finally {
      setAttendanceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyAttendance();
  }, [fetchMyAttendance]);

  const filteredAttendance = attendanceRecords
    .filter((record) => typeof record.date === "string" && record.date.startsWith(attendanceMonth))
    .sort((a, b) => b.date.localeCompare(a.date));

  const attendanceSummary = {
    total: filteredAttendance.length,
    present: filteredAttendance.filter((record) => record.status === "Present").length,
    absent: filteredAttendance.filter((record) => record.status === "Absent").length,
    late: filteredAttendance.filter((record) => record.status === "Late").length,
    onLeave: filteredAttendance.filter((record) => record.status === "On Leave").length,
  };

  const attendancePercentage = attendanceSummary.total
    ? Math.round(((attendanceSummary.present + attendanceSummary.late) / attendanceSummary.total) * 100)
    : 0;

  const formatAttendanceDate = (date) => {
    if (!date) return "—";
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchMyProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      setProfileError("");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Profile API returned HTML instead of JSON. Check backend server and /api/my-profile route.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not load your profile.");
      }

      const loadedProfile = data.user || data;
      setProfile({
        name: loadedProfile.name || "",
        email: loadedProfile.email || "",
        phone: loadedProfile.phone || "",
        department: loadedProfile.department || "",
        designation: loadedProfile.designation || "",
        photo: loadedProfile.photo || "",
        role: loadedProfile.role || "employee",
        status: loadedProfile.status || "Active",
      });
      setUser((previous) => {
        const nextUser = { ...(previous || {}), ...loadedProfile };
        localStorage.setItem("user", JSON.stringify(nextUser));
        return nextUser;
      });
    } catch (err) {
      setProfileError(err.message || "Could not load your profile.");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  const handleProfileChange = (event) => {
    setProfile((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("Please choose an image file such as JPG, PNG or WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setProfileError("Please choose an image smaller than 1 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((previous) => ({
        ...previous,
        photo: typeof reader.result === "string" ? reader.result : previous.photo,
      }));
      setProfileError("");
    };
    reader.onerror = () => setProfileError("Could not read this image. Please try another file.");
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");

    if (!profile.name.trim()) {
      setProfileError("Name is required.");
      return;
    }

    try {
      setProfileSaving(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/my-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name.trim(),
          phone: profile.phone.trim(),
          photo: profile.photo.trim(),
        }),
      });

      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Profile API returned HTML instead of JSON. Check backend server and /api/my-profile route.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not update your profile.");
      }

      const savedProfile = data.user || data;
      setProfile((previous) => ({ ...previous, ...savedProfile }));
      setUser((previous) => {
        const nextUser = { ...(previous || {}), ...savedProfile };
        localStorage.setItem("user", JSON.stringify(nextUser));
        return nextUser;
      });
      setProfileEditing(false);
      setProfileMessage("Profile updated successfully!");
    } catch (err) {
      setProfileError(err.message || "Could not update your profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  const formatPayrollMonth = (month) => {
    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return month || "—";
    const [year, monthNumber] = month.split("-");
    return new Date(Number(year), Number(monthNumber) - 1, 1).toLocaleDateString(
      "en-IN",
      { month: "long", year: "numeric" }
    );
  };

  const downloadCsv = (filename, headers, rows) => {
    const escapeCell = (value) => {
      const text = value === null || value === undefined ? "" : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };
    const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\\r\\n");
    const blob = new Blob(["\\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadEmployeeReport = (kind) => {
    const safeName = (user?.name || "employee").trim().replace(/[^a-z0-9_-]+/gi, "_");
    if (kind === "attendance") {
      downloadCsv(`${safeName}_attendance.csv`,
        ["Date", "Status", "Check In", "Check Out"],
        attendanceRecords.map((r) => [r.date, r.status, r.checkIn, r.checkOut]));
    } else if (kind === "payroll") {
      downloadCsv(`${safeName}_payroll.csv`,
        ["Month", "Basic Salary", "Allowances", "Deductions", "Gross Salary", "Net Salary", "Status", "Paid At"],
        payrollRecords.map((r) => [r.month, r.basicSalary, r.allowances, r.deductions, r.grossSalary, r.netSalary, r.status, r.paidAt ? new Date(r.paidAt).toLocaleDateString("en-IN") : ""]));
    } else if (kind === "leaves") {
      downloadCsv(`${safeName}_leave_history.csv`,
        ["Leave Type", "Start Date", "End Date", "Reason", "Status", "Admin Comment"],
        leaves.map((r) => [r.leaveType, r.startDate, r.endDate, r.reason, r.status, r.adminComment]));
    } else if (kind === "profile") {
      downloadCsv(`${safeName}_profile.csv`,
        ["Name", "Email", "Phone", "Department", "Designation", "Role", "Status"],
        [[profile.name, profile.email, profile.phone, profile.department, profile.designation, profile.role, profile.status]]);
    }
  };

  const handlePrintSlip = () => window.print();

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");
  setMessage("");

  if (!form.leaveType.trim()) {
    setError("Please select a leave type.");
    return;
  }

  if (!form.startDate) {
    setError("Please select the start date.");
    return;
  }

  if (!form.endDate) {
    setError("Please select the end date.");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(`${form.startDate}T00:00:00`);
  const endDate = new Date(`${form.endDate}T00:00:00`);

  if (Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())) {
    setError("Please enter valid dates.");
    return;
  }

  if (startDate < today) {
    setError("Start date cannot be in the past.");
    return;
  }

  if (endDate < startDate) {
    setError("End date cannot be earlier than start date.");
    return;
  }

  const reason = form.reason.trim();

  if (!reason) {
    setError("Please enter the reason for leave.");
    return;
  }

  if (reason.length > 1000) {
    setError("Reason cannot exceed 1000 characters.");
    return;
  }

  try {
    setSubmitting(true);

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/leaves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        reason,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to apply for leave.");
    }

    setMessage("Leave request submitted successfully!");

    setForm({
      leaveType: "Casual Leave",
      startDate: "",
      endDate: "",
      reason: "",
    });

    await fetchMyLeaves();
  } catch (err) {
    setError(err.message || "Something went wrong.");
  } finally {
    setSubmitting(false);
  }
};
  const statusStyle = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-rose-100 text-rose-700",
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #employee-salary-slip, #employee-salary-slip * { visibility: visible !important; }
          #employee-salary-slip { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
      <aside className="bg-slate-900 px-5 py-6 text-white md:fixed md:inset-y-0 md:left-0 md:w-64">
        <h2 className="text-2xl font-bold tracking-tight">
          Payroll<span className="text-blue-400">Hub</span>
        </h2>
        <p className="mt-1 text-sm text-slate-400">Employee Portal</p>

        <nav className="mt-8 flex flex-wrap gap-2 md:flex-col">
          {[
            { id: "dashboard", label: "🏠 Dashboard" },
            { id: "my-profile", label: "👤 My Profile" },
            { id: "apply-leave", label: "📅 Apply for Leave" },
            { id: "my-payroll", label: "💰 My Payroll" },
            { id: "my-attendance", label: "🕘 My Attendance" },
            { id: "my-leaves", label: "📋 My Leave Requests" },
            { id: "reports", label: "📊 Reports" },
            { id: "settings", label: "⚙️ Settings" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSection(item.id);
                setError("");
                setMessage("");
                if (item.id === "my-profile") fetchMyProfile();
                if (item.id === "my-payroll") fetchMyPayroll();
                if (item.id === "my-attendance") fetchMyAttendance();
                if (item.id === "my-leaves") fetchMyLeaves();
              }}
              className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeSection === item.id
                  ? "bg-slate-800 text-white shadow-inner"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 border-t border-slate-700 pt-5 md:absolute md:bottom-6 md:left-5 md:right-5">
          <p className="mb-3 truncate text-sm text-slate-300">{user?.name || "Employee"}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border border-red-400/40 px-4 py-3 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10 md:ml-64">
        <div className="mx-auto max-w-5xl">
          {activeSection === "dashboard" && (
            <>
        <div id="dashboard" className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            PayrollHub / Employee Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome, {user?.name || "Employee"}!
          </h1>

          <p className="mt-3 text-gray-600">
            Welcome to your PayrollHub Employee Dashboard.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-blue-50 p-5">
              <h2 className="text-lg font-semibold text-blue-900">
                My Profile
              </h2>
              <p className="mt-2 text-sm text-blue-800">
                Name: {user?.name || "Not available"}
              </p>
              <p className="mt-1 break-words text-sm text-blue-800">
                Email: {user?.email || "Not available"}
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-5">
              <h2 className="text-lg font-semibold text-purple-900">
                My Account
              </h2>
              <p className="mt-2 text-sm text-purple-800">
                Role: Employee
              </p>
              <p className="mt-1 text-sm text-purple-800">
                Your employee account is active.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}
            </>
          )}

        {(activeSection === "dashboard" || activeSection === "my-profile") && (
        <div id="my-profile" className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-6 py-7 text-white sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">Account Centre</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">My Profile</h2>
                <p className="mt-2 max-w-xl text-sm text-slate-300">Manage your personal details and profile photo in one place.</p>
              </div>
              {!profileEditing && !profileLoading && (
                <button type="button" onClick={() => { setProfileMessage(""); setProfileError(""); setProfileEditing(true); }}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50">
                  ✎ Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {profileError && (
              <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{profileError}</div>
            )}
            {profileMessage && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">✓ {profileMessage}</div>
            )}

            {profileLoading ? (
              <div className="py-10 text-center text-sm text-slate-500">Loading your profile...</div>
            ) : (
             <form noValidate onSubmit={handleProfileSave} className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-indigo-200 text-5xl font-bold text-blue-800 shadow-lg ring-1 ring-slate-200">
                    {profile.photo ? (
                      <img src={profile.photo} alt="Your profile" className="h-full w-full object-cover" />
                    ) : (
                      (profile.name || user?.name || "E").trim().charAt(0).toUpperCase()
                    )}
                  </div>
                  <h3 className="mt-4 truncate text-lg font-bold text-slate-900">{profile.name || "Employee"}</h3>
                  <p className="mt-1 break-all text-xs text-slate-500">{profile.email || "Email not available"}</p>
                  <span className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    ● {profile.status || "Active"}
                  </span>

                  {profileEditing && (
                    <div className="mt-5 text-left">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">Profile Photo</label>
                      <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-blue-300 bg-white px-4 py-5 text-sm font-semibold text-blue-700 transition hover:border-blue-500 hover:bg-blue-50">
                        <span className="text-2xl">↑</span>
                        <span className="mt-1">Choose image</span>
                        <span className="mt-1 text-center text-xs font-normal text-slate-500">JPG, PNG or WEBP · max 1 MB</span>
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleProfilePhotoChange} className="sr-only" />
                      </label>
                      {profile.photo && (
                        <button type="button" onClick={() => setProfile((previous) => ({ ...previous, photo: "" }))}
                          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                          Remove selected photo
                        </button>
                      )}
                    </div>
                  )}
                  <p className="mt-4 text-xs leading-5 text-slate-500">Your account is managed securely. You cannot delete your own account or change your access role.</p>
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-6 w-1 rounded-full bg-blue-600"></span>
                    <h3 className="text-base font-bold text-slate-900">Personal information</h3>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                      <input name="name" value={profile.name} onChange={handleProfileChange} readOnly={!profileEditing} required maxLength={100}
                        className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition ${profileEditing ? "border-slate-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100" : "border-slate-200 bg-slate-50 text-slate-600"}`} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                      <input value={profile.email} readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-500 outline-none" />
                      <p className="mt-1.5 text-xs text-slate-400">Email changes require secure verification.</p>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
                      <input name="phone" value={profile.phone} onChange={handleProfileChange} readOnly={!profileEditing} maxLength={20} placeholder="Add phone number"
                        className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition ${profileEditing ? "border-slate-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100" : "border-slate-200 bg-slate-50 text-slate-600"}`} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Department</label>
                      <input value={profile.department || "Not assigned"} readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-500 outline-none" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Designation</label>
                      <input value={profile.designation || "Not assigned"} readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-500 outline-none" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Account Role</label>
                      <input value={profile.role} readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm capitalize text-slate-500 outline-none" />
                    </div>
                  </div>

                  {profileEditing && (
                    <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                      <button type="submit" disabled={profileSaving}
                        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {profileSaving ? "Saving changes..." : "Save Changes"}
                      </button>
                      <button type="button" disabled={profileSaving} onClick={() => { setProfileEditing(false); fetchMyProfile(); }}
                        className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        )}

        {(activeSection === "dashboard" || activeSection === "my-payroll") && (
        <div id="my-payroll" className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Salary & Payments</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">My Payroll & Salary History</h2>
            <p className="mt-2 text-sm text-gray-500">View your monthly salary details and open a salary slip.</p>
          </div>

          {payrollError && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Salary history could not load: {payrollError}
            </div>
          )}
          {payrollLoading ? (
            <p className="py-8 text-center text-sm text-gray-500">Loading your salary history...</p>
          ) : payrollRecords.length === 0 ? (
            <div className="rounded-xl bg-gray-50 px-4 py-10 text-center">
              <p className="font-semibold text-gray-700">No salary records available yet</p>
              <p className="mt-2 text-sm text-gray-500">Your payroll records will appear here once payroll has been generated.</p>
            </div>
          ) : (
            <>
              <div className="mb-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-800">Total Net Salary Recorded</p>
                  <p className="mt-2 text-2xl font-bold text-blue-950">
                    {formatCurrency(payrollRecords.reduce((sum, item) => sum + Number(item.netSalary || 0), 0))}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm font-medium text-emerald-800">Paid Payrolls</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-950">
                    {payrollRecords.filter((item) => item.status === "Paid").length}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Month</th>
                      <th className="px-4 py-3 font-semibold">Basic Salary</th>
                      <th className="px-4 py-3 font-semibold">Allowances</th>
                      <th className="px-4 py-3 font-semibold">Deductions</th>
                      <th className="px-4 py-3 font-semibold">Net Salary</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Salary Slip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {payrollRecords.map((item) => (
                      <tr key={item._id}>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{formatPayrollMonth(item.month)}</td>
                        <td className="whitespace-nowrap px-4 py-3">{formatCurrency(item.basicSalary)}</td>
                        <td className="whitespace-nowrap px-4 py-3">{formatCurrency(item.allowances)}</td>
                        <td className="whitespace-nowrap px-4 py-3">{formatCurrency(item.deductions)}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{formatCurrency(item.netSalary)}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}>{item.status || "Pending"}</span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <button type="button" onClick={() => setSelectedSlip(item)}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                            View Slip
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        )}

        {(activeSection === "dashboard" || activeSection === "my-attendance") && (
          <section id="my-attendance" className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-5 py-6 text-white sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Time & Presence</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">My Attendance</h2>
                  <p className="mt-2 text-sm text-slate-300">View your attendance records marked by the administrator.</p>
                </div>
                <button
                  type="button"
                  onClick={fetchMyAttendance}
                  disabled={attendanceLoading}
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-60"
                >
                  {attendanceLoading ? "Refreshing..." : "↻ Refresh"}
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <label htmlFor="attendance-month" className="mb-2 block text-sm font-semibold text-slate-700">Filter by month</label>
                  <input
                    id="attendance-month"
                    type="month"
                    value={attendanceMonth}
                    onChange={(event) => setAttendanceMonth(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <p className="text-sm text-slate-500">
                  {attendanceSummary.total} record{attendanceSummary.total === 1 ? "" : "s"} in selected month
                </p>
              </div>

              {attendanceError && (
                <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {attendanceError}
                </div>
              )}

              <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Present", value: attendanceSummary.present, styles: "bg-emerald-50 text-emerald-800", marker: "✓" },
                  { label: "Absent", value: attendanceSummary.absent, styles: "bg-rose-50 text-rose-800", marker: "×" },
                  { label: "Late", value: attendanceSummary.late, styles: "bg-amber-50 text-amber-800", marker: "◷" },
                  { label: "On Leave", value: attendanceSummary.onLeave, styles: "bg-violet-50 text-violet-800", marker: "○" },
                ].map((card) => (
                  <div key={card.label} className={`rounded-xl p-4 ${card.styles}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{card.label}</p>
                      <span className="text-xl font-bold">{card.marker}</span>
                    </div>
                    <p className="mt-3 text-3xl font-bold">{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-7 rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">Attendance overview</p>
                    <p className="mt-1 text-xs text-slate-500">Present and Late records as a share of marked records.</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">{attendancePercentage}%</span>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${attendancePercentage}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{attendanceSummary.present + attendanceSummary.late} of {attendanceSummary.total} marked days were Present or Late.</p>
              </div>

              {attendanceLoading ? (
                <div className="py-10 text-center text-sm text-slate-500">Loading your attendance records...</div>
              ) : filteredAttendance.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                  <div className="text-3xl">🗓️</div>
                  <p className="mt-3 font-semibold text-slate-800">No attendance records for this month</p>
                  <p className="mt-2 text-sm text-slate-500">Once your administrator marks attendance, your records will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Check In</th>
                        <th className="px-4 py-3 font-semibold">Check Out</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredAttendance.map((record) => {
                        const statusClass = {
                          Present: "bg-emerald-100 text-emerald-700",
                          Absent: "bg-rose-100 text-rose-700",
                          Late: "bg-amber-100 text-amber-700",
                          "On Leave": "bg-violet-100 text-violet-700",
                        }[record.status] || "bg-slate-100 text-slate-700";

                        return (
                          <tr key={record._id || `${record.date}-${record.status}`} className="hover:bg-slate-50">
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-800">{formatAttendanceDate(record.date)}</td>
                            <td className="whitespace-nowrap px-4 py-4 text-slate-600">{record.checkIn || "—"}</td>
                            <td className="whitespace-nowrap px-4 py-4 text-slate-600">{record.checkOut || "—"}</td>
                            <td className="whitespace-nowrap px-4 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass}`}>{record.status || "Unmarked"}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="mt-4 text-xs text-slate-400">Attendance is read-only here. Contact your administrator if a record needs correction.</p>
            </div>
          </section>
        )}

        {(activeSection === "dashboard" || activeSection === "apply-leave") && (
        <div id="apply-leave" className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Time Off
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Apply for Leave
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Fill in the details below to submit your leave request.
            </p>
          </div>
            {error && (
  <div
    role="alert"
    className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
  >
    {error}
  </div>
)}

{message && (
  <div
    role="status"
    className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
  >
    {message}
  </div>
)}

<form noValidate onSubmit={handleSubmit} className="space-y-5"></form>
          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Employee Name
              </label>
              <input
                value={user?.name || ""}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Leave Type
              </label>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Paid Leave</option>
                <option>Emergency Leave</option>
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  min={form.startDate || new Date().toLocaleDateString("en-CA")}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reason for Leave
              </label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                required
                placeholder="Please explain why you need leave..."
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {form.reason.length}/1000 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? "Submitting..." : "Submit Leave Request"}
            </button>
          </form>
        </div>

        )}

        {(activeSection === "dashboard" || activeSection === "my-leaves") && (
        <div id="my-leaves" className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              My Leave Requests
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Track the status of your submitted applications.
            </p>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Loading your requests...
            </p>
          ) : leaves.length === 0 ? (
            <div className="rounded-xl bg-gray-50 px-4 py-10 text-center">
              <p className="font-semibold text-gray-700">
                No leave requests yet
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Your submitted applications will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaves.map((leave) => (
                <div
                  key={leave._id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {leave.leaveType}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {formatDate(leave.startDate)} –{" "}
                        {formatDate(leave.endDate)}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyle[leave.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {leave.reason}
                  </p>

                  {leave.adminComment && (
                    <div className="mt-4 rounded-lg bg-gray-50 p-3">
                      <p className="text-xs font-semibold text-gray-700">
                        Admin Comment
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {leave.adminComment}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
        {activeSection === "reports" && (
          <section className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-6 py-7 text-white sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Your Records</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">My Reports & Downloads</h2>
              <p className="mt-2 text-sm text-slate-300">Download your own attendance, payroll, leave and profile records as CSV files that open in Excel.</p>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
              {[
                { id: "attendance", title: "Attendance Report", description: `${attendanceRecords.length} attendance record(s)`, icon: "🕘" },
                { id: "payroll", title: "Payroll Report", description: `${payrollRecords.length} salary record(s)`, icon: "💰" },
                { id: "leaves", title: "Leave History", description: `${leaves.length} leave request(s)`, icon: "📅" },
                { id: "profile", title: "Profile Details", description: "Your current profile information", icon: "👤" },
              ].map((report) => (
                <div key={report.id} className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{report.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900">{report.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{report.description}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => downloadEmployeeReport(report.id)}
                    className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                    ⬇ Download CSV / Excel
                  </button>
                </div>
              ))}
            </div>
            <p className="px-5 pb-6 text-xs text-slate-400 sm:px-8">Privacy: these downloads contain only records returned for your signed-in employee account. CSV files can be opened in Microsoft Excel or Google Sheets.</p>
          </section>
        )}

        {activeSection === "settings" && (
          <section className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-7 text-white sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Account Centre</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Settings</h2>
              <p className="mt-2 text-sm text-slate-300">Review your account and basic display preferences.</p>
            </div>
            <div className="space-y-4 p-5 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Account information</h3>
                  <p className="mt-1 text-sm text-slate-500">Manage your name and phone number from My Profile.</p>
                </div>
                <button type="button" onClick={() => setActiveSection("my-profile")}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Open My Profile</button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Password & security</h3>
                  <p className="mt-1 text-sm text-slate-500">For security, use your app's existing password-change flow if enabled. No password is displayed here.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Protected</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Refresh my records</h3>
                  <p className="mt-1 text-sm text-slate-500">Reload attendance, payroll and leave information from the server.</p>
                </div>
                <button type="button" onClick={() => { fetchMyAttendance(); fetchMyPayroll(); fetchMyLeaves(); fetchMyProfile(); }}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">↻ Refresh records</button>
              </div>
            </div>
          </section>
        )}

        {selectedSlip && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 sm:p-8 print:static print:bg-white print:p-0">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8 print:max-w-none print:rounded-none print:p-0 print:shadow-none">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4 print:hidden">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">PayrollHub</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">Salary Slip</h2>
                </div>
                <button type="button" onClick={() => setSelectedSlip(null)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Close
                </button>
              </div>

              <div id="employee-salary-slip" className="border border-gray-200 p-5 sm:p-8 print:border-0 print:p-0">
                <div className="border-b border-gray-200 pb-5">
                  <h1 className="text-2xl font-bold text-slate-900">PayrollHub</h1>
                  <p className="mt-1 text-sm text-gray-500">Employee Salary Slip</p>
                  <p className="mt-4 text-lg font-bold text-gray-900">{formatPayrollMonth(selectedSlip.month)}</p>
                </div>
                <div className="grid gap-4 border-b border-gray-200 py-5 sm:grid-cols-2">
                  <div><p className="text-xs uppercase tracking-wide text-gray-500">Employee Name</p><p className="mt-1 font-semibold text-gray-900">{user?.name || "Employee"}</p></div>
                  <div><p className="text-xs uppercase tracking-wide text-gray-500">Employee Email</p><p className="mt-1 break-words font-semibold text-gray-900">{user?.email || "—"}</p></div>
                  <div><p className="text-xs uppercase tracking-wide text-gray-500">Payment Status</p><p className="mt-1 font-semibold text-gray-900">{selectedSlip.status || "Pending"}</p></div>
                  <div><p className="text-xs uppercase tracking-wide text-gray-500">Paid Date</p><p className="mt-1 font-semibold text-gray-900">{selectedSlip.paidAt ? new Date(selectedSlip.paidAt).toLocaleDateString("en-IN") : "Not paid yet"}</p></div>
                </div>
                <div className="py-5">
                  <div className="flex justify-between border-b border-gray-100 py-3 text-sm"><span className="text-gray-600">Basic Salary</span><span className="font-medium text-gray-900">{formatCurrency(selectedSlip.basicSalary)}</span></div>
                  <div className="flex justify-between border-b border-gray-100 py-3 text-sm"><span className="text-gray-600">Allowances</span><span className="font-medium text-gray-900">{formatCurrency(selectedSlip.allowances)}</span></div>
                  <div className="flex justify-between border-b border-gray-100 py-3 text-sm"><span className="text-gray-600">Gross Salary</span><span className="font-medium text-gray-900">{formatCurrency(selectedSlip.grossSalary)}</span></div>
                  <div className="flex justify-between border-b border-gray-100 py-3 text-sm"><span className="text-gray-600">Deductions</span><span className="font-medium text-rose-700">− {formatCurrency(selectedSlip.deductions)}</span></div>
                  <div className="mt-3 flex justify-between rounded-xl bg-blue-50 px-4 py-4"><span className="font-bold text-blue-950">Net Salary</span><span className="text-xl font-bold text-blue-950">{formatCurrency(selectedSlip.netSalary)}</span></div>
                </div>
                <p className="mt-5 text-xs text-gray-400">This salary slip was generated by PayrollHub.</p>
              </div>
              <div className="mt-5 flex flex-wrap justify-end gap-3 print:hidden">
                <button type="button" onClick={() => setSelectedSlip(null)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Close</button>
                <button type="button" onClick={handlePrintSlip}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Print / Save as PDF</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default EmployeeDashboard;
