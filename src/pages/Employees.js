


import { useEffect, useMemo, useRef, useState } from "react";

import { useEmployees } from "../context/EmployeeContext";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  status: "Active",
  photo: "",
};

const departments = [
  "IT",
  "HR",
  "Finance",
  "Marketing",
  "Operations",
];





function Employees() {

  const { employees, setEmployees } = useEmployees();

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [errors, setErrors] = useState({});

  const [success, setSuccess] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [viewEmployee, setViewEmployee] = useState(null);

  const [photoError, setPhotoError] = useState("");

  const fileInputRef = useRef(null);

  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const [apiError, setApiError] = useState("");



 useEffect(() => {

  const fetchEmployees = async () => {

    try {

      const token = localStorage.getItem("token");



      if (!token) {

        throw new Error("Please log in as admin again.");

      }



      const response = await fetch(

        "https://payrollhub-backend-final.onrender.com/api/get-user",

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );



      const data = await response.json();



      if (!response.ok) {

        throw new Error(data.message || "Could not load employees.");

      }



      const databaseEmployees = (data.users || data.data || [])

        .filter((user) => user.role !== "admin")

        .map((user) => ({

          ...user,

          id: String(user._id || user.id),

          department: user.department || "",

          designation: user.designation || "",

          status: user.status || "Active",

          photo: user.photo || "",

        }));



      setEmployees(databaseEmployees);

      setApiError("");

    } catch (error) {

      setApiError(error.message || "Failed to load employees.");

    } finally {

      setLoadingEmployees(false);

    }

  };



  fetchEmployees();

}, [setEmployees]);

  const filteredEmployees = useMemo(() => {

    return employees.filter((employee) => {

      const searchText =

        `${employee.name} ${employee.email} ${employee.id}`.toLowerCase();



      return (

        searchText.includes(search.toLowerCase()) &&

        (departmentFilter === "All" ||

          employee.department === departmentFilter) &&

        (statusFilter === "All" || employee.status === statusFilter)

      );

    });

  }, [employees, search, departmentFilter, statusFilter]);



  function updateField(field, value) {

    setForm((previous) => ({ ...previous, [field]: value }));

    setErrors((previous) => ({ ...previous, [field]: "" }));

    setSuccess("");

  }



  function openAddForm() {

    setEditingId(null);

    setForm(emptyForm);

    setErrors({});

    setPhotoError("");

    setSuccess("");

    setShowForm(true);

  }



  function openEditForm(employee) {

    setEditingId(employee.id);

    setForm({

      name: employee.name,

      email: employee.email,

      phone: employee.phone,

      department: employee.department,

      designation: employee.designation,

      status: employee.status,

      photo: employee.photo || "",

    });

    setErrors({});

    setPhotoError("");

    setSuccess("");

    setShowForm(true);

  }



  function closeForm() {

    setShowForm(false);

    setEditingId(null);

    setForm(emptyForm);

    setErrors({});

    setPhotoError("");

  }



  function handlePhotoChange(event) {

    const file = event.target.files?.[0];

    if (!file) return;



    setPhotoError("");



    if (!file.type.startsWith("image/")) {

      setPhotoError("Please select an image file.");

      event.target.value = "";

      return;

    }



    if (file.size > 3 * 1024 * 1024) {

      setPhotoError("Image size must be 3 MB or less.");

      event.target.value = "";

      return;

    }



    const reader = new FileReader();



    reader.onload = () => {

      setForm((previous) => ({

        ...previous,

        photo: String(reader.result),

      }));

    };



    reader.onerror = () => {

      setPhotoError("Could not read this image. Please try again.");

    };



    reader.readAsDataURL(file);

  }



  function validateForm() {

    const nextErrors = {};



    if (!form.name.trim()) {

      nextErrors.name = "Please enter employee name.";

    } else if (form.name.trim().length < 2) {

      nextErrors.name = "Name must contain at least 2 characters.";

    }



    if (!form.email.trim()) {

      nextErrors.email = "Please enter email address.";

    } 
     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {

      nextErrors.email = "Please enter a valid email address.";

    } else if (

      employees.some(

        (employee) =>

          employee.email.toLowerCase() ===

            form.email.trim().toLowerCase() &&

          employee.id !== editingId

      )

    ) {

      nextErrors.email = "This email is already registered.";

    }



    if (!form.phone.trim()) {

      nextErrors.phone = "Please enter phone number.";

    } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {

      nextErrors.phone = "Phone number must contain exactly 10 digits.";

    }



    if (!form.department) {

      nextErrors.department = "Please select a department.";

    }



    if (!form.designation.trim()) {

      nextErrors.designation = "Please enter designation.";

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

    const employeeData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      department: form.department,
      designation: form.designation.trim(),
      status: form.status,
      photo: form.photo,
    };

    const isEditing = Boolean(editingId);

    const url = isEditing
      ? `https://payrollhub-backend-final.onrender.com/api/admin/employees/${editingId}`
      : "https://payrollhub-backend-final.onrender.com/api/admin/employees";

    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          (isEditing
            ? "Could not update employee."
            : "Could not create employee.")
      );
    }

    const savedEmployee = {
      ...data.user,
      id: String(data.user._id || data.user.id || editingId || ""),
      department: data.user.department || form.department,
      designation: data.user.designation || form.designation.trim(),
      status: data.user.status || form.status,
      photo: data.user.photo ?? form.photo ?? "",
    };

    if (isEditing) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === String(editingId)
            ? savedEmployee
            : employee
        )
      );

      setViewEmployee((previous) =>
        previous?.id === String(editingId)
          ? savedEmployee
          : previous
      );

      setSuccess("Employee updated successfully in MongoDB.");
    } else {
      setEmployees((previous) => [
        ...previous.filter(
          (employee) => employee.id !== savedEmployee.id
        ),
        savedEmployee,
      ]);

      setSuccess("Employee saved successfully to MongoDB.");
    }

    closeForm();
  } catch (error) {
    setApiError(error.message || "Failed to save employee.");
  }
}



  
async function confirmDelete() {
  if (!deleteTarget) return;

  try {
    setApiError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please log in as admin again.");
    }

    const response = await fetch(
      `https://payrollhub-backend-final.onrender.com/api/admin/employees/${deleteTarget.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Could not delete employee."
      );
    }

    const deletedId = deleteTarget.id;
    const deletedName = deleteTarget.name;

    setEmployees((previous) =>
      previous.filter(
        (employee) => employee.id !== deletedId
      )
    );

    setSuccess(
      `${deletedName} deleted successfully from MongoDB.`
    );

    setDeleteTarget(null);

    if (viewEmployee?.id === deletedId) {
      setViewEmployee(null);
    }
  } catch (error) {
    setApiError(
      error.message || "Failed to delete employee."
    );
  }
}



  const activeCount = employees.filter(

    (employee) => employee.status === "Active"

  ).length;



  const inactiveCount = employees.filter(

    (employee) => employee.status === "Inactive"

  ).length;



  return (

    <div className="min-h-screen bg-[#f5f7fb] p-4 text-slate-800 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-[1500px]">

        {/* Page heading */}

        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-blue-600">

              Workforce Management

            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">

              Employee Management

            </h1>

            <p className="mt-2 text-sm text-slate-500">

              Manage employee profiles, departments and employment status.

            </p>

          </div>



          <button

            type="button"

            onClick={openAddForm}

            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"

          >

            + Add Employee

          </button>

        </header>



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

        {apiError && (

  <div

    role="alert"

    className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"

  >

    {apiError}

  </div>

)}



        {loadingEmployees && (
          <p className="mb-4 text-sm text-slate-500">
            Loading employees from database...
          </p>
        )}

        {/* Employee summary cards */}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {[

            {

              label: "Total Employees",

              value: employees.length,

              icon: "♙",

              color: "bg-blue-50 text-blue-600",

            },

            {

              label: "Active Employees",

              value: activeCount,

              icon: "✓",

              color: "bg-emerald-50 text-emerald-600",

            },

            {

              label: "Inactive Employees",

              value: inactiveCount,

              icon: "◷",

              color: "bg-amber-50 text-amber-600",

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

              <p className="mt-2 text-xs text-slate-400">

                Live database data

              </p>

            </div>

          ))}

        </section>



        {/* Add / Edit employee form */}

        {showForm && (

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="mb-6 flex items-start justify-between gap-4">

              <div>

                <h2 className="text-lg font-bold">

                  {editingId ? "Edit Employee" : "Add New Employee"}

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  Enter the employee details below.

                </p>

              </div>

              <button

                type="button"

                onClick={closeForm}

                aria-label="Close form"

                className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"

              >

                ×

              </button>

            </div>



            <form noValidate onSubmit={handleSubmit}>

              <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">

                <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">

                  {form.photo ? (

                    <img

                      src={form.photo}

                      alt="Employee preview"

                      className="h-full w-full object-cover"

                    />

                  ) : (

                    <div className="text-center">

                      <span className="text-3xl text-slate-300">♙</span>

                      <p className="text-[10px] text-slate-400">No photo</p>

                    </div>

                  )}

                </div>



                <div>

                  <p className="text-sm font-semibold">Profile Photo</p>

                  <p className="mt-1 text-xs text-slate-500">

                    JPG, PNG or another image format. Maximum 3 MB.

                  </p>



                  <div className="mt-3 flex flex-wrap gap-2">

                    <button

                      type="button"

                      onClick={() => fileInputRef.current?.click()}

                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"

                    >

                      Upload Photo

                    </button>



                    {form.photo && (

                      <button

                        type="button"

                        onClick={() => {

                          setForm((previous) => ({ ...previous, photo: "" }));

                          if (fileInputRef.current) {

                            fileInputRef.current.value = "";

                          }

                        }}

                        className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"

                      >

                        Remove Photo

                      </button>

                    )}

                  </div>



                  <input

                    ref={fileInputRef}

                    type="file"

                    accept="image/*"

                    onChange={handlePhotoChange}

                    className="hidden"

                  />



                  {photoError && (

                    <p className="mt-2 text-xs text-red-600">{photoError}</p>

                  )}

                </div>

              </div>



              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <div>

                  <label className="mb-2 block text-sm font-medium">

                    Full Name

                  </label>

                  <input

                    value={form.name}

                    onChange={(event) =>

                      updateField("name", event.target.value)

                    }

                    placeholder="Enter full name"

                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"

                  />

                  {errors.name && (

                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>

                  )}

                </div>



                <div>

                  <label className="mb-2 block text-sm font-medium">

                    Email Address

                  </label>

                  <input

                    value={form.email}

                    onChange={(event) =>

                      updateField("email", event.target.value)

                    }

                    placeholder="name@example.com"

                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"

                  />

                  {errors.email && (

                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>

                  )}

                </div>



                <div>

                  <label className="mb-2 block text-sm font-medium">

                    Phone Number

                  </label>

                  <input

                    value={form.phone}

                    inputMode="numeric"

                    onChange={(event) =>

                      updateField(

                        "phone",

                        event.target.value.replace(/\D/g, "").slice(0, 10)

                      )

                    }

                    placeholder="10-digit phone number"

                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"

                  />

                  {errors.phone && (

                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>

                  )}

                </div>



                <div>

                  <label className="mb-2 block text-sm font-medium">

                    Department

                  </label>

                  <select

                    value={form.department}

                    onChange={(event) =>

                      updateField("department", event.target.value)

                    }

                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"

                  >

                    <option value="">Select department</option>

                    {departments.map((item) => (

                      <option key={item} value={item}>

                        {item}

                      </option>

                    ))}

                  </select>

                  {errors.department && (

                    <p className="mt-1 text-xs text-red-600">

                      {errors.department}

                    </p>

                  )}

                </div>



                <div>

                  <label className="mb-2 block text-sm font-medium">

                    Designation

                  </label>

                  <input

                    value={form.designation}

                    onChange={(event) =>

                      updateField("designation", event.target.value)

                    }

                    placeholder="e.g. Software Developer"

                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"

                  />

                  {errors.designation && (

                    <p className="mt-1 text-xs text-red-600">

                      {errors.designation}

                    </p>

                  )}

                </div>



                <div>

                  <label className="mb-2 block text-sm font-medium">

                    Employment Status

                  </label>

                  <select

                    value={form.status}

                    onChange={(event) =>

                      updateField("status", event.target.value)

                    }

                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"

                  >

                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>

                  </select>

                </div>

              </div>



              <div className="mt-7 flex flex-wrap gap-3">

                <button

                  type="submit"

                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"

                >

                  {editingId ? "Save Changes" : "Save Employee"}

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



        {/* Employee table */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5 sm:p-6">

            <h2 className="text-lg font-bold">All Employees</h2>

            <p className="mt-1 text-sm text-slate-500">

              View and manage employee profiles.

            </p>

          </div>



          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap sm:p-6">

            <input

              value={search}

              onChange={(event) => setSearch(event.target.value)}

              placeholder="Search name, email or employee ID..."

              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 sm:min-w-[240px]"

            />



            <select

              value={departmentFilter}

              onChange={(event) => setDepartmentFilter(event.target.value)}

              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"

            >

              <option value="All">All Departments</option>

              {departments.map((item) => (

                <option key={item} value={item}>

                  {item}

                </option>

              ))}

            </select>



            <select

              value={statusFilter}

              onChange={(event) => setStatusFilter(event.target.value)}

              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"

            >

              <option value="All">All Statuses</option>

              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>

            </select>

          </div>



          <div className="overflow-x-auto px-5 pb-5 sm:px-6 sm:pb-6">

            <table className="w-full min-w-[1050px] text-left text-sm">

              <thead>

                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">

                  <th className="rounded-l-lg px-4 py-4">Employee</th>

                  <th className="px-4 py-4">Employee ID</th>

                  <th className="px-4 py-4">Department</th>

                  <th className="px-4 py-4">Designation</th>

                  <th className="px-4 py-4">Phone</th>

                  <th className="px-4 py-4">Status</th>

                  <th className="rounded-r-lg px-4 py-4">Actions</th>

                </tr>

              </thead>



              <tbody>

                {filteredEmployees.length === 0 ? (

                  <tr>

                    <td

                      colSpan="7"

                      className="px-4 py-12 text-center text-slate-500"

                    >

                      No employees match your search or filters.

                    </td>

                  </tr>

                ) : (

                  filteredEmployees.map((employee) => (

                    <tr

                      key={employee.id}

                      className="border-b border-slate-100 transition hover:bg-slate-50"

                    >

                      <td className="px-4 py-4">

                        <button

                          type="button"

                          onClick={() => setViewEmployee(employee)}

                          className="flex items-center gap-3 text-left"

                        >

                          <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-700">

                            {employee.photo ? (

                              <img

                                src={employee.photo}

                                alt={`${employee.name} profile`}

                                className="h-full w-full object-cover"

                              />

                            ) : (

                              (employee.name || "E").charAt(0).toUpperCase()

                            )}

                          </div>



                          <div>

                            <p className="font-semibold text-slate-800">

                              {employee.name}

                            </p>

                            <p className="mt-1 text-xs text-slate-500">

                              {employee.email}

                            </p>

                          </div>

                        </button>

                      </td>



                      <td className="px-4 py-4 font-medium text-slate-600">

                        {employee.id}

                      </td>

                      <td className="px-4 py-4 text-slate-600">

                        {employee.department}

                      </td>

                      <td className="px-4 py-4 text-slate-600">

                        {employee.designation}

                      </td>

                      <td className="px-4 py-4 text-slate-600">

                        {employee.phone}

                      </td>

                      <td className="px-4 py-4">

                        <span

                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${

                            employee.status === "Active"

                              ? "bg-emerald-50 text-emerald-700"

                              : "bg-slate-100 text-slate-600"

                          }`}

                        >

                          {employee.status}

                        </span>

                      </td>



                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                          <button

                            type="button"

                            onClick={() => openEditForm(employee)}

                            className="rounded-lg border border-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"

                          >

                            Edit

                          </button>

                          <button

                            type="button"

                            onClick={() => setDeleteTarget(employee)}

                            className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"

                          >

                            Delete

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>



        <p className="mt-6 text-center text-xs text-slate-400">

          PayrollHub · Employee Management

        </p>

      </div>



      {/* Employee details modal */}

      {viewEmployee && (

        <div

          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4"

          onClick={() => setViewEmployee(null)}

        >

          <section

            role="dialog"

            aria-modal="true"

            aria-labelledby="employee-details-title"

            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"

            onClick={(event) => event.stopPropagation()}

          >

            <div className="flex items-start justify-between">

              <h2 id="employee-details-title" className="text-lg font-bold">

                Employee Details

              </h2>

              <button

                type="button"

                onClick={() => setViewEmployee(null)}

                aria-label="Close employee details"

                className="text-xl text-slate-500"

              >

                ×

              </button>

            </div>



            <div className="mt-5 flex flex-col items-center text-center">

              <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-blue-100 text-3xl font-bold text-blue-700">

                {viewEmployee.photo ? (

                  <img

                    src={viewEmployee.photo}

                    alt={`${viewEmployee.name} profile`}

                    className="h-full w-full object-cover"

                  />

                ) : (

                  viewEmployee.name.charAt(0).toUpperCase()

                )}

              </div>

              <h3 className="mt-3 text-xl font-bold">{viewEmployee.name}</h3>

              <p className="mt-1 text-sm text-slate-500">

                {viewEmployee.designation}

              </p>

            </div>



            <div className="mt-6 space-y-3 text-sm">

              {[

                ["Employee ID", viewEmployee.id],

                ["Email", viewEmployee.email],

                ["Phone", viewEmployee.phone],

                ["Department", viewEmployee.department],

                ["Status", viewEmployee.status],

              ].map(([label, value]) => (

                <div

                  key={label}

                  className="flex justify-between gap-4 border-b border-slate-100 pb-3"

                >

                  <span className="text-slate-500">{label}</span>

                  <span className="text-right font-medium">{value}</span>

                </div>

              ))}

            </div>



            <button

              type="button"

              onClick={() => {

                const employee = viewEmployee;

                setViewEmployee(null);

                openEditForm(employee);

              }}

              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"

            >

              Edit Employee

            </button>

          </section>

        </div>

      )}



      {/* Delete confirmation modal */}

      {deleteTarget && (

        <div

          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"

          onClick={() => setDeleteTarget(null)}

        >

          <section

            role="dialog"

            aria-modal="true"

            aria-labelledby="delete-confirmation-title"

            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"

            onClick={(event) => event.stopPropagation()}

          >

            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-2xl text-red-600">

              !

            </div>



            <h2

              id="delete-confirmation-title"

              className="mt-4 text-center text-lg font-bold"

            >

              Delete Employee?

            </h2>



            <p className="mt-2 text-center text-sm leading-6 text-slate-500">

              Are you sure you want to remove{" "}

              <span className="font-semibold text-slate-800">

                {deleteTarget.name}

              </span>

              ? This will remove the employee from this frontend preview.

            </p>



            <div className="mt-6 flex gap-3">

              <button

                type="button"

                onClick={() => setDeleteTarget(null)}

                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"

              >

                Cancel

              </button>

              <button

                type="button"

                onClick={confirmDelete}

                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"

              >

                Yes, Delete

              </button>

            </div>

          </section>

        </div>

      )}

    </div>

  );

}



export default Employees;
