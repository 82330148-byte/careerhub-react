import { useState } from "react";
import { api, getErrorMessage } from "../services/api";

export default function Contact() {
  const [form, setForm] = useState({ full_name: "", email: "", subject: "", message: "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const response = await api.post("/contact", form);
      setNotice(response.data.message);
      setForm({ full_name: "", email: "", subject: "", message: "" });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <section className="page container">
      <div className="page-heading"><p className="eyebrow">Contact us</p><h1>We would love to hear from you</h1></div>
      <div className="form-layout">
        <div className="contact-panel"><h2>CareerHub Support</h2><p>📧 support@careerhub.com</p><p>📞 +961 70 000 000</p><p>📍 Beirut, Lebanon</p><p>Monday–Friday, 9:00 AM–5:00 PM</p></div>
        <form className="form-card" onSubmit={submit}>
          {notice && <div className="alert success">{notice}</div>}{error && <div className="alert error">{error}</div>}
          <label>Full name<input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Subject<input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></label>
          <label>Message<textarea rows="6" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></label>
          <button className="primary-button full">Send Message</button>
        </form>
      </div>
    </section>
  );
}
