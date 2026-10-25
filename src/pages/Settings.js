import { useMemo } from "react";

function readStoredUser() {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : {};
  } catch {
    return {};
  }
}

function Settings() {
  const user = useMemo(() => readStoredUser(), []);

  const displayName =
    user.name ||
    user.fullName ||
    user.username ||
    user.email ||
    "Administrator";

  const role = user.role || "admin";

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Page Header */}
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            PayrollHub / Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review your administrator account and workspace information.
          </p>
        </div>

        {/* Administrator Account */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-700">
              {(String(displayName).trim()[0] || "A").toUpperCase()}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Administrator Account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Account details currently available in your login session.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            {/* Name */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </p>

              <p className="mt-2 break-words font-semibold text-slate-900">
                {displayName}
              </p>
            </div>

            {/* Email */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </p>

              <p className="mt-2 break-words font-semibold text-slate-900">
                {user.email || "Not available in session"}
              </p>
            </div>

            {/* Role */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </p>

              <p className="mt-2 font-semibold capitalize text-slate-900">
                {role}
              </p>
            </div>

            {/* Workspace */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Workspace
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                PayrollHub Admin
              </p>
            </div>

          </div>
        </section>

        {/* Security Section */}
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-bold text-amber-950">
            Security & Password
          </h2>

          <p className="mt-2 text-sm leading-6 text-amber-900">
            Your account is protected by the existing admin login and
            ProtectedRoute. Password changes are not enabled from this page
            yet. A secure backend password-change endpoint is required before
            adding that feature.
          </p>
        </section>

        {/* Workspace Information */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">
            Workspace Information
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Use the sidebar to manage employees, attendance, leave requests,
            payroll, salary slips, and reports. Only administrators should
            access these admin routes.
          </p>
        </section>

      </div>
    </div>
  );
}

export default Settings;