import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ full_name: user.full_name, email: user.email });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get(`/users/${user.id}`);
        setForm({ full_name: response.data.full_name, email: response.data.email });
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      }
    }
    loadProfile();
  }, [user.id]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await api.put(`/users/${user.id}`, form);
      updateUser({ ...user, ...response.data.user });
      setMessage(response.data.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page container">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Your account</p>
        <h1>Profile</h1>
        <p className="profile-role">Account type: <strong>{user.role}</strong></p>
        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}
        <label>Full name<input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <button className="primary-button full" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
      </form>
    </section>
  );
}
