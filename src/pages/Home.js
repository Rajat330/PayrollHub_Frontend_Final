import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      icon: "👥",
      title: "Employee Management",
      description:
        "Manage employee profiles, departments, designations and salary information from one place.",
    },
    {
      icon: "📅",
      title: "Smart Attendance",
      description:
        "Track daily employee attendance with Present, Absent and Leave status.",
    },
    {
      icon: "💰",
      title: "Payroll Management",
      description:
        "Calculate salaries, deductions and net payroll with a clean and organized workflow.",
    },
    {
      icon: "📄",
      title: "Salary Slips",
      description:
        "Generate professional salary slips and keep payroll records organized.",
    },
    {
      icon: "📊",
      title: "Reports & Insights",
      description:
        "Get useful payroll and employee insights through easy-to-read reports.",
    },
    {
      icon: "🔒",
      title: "Centralized Management",
      description:
        "Keep employee, attendance and payroll information together in one system.",
    },
  ];

  const stats = [
    {
      value: "100%",
      label: "Organized Payroll",
    },
    {
      value: "24/7",
      label: "System Access",
    },
    {
      value: "1",
      label: "Unified Platform",
    },
    {
      value: "∞",
      label: "Employee Records",
    },
  ];

  return (
    <div className="overflow-hidden bg-slate-50">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative isolate overflow-hidden bg-slate-950">

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">

          <div className="absolute left-1/2 top-[-250px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute right-[-150px] top-1/3 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="absolute bottom-[-200px] left-[-100px] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />

        </div>


        <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 sm:px-8 lg:px-12 lg:pb-28 lg:pt-28">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Hero Content */}
            <div>

              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 backdrop-blur">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                Modern Payroll Management Platform

              </div>


              {/* Heading */}
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">

                Manage Payroll

                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Smarter. Faster. Better.
                </span>

              </h1>


              {/* Description */}
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">

                PayrollHub brings employees, attendance, salaries,
                payroll and reports together in one powerful
                management platform.

              </p>


              {/* Buttons */}
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500"
                >
                  Get Started

                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>

                </Link>


                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-white/5 px-6 py-3.5 text-sm font-bold text-slate-200 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  Explore Features
                </a>

              </div>


              {/* Trust Text */}
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Easy to use
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Centralized data
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Responsive design
                </div>

              </div>

            </div>


            {/* Dashboard Preview */}
            <div className="relative">

              {/* Glow */}
              <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl">

                {/* Browser Top */}
                <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3">

                  <div className="flex gap-1.5">

                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />

                  </div>

                  <div className="rounded-lg bg-slate-800 px-5 py-1 text-[10px] text-slate-500">
                    payrollhub.local/dashboard
                  </div>

                  <div className="w-10" />

                </div>


                {/* Fake Dashboard */}
                <div className="rounded-b-xl bg-slate-100 p-4 sm:p-6">

                  <div className="flex gap-4">

                    {/* Mini Sidebar */}
                    <div className="hidden w-28 shrink-0 rounded-xl bg-slate-900 p-3 sm:block">

                      <div className="mb-5 flex items-center gap-2">

                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-bold text-white">
                          ₹
                        </div>

                        <div className="h-2 w-12 rounded bg-slate-700" />

                      </div>

                      <div className="space-y-2">

                        <div className="rounded-lg bg-blue-600 px-2 py-2">
                          <div className="h-1.5 w-12 rounded bg-white/70" />
                        </div>

                        <div className="px-2 py-2">
                          <div className="h-1.5 w-14 rounded bg-slate-700" />
                        </div>

                        <div className="px-2 py-2">
                          <div className="h-1.5 w-10 rounded bg-slate-700" />
                        </div>

                        <div className="px-2 py-2">
                          <div className="h-1.5 w-12 rounded bg-slate-700" />
                        </div>

                      </div>

                    </div>


                    {/* Main Dashboard */}
                    <div className="min-w-0 flex-1">

                      <div className="mb-5">

                        <div className="h-3 w-28 rounded bg-slate-800" />

                        <div className="mt-2 h-2 w-40 rounded bg-slate-300" />

                      </div>


                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-white p-4 shadow-sm">

                          <div className="flex items-center justify-between">

                            <div>
                              <div className="h-2 w-16 rounded bg-slate-300" />
                              <div className="mt-2 h-5 w-10 rounded bg-slate-800" />
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm">
                              👥
                            </div>

                          </div>

                        </div>


                        <div className="rounded-xl bg-white p-4 shadow-sm">

                          <div className="flex items-center justify-between">

                            <div>
                              <div className="h-2 w-16 rounded bg-slate-300" />
                              <div className="mt-2 h-5 w-10 rounded bg-emerald-500" />
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-sm">
                              ✓
                            </div>

                          </div>

                        </div>


                        <div className="rounded-xl bg-white p-4 shadow-sm">

                          <div className="flex items-center justify-between">

                            <div>
                              <div className="h-2 w-16 rounded bg-slate-300" />
                              <div className="mt-2 h-5 w-14 rounded bg-indigo-600" />
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm">
                              ₹
                            </div>

                          </div>

                        </div>


                        <div className="rounded-xl bg-white p-4 shadow-sm">

                          <div className="flex items-center justify-between">

                            <div>
                              <div className="h-2 w-16 rounded bg-slate-300" />
                              <div className="mt-2 h-5 w-10 rounded bg-amber-500" />
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-sm">
                              📅
                            </div>

                          </div>

                        </div>

                      </div>


                      {/* Chart */}
                      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">

                        <div className="flex items-center justify-between">

                          <div>
                            <div className="h-2 w-20 rounded bg-slate-300" />
                            <div className="mt-2 h-2 w-28 rounded bg-slate-200" />
                          </div>

                          <div className="h-7 w-16 rounded-lg bg-blue-50" />

                        </div>

                        <div className="mt-5 flex h-20 items-end gap-2">

                          <div className="h-[35%] flex-1 rounded-t bg-blue-100" />
                          <div className="h-[55%] flex-1 rounded-t bg-blue-200" />
                          <div className="h-[45%] flex-1 rounded-t bg-blue-300" />
                          <div className="h-[75%] flex-1 rounded-t bg-blue-400" />
                          <div className="h-[60%] flex-1 rounded-t bg-blue-500" />
                          <div className="h-[90%] flex-1 rounded-t bg-blue-600" />

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ====================================================== */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 px-6 py-8 sm:px-8 lg:grid-cols-4 lg:px-12">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-4 text-center sm:px-6"
            >

              <p className="text-2xl font-black text-slate-900 sm:text-3xl">
                {stat.value}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                {stat.label}
              </p>

            </div>
          ))}

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section
        id="features"
        className="bg-slate-50 py-20 sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Powerful Features
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to manage payroll
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-500">
              From employee management to salary slips, PayrollHub
              gives you all the essential tools in one place.
            </p>

          </div>


          {/* Feature Cards */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {features.map((feature) => (

              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition duration-300 group-hover:bg-blue-600 group-hover:scale-110">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY PAYROLLHUB
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Left */}
            <div>

              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Why PayrollHub
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Simplify your entire payroll workflow
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-500">
                Stop managing employee information across multiple
                files and spreadsheets. PayrollHub gives your team
                a centralized workspace for everyday payroll
                operations.
              </p>


              <div className="mt-8 space-y-5">

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      One centralized system
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Keep employees, attendance and payroll
                      information organized together.
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                    ⚡
                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Faster daily operations
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Reduce repetitive work and manage common
                      payroll tasks faster.
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 font-bold text-violet-600">
                    📊
                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Clear business insights
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Get a quick overview of employees, salaries
                      and attendance.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Right Card */}
            <div className="relative">

              <div className="absolute -inset-4 rounded-3xl bg-blue-100/60 blur-2xl" />

              <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-xl sm:p-7">

                <div className="rounded-2xl bg-slate-950 p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-semibold text-slate-500">
                        MONTHLY PAYROLL
                      </p>

                      <p className="mt-2 text-3xl font-black text-white">
                        ₹8,42,500
                      </p>

                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
                      ₹
                    </div>

                  </div>


                  <div className="mt-8 grid grid-cols-3 gap-3">

                    <div className="rounded-xl bg-white/5 p-4">

                      <p className="text-xs text-slate-500">
                        Employees
                      </p>

                      <p className="mt-2 text-lg font-bold text-white">
                        48
                      </p>

                    </div>

                    <div className="rounded-xl bg-white/5 p-4">

                      <p className="text-xs text-slate-500">
                        Present
                      </p>

                      <p className="mt-2 text-lg font-bold text-emerald-400">
                        42
                      </p>

                    </div>

                    <div className="rounded-xl bg-white/5 p-4">

                      <p className="text-xs text-slate-500">
                        Leaves
                      </p>

                      <p className="mt-2 text-lg font-bold text-amber-400">
                        6
                      </p>

                    </div>

                  </div>


                  <div className="mt-6">

                    <div className="mb-2 flex justify-between text-xs">

                      <span className="text-slate-500">
                        Payroll processed
                      </span>

                      <span className="font-semibold text-blue-400">
                        92%
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">

                      <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

        {/* =====================================================
    HOW IT WORKS
====================================================== */}

<section
  id="how-it-works"
  className="bg-slate-50 py-20 sm:py-24"
>
  <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

    {/* Heading */}
    <div className="mx-auto max-w-2xl text-center">

      <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
        Simple Process
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Manage payroll in three simple steps
      </h2>

      <p className="mt-4 text-base leading-7 text-slate-500">
        PayrollHub keeps your everyday payroll workflow simple,
        organized and easy to manage.
      </p>

    </div>


    {/* Steps */}
    <div className="relative mt-14 grid gap-6 md:grid-cols-3">

      {/* Connecting Line */}
      <div className="absolute left-[16%] right-[16%] top-16 hidden h-px bg-slate-200 md:block" />


      {/* Step 1 */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">

        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-600/20">
          01
        </div>

        <h3 className="mt-6 text-lg font-bold text-slate-900">
          Add Employees
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Create employee profiles with personal,
          department and salary information.
        </p>

      </div>


      {/* Step 2 */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">

        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-600/20">
          02
        </div>

        <h3 className="mt-6 text-lg font-bold text-slate-900">
          Track & Calculate
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Track attendance and manage salary calculations,
          deductions and payroll records.
        </p>

      </div>


      {/* Step 3 */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">

        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-xl font-black text-white shadow-lg shadow-violet-600/20">
          03
        </div>

        <h3 className="mt-6 text-lg font-bold text-slate-900">
          Generate Reports
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Generate salary slips and reports while keeping
          your payroll data organized.
        </p>

      </div>

    </div>

  </div>
</section>


{/* =====================================================
    ABOUT
====================================================== */}

<section
  id="about"
  className="bg-white py-20 sm:py-24"
>
  <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

    <div className="grid items-center gap-14 lg:grid-cols-2">

      {/* About Visual */}
      <div className="relative order-2 lg:order-1">

        <div className="absolute -inset-6 rounded-[2rem] bg-blue-100/60 blur-3xl" />

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-6 shadow-2xl">

          <div className="flex items-center justify-between border-b border-white/10 pb-5">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                PayrollHub
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                Management Overview
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              ₹
            </div>

          </div>


          <div className="mt-6 grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-white/5 p-5">

              <p className="text-xs text-slate-500">
                Employees
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                120+
              </p>

              <p className="mt-1 text-xs text-emerald-400">
                Active records
              </p>

            </div>


            <div className="rounded-2xl bg-white/5 p-5">

              <p className="text-xs text-slate-500">
                Attendance
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                96%
              </p>

              <p className="mt-1 text-xs text-blue-400">
                Tracked daily
              </p>

            </div>


            <div className="rounded-2xl bg-white/5 p-5">

              <p className="text-xs text-slate-500">
                Payroll
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                ₹12L+
              </p>

              <p className="mt-1 text-xs text-violet-400">
                Managed monthly
              </p>

            </div>


            <div className="rounded-2xl bg-white/5 p-5">

              <p className="text-xs text-slate-500">
                Reports
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                Ready
              </p>

              <p className="mt-1 text-xs text-amber-400">
                Anytime
              </p>

            </div>

          </div>


          <div className="mt-5 rounded-2xl bg-white/5 p-5">

            <div className="flex items-center justify-between">

              <span className="text-sm font-semibold text-slate-300">
                Payroll workflow
              </span>

              <span className="text-sm font-bold text-emerald-400">
                Active
              </span>

            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

              <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />

            </div>

          </div>

        </div>

      </div>


      {/* About Content */}
      <div className="order-1 lg:order-2">

        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
          About PayrollHub
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          A smarter workspace for modern payroll management
        </h2>

        <p className="mt-5 text-base leading-8 text-slate-500">
          PayrollHub is designed to bring the essential parts of
          payroll management together in one clean and organized
          platform.
        </p>

        <p className="mt-4 text-base leading-8 text-slate-500">
          From employee records and attendance to payroll,
          salary slips and reports, everything can be managed
          from a centralized workspace.
        </p>


        {/* Highlights */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              ⚡
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              Efficient
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Reduce repetitive payroll management work.
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              ✓
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              Organized
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep important records together and accessible.
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>
</section>

{/* =====================================================
    CONTACT
====================================================== */}

<section
  id="contact"
  className="bg-slate-50 py-20 sm:py-24"
>
  <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

    <div className="grid gap-10 lg:grid-cols-2">

      {/* Left Content */}
      <div>

        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
          Contact Us
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Have questions about PayrollHub?
        </h2>

        <p className="mt-5 max-w-xl text-base leading-8 text-slate-500">
          Whether you want to learn more about the platform or
          need help getting started, we're here to help.
        </p>


        {/* Contact Info */}
        <div className="mt-8 space-y-4">

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg">
              ✉️
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Email
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                support@payrollhub.com
              </p>
            </div>

          </div>


          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg">
              📞
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Phone
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                +91 1800 123 4567
              </p>
            </div>

          </div>


          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg">
              📍
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Office
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                India
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* Contact Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            Send us a message
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            We'll get back to you as soon as possible.
          </p>
        </div>


        <form className="space-y-5">

          <div className="grid gap-5 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Your Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

            </div>

          </div>


          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Subject
            </label>

            <input
              type="text"
              placeholder="How can we help?"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

          </div>


          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Message
            </label>

            <textarea
              rows="5"
              placeholder="Write your message..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

          </div>


          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Send Message →
          </button>

        </form>

      </div>

    </div>

  </div>
</section>

      {/* =====================================================
          CTA
      ====================================================== */}

      {/* <section className="px-6 py-20 sm:px-8 sm:py-24 lg:px-12">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-14 text-center shadow-2xl shadow-blue-600/20 sm:px-12">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-100">
            Get Started
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
            Ready to simplify your payroll management?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Manage employees, attendance and payroll from one
            modern platform.
          </p>

          <div className="mt-8">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-600 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-slate-50"
            >
              Login to Admin Panel
              <span>→</span>
            </Link>

          </div>

        </div>

      </section> */}

    </div>
  );
}

export default Home;