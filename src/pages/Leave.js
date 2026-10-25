
import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState("");
  const [comments, setComments] = useState({});
  const [notice, setNotice] = useState("");

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${API_URL}/api/admin/leaves`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load leave requests.");
      }

     setLeaves(
  Array.isArray(data) ? data : Array.isArray(data.leaves) ? data.leaves : []
);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const updateStatus = async (leaveId, status) => {
    try {
      setUpdatingId(leaveId);
      setError("");
      setNotice("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/leaves/${leaveId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            adminComment: comments[leaveId] || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update leave status.");
      }

      setNotice(`Leave request ${status.toLowerCase()} successfully.`);
      await fetchLeaves();
    } catch (err) {
      setError(err.message || "Failed to update request.");
    } finally {
      setUpdatingId("");
    }
  };

  const filteredLeaves =
    filter === "All"
      ? leaves
      : leaves.filter((leave) => leave.status === filter);

  const stats = [
    {
      label: "Total Requests",
      value: leaves.length,
      icon: "▤",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pending",
      value: leaves.filter((leave) => leave.status === "Pending").length,
      icon: "◷",
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Approved",
      value: leaves.filter((leave) => leave.status === "Approved").length,
      icon: "✓",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Rejected",
      value: leaves.filter((leave) => leave.status === "Rejected").length,
      icon: "×",
      color: "bg-rose-50 text-rose-700",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-blue-600">
              PayrollHub / Workforce
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Leave Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review employee leave applications and manage approvals.
            </p>
          </div>

          <button
            onClick={fetchLeaves}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            ↻ Refresh Requests
          </button>
        </div>

        {notice && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl text-xl font-bold ${stat.color}`}
                >
                  {stat.icon}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Employee Leave Requests
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Requests saved in your database.
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="All">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading leave requests...
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                ▤
              </div>
              <h3 className="font-semibold text-slate-800">
                No leave requests found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Requests will appear here when employees apply for leave.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Employee</th>
                    <th className="px-5 py-4">Leave Type</th>
                    <th className="px-5 py-4">Dates</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Admin Comment</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredLeaves.map((leave) => {
                    const employee =
                      leave.employeeId && typeof leave.employeeId === "object"
                        ? leave.employeeId
                        : {};

                    const statusStyle = {
                      Pending: "bg-amber-50 text-amber-700",
                      Approved: "bg-emerald-50 text-emerald-700",
                      Rejected: "bg-rose-50 text-rose-700",
                    };

                    return (
                      <tr key={leave._id} className="align-top hover:bg-slate-50/70">
                        <td className="px-5 py-5">
                          <p className="font-semibold text-slate-800">
                            {employee.name || "Unknown employee"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {employee.email || ""}
                          </p>
                        </td>

                        <td className="px-5 py-5 font-medium text-slate-700">
                          {leave.leaveType}
                        </td>

                        <td className="px-5 py-5 whitespace-nowrap text-slate-600">
                          <p>{formatDate(leave.startDate)}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            to {formatDate(leave.endDate)}
                          </p>
                        </td>

                        <td className="max-w-[220px] whitespace-normal px-5 py-5 text-slate-600">
                          {leave.reason}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              statusStyle[leave.status] ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <textarea
                            rows={2}
                            maxLength={1000}
                            value={
                              comments[leave._id] ??
                              leave.adminComment ??
                              ""
                            }
                            onChange={(event) =>
                              setComments((previous) => ({
                                ...previous,
                                [leave._id]: event.target.value,
                              }))
                            }
                            disabled={leave.status !== "Pending"}
                            placeholder="Optional comment"
                            className="w-40 resize-y rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-blue-500 disabled:bg-slate-50"
                          />
                        </td>

                        <td className="px-5 py-5">
                          {leave.status === "Pending" ? (
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() =>
                                  updateStatus(leave._id, "Approved")
                                }
                                disabled={updatingId === leave._id}
                                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                              >
                                {updatingId === leave._id
                                  ? "Saving..."
                                  : "Approve"}
                              </button>

                              <button
                                onClick={() =>
                                  updateStatus(leave._id, "Rejected")
                                }
                                disabled={updatingId === leave._id}
                                className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Reviewed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-5 text-xs leading-5 text-slate-400">
          Leave decisions are saved through the backend. Only pending requests
          can be approved or rejected from this page.
        </p>
      </div>
    </div>
  );
}

export default Leave;
