
function Contact() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative isolate overflow-hidden px-6 py-20 text-center sm:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-180px] h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Get in Touch
        </span>

        <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Let's talk about
          <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            PayrollHub.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400 sm:text-lg">
          Have a question or suggestion? Send us a message and let us know
          how we can help.
        </p>
      </section>

      <section className="border-t border-white/5 bg-slate-900/50 px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              CONTACT PAYROLLHUB
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              We'd love to hear from you.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-slate-400">
              Whether you have questions about employee management,
              attendance or payroll, use the form to get in touch with us.
            </p>

            <div className="mt-9 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-blue-400/30">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  ✉️
                </div>
                <div>
                  <h3 className="font-bold">Email Support</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Send your enquiry using the contact form.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-400/30">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl">
                  💬
                </div>
                <div>
                  <h3 className="font-bold">Questions & Feedback</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Share your questions and suggestions with us.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-indigo-400/30">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                  🛡️
                </div>
                <div>
                  <h3 className="font-bold">PayrollHub Support</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    We're here to help you with your enquiry.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Contact form design is ready. Backend will be connected later.");
            }}
            className="relative rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-9"
          >
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                SEND A MESSAGE
              </p>
              <h3 className="mt-3 text-2xl font-black">
                How can we help?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Fill in the details below.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Message
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <button
                type="submit"
                className="group w-full rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Send Message <span className="ml-1">→</span>
              </button>

              <p className="text-center text-xs text-slate-500">
                Your contact form is currently a frontend preview.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
