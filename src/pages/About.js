
import { Link } from "react-router-dom";

function About() {
  const highlights = [
    {
      icon: "👥",
      title: "Employee Management",
      text: "Keep employee profiles, departments and salary information organized in one place.",
    },
    {
      icon: "📅",
      title: "Smart Attendance",
      text: "Maintain attendance records and simplify everyday workforce tracking.",
    },
    {
      icon: "₹",
      title: "Payroll Management",
      text: "Organize salary details, payroll records and employee compensation.",
    },
    {
      icon: "📊",
      title: "Reports & Insights",
      text: "Get a clearer overview of your workforce and payroll operations.",
    },
  ];

  return (
    <div className="overflow-hidden bg-slate-950 text-white">
      <section className="relative isolate overflow-hidden px-6 py-20 sm:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-[-100px] top-1/3 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute bottom-[-150px] left-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            About PayrollHub
          </span>

          <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Payroll management,
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              made simpler.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            PayrollHub brings employee information, attendance, salaries and
            payroll workflows together in one organized platform.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Get Started →
            </Link>

            <Link
              to="/contact"
              className="rounded-xl border border-slate-700 bg-white/5 px-7 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-slate-900/60 px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              WHO WE ARE
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
              One workspace for your payroll needs.
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Managing employee details, attendance and salary information
              separately can become difficult. PayrollHub is designed to
              bring these everyday tasks into one organized digital workspace.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              Our focus is a clear, accessible experience that helps teams
              manage workforce information and payroll activities more easily.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Centralized employee information",
                "Organized attendance records",
                "Simplified payroll workflows",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 font-bold text-emerald-400">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-blue-500/10 blur-2xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                    PAYROLLHUB
                  </p>
                  <h3 className="mt-2 text-xl font-bold">
                    Workforce Overview
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-black">
                  ₹
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  ["Employees", "Profiles", "👥", "bg-blue-500/10"],
                  ["Attendance", "Tracking", "📅", "bg-emerald-500/10"],
                  ["Payroll", "Organization", "₹", "bg-indigo-500/10"],
                  ["Reports", "Insights", "📊", "bg-cyan-500/10"],
                ].map(([title, value, icon, color]) => (
                  <div
                    key={title}
                    className={`rounded-2xl border border-white/5 ${color} p-5`}
                  >
                    <span className="text-xl">{icon}</span>
                    <p className="mt-4 text-sm text-slate-400">{title}</p>
                    <p className="mt-1 font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">
                    Payroll workflow
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    Organized
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">
                Illustrative dashboard preview
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              WHAT WE FOCUS ON
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Essential tools, one platform.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              A consistent workflow for the everyday tasks involved in
              workforce and payroll management.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                    {item.icon}
                  </span>
                  <span className="text-xs font-bold tracking-widest text-slate-600">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-700/30 via-indigo-700/30 to-cyan-700/20 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl font-black sm:text-4xl">
              Let's make payroll simpler.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
              Explore PayrollHub and discover a more organized way to manage
              workforce information.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                Login to PayrollHub →
              </Link>

              <Link
                to="/contact"
                className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
