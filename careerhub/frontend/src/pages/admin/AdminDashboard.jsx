import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const emptyJob = {
  title: "",
  company: "",
  location: "",
  job_type: "Full-time",
  salary: "",
  description: "",
  requirements: "",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ counts: {}, applications: [], messages: [] });
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [dashboardResponse, jobsResponse] = await Promise.all([
        api.get(`/admin/dashboard/${user.id}`),
        api.get("/jobs"),
      ]);
      setData(dashboardResponse.data);
      setJobs(jobsResponse.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function saveJob(event) {
    event.preventDefault();
    try {
      const body = { ...form, user_id: user.id };
      if (editingId) {
        await api.put(`/admin/jobs/${editingId}`, body);
      } else {
        await api.post("/admin/jobs", body);
      }
      setForm(emptyJob);
      setEditingId(null);
      load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  function edit(job) {
    setEditingId(job.id);
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      job_type: job.job_type,
      salary: job.salary || "",
      description: job.description,
      requirements: job.requirements || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`, { data: { user_id: user.id } });
      load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function changeStatus(id, status) {
    try {
      await api.put(`/admin/applications/${id}`, { user_id: user.id, status });
      load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <section className="page container admin-page">
      <div className="page-heading"><p className="eyebrow">Management</p><h1>Admin Dashboard</h1></div>
      {error && <div className="alert error">{error}</div>}
      <div className="stats-grid">
        <div><strong>{data.counts.users || 0}</strong><span>Users</span></div>
        <div><strong>{data.counts.jobs || 0}</strong><span>Jobs</span></div>
        <div><strong>{data.counts.applications || 0}</strong><span>Applications</span></div>
        <div><strong>{data.counts.contact_messages || 0}</strong><span>Messages</span></div>
      </div>
      <div className="admin-grid">
        <form className="form-card" onSubmit={saveJob}>
          <h2>{editingId ? "Edit Job" : "Add New Job"}</h2>
          {["title", "company", "location", "salary"].map((key) => (
            <label key={key}>{key.replace("_", " ")}<input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key !== "salary"} /></label>
          ))}
          <label>Job type<select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })}><option>Full-time</option><option>Part-time</option><option>Remote</option><option>Internship</option><option>Contract</option></select></label>
          <label>Description<textarea rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
          <label>Requirements<textarea rows="4" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></label>
          <div className="card-actions"><button className="primary-button">{editingId ? "Update Job" : "Add Job"}</button>{editingId && <button type="button" className="secondary-button" onClick={() => { setEditingId(null); setForm(emptyJob); }}>Cancel</button>}</div>
        </form>
        <div className="admin-list"><h2>Manage Jobs</h2>{jobs.map((job) => <article className="compact-card" key={job.id}><div><strong>{job.title}</strong><p>{job.company} · {job.location}</p></div><div className="card-actions"><button className="secondary-button small" onClick={() => edit(job)}>Edit</button><button className="danger-button small" onClick={() => remove(job.id)}>Delete</button></div></article>)}</div>
      </div>
      <h2 className="section-title">Recent Applications</h2>
      <div className="table-wrap"><table><thead><tr><th>Applicant</th><th>Job</th><th>Contact</th><th>Status</th></tr></thead><tbody>{data.applications.map((application) => <tr key={application.id}><td>{application.full_name}<br /><small>{application.email}</small></td><td>{application.title}<br /><small>{application.company}</small></td><td>{application.phone}</td><td><select value={application.status} onChange={(e) => changeStatus(application.id, e.target.value)}><option>Pending</option><option>Reviewed</option><option>Accepted</option><option>Rejected</option></select></td></tr>)}</tbody></table></div>
      <h2 className="section-title">Contact Messages</h2>
      <div className="message-grid">{data.messages.map((message) => <article className="compact-card message-card" key={message.id}><strong>{message.subject}</strong><p>{message.message}</p><small>{message.full_name} · {message.email}</small></article>)}</div>
    </section>
  );
}
