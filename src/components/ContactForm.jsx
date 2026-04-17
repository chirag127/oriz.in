import { useState } from "react";

const initialState = { name: "", email: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    setStatus("Thanks. Your message is ready to send to hello@oriz.in.");
    setValues(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="surface space-y-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-ink">
          <span>Name</span>
          <input
            type="text"
            name="name"
            required
            value={values.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none ring-0 transition focus:border-brand"
            placeholder="Your name"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-ink">
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            value={values.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none ring-0 transition focus:border-brand"
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label className="block space-y-2 text-sm font-medium text-ink">
        <span>Message</span>
        <textarea
          name="message"
          required
          rows="6"
          value={values.message}
          onChange={handleChange}
          className="w-full rounded-3xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none ring-0 transition focus:border-brand"
          placeholder="Tell us what you are building and how Oriz can help."
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate">For direct email, write to hello@oriz.in.</p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-w-40 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
      {status && <p className="rounded-2xl bg-brand/5 px-4 py-3 text-sm text-brand">{status}</p>}
    </form>
  );
}
