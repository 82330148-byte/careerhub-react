import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const fallback = user.role === "admin" ? "/admin" : "/jobs";
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return <section className="auth-page container">
    <form className="auth-card" onSubmit={submit}>
      <p className="eyebrow">Welcome back</p><h1>Login to CareerHub</h1>
      {error && <div className="alert error">{error}</div>}
      <label>Email<input type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required /></label>
      <label>Password<input type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required /></label>
      <button className="primary-button full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      <p>New here? <Link to="/register">Create an account</Link></p>
    </form>
  </section>;
}
