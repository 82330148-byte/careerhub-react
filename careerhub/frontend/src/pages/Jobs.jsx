import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    axiosLoad();
  }, []);

  async function axiosLoad() {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  const types = ["All", ...new Set(jobs.map((job) => job.job_type))];
  const filtered = useMemo(
    () => jobs.filter((job) => {
      const matchesText = `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(search.toLowerCase());
      return matchesText && (type === "All" || job.job_type === type);
    }),
    [jobs, search, type]
  );

  async function save(jobId) {
    if (!user) {
      alert("Please log in to save jobs.");
      return;
    }
    try {
      await api.post("/saved-jobs", { user_id: user.id, job_id: jobId });
      alert("Job saved.");
    } catch (requestError) {
      alert(getErrorMessage(requestError));
    }
  }

  return (
    <section className="page container">
      <div className="page-heading">
        <p className="eyebrow">Find your next role</p>
        <h1>Available Jobs</h1>
        <p>Jobs are loaded from MySQL through the Express API.</p>
      </div>
      <div className="filters">
        <input placeholder="Search by title, company, or location" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {types.map((jobType) => <option key={jobType}>{jobType}</option>)}
        </select>
      </div>
      {loading ? <div className="status-card">Loading jobs...</div> : error ? <div className="alert error">{error}</div> : filtered.length === 0 ? <div className="status-card">No jobs match your search.</div> : (
        <div className="jobs-grid">
          {filtered.map((job) => (
            <article className="job-card" key={job.id}>
              <div className="job-card-top"><span className="badge">{job.job_type}</span><button className="icon-button" onClick={() => save(job.id)} title="Save job">♡</button></div>
              <h2>{job.title}</h2><h3>{job.company}</h3><p>📍 {job.location}</p><p>💰 {job.salary || "Salary not specified"}</p>
              <div className="card-actions"><Link className="primary-button" to={`/jobs/${job.id}`}>View Details</Link></div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
