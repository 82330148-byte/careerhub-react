import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getErrorMessage } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/register", form);
      navigate("/login", { state: { registered: true } });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page container">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Start your journey</p>
        <h1>Create your account</h1>
        {error && <div className="alert error">{error}</div>}
        <label>
          Full name
          <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="primary-button full" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
        <p>Already registered? <Link to="/login">Login</Link></p>
      </form>
    </section>
  );
}
