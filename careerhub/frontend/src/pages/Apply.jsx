import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Apply() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ phone: "", cover_letter: "" });
  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then((response) => setJob(response.data))
      .catch((requestError) => setError(getErrorMessage(requestError)));
  }, [id]);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("job_id", id);
    formData.append("phone", form.phone);
    formData.append("cover_letter", form.cover_letter);
    if (cv) formData.append("cv", cv);

    try {
      const response = await api.post("/applications", formData);
      setMessage(response.data.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  if (!job) return <div className="page container status-card">Loading...</div>;

  return (
    <section className="page container">
      <Link className="back-link" to={`/jobs/${id}`}>← Back to job</Link>
      <div className="form-layout">
        <div><p className="eyebrow">Application</p><h1>{job.title}</h1><p>{job.company} · {job.location}</p><p>Applying as <strong>{user.full_name}</strong> ({user.email})</p></div>
        <form className="form-card" onSubmit={submit}>
          {message && <div className="alert success">{message}</div>}
          {error && <div className="alert error">{error}</div>}
          <label>Phone number<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label>
          <label>Cover letter<textarea rows="7" value={form.cover_letter} onChange={(e) => setForm({ ...form, cover_letter: e.target.value })} placeholder="Why are you a good fit?" /></label>
          <label>CV (PDF, DOC, DOCX — max 5 MB)<input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCv(e.target.files[0])} /></label>
          <button className="primary-button full" disabled={loading}>{loading ? "Submitting..." : "Submit Application"}</button>
        </form>
      </div>
    </section>
  );
}
