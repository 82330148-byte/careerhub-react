import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function SavedJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const response = await api.get(`/saved-jobs/${user.id}`);
      setJobs(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function remove(jobId) {
    try {
      await api.delete(`/saved-jobs/${user.id}/${jobId}`);
      setJobs((current) => current.filter((job) => job.id !== jobId));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <section className="page container">
      <div className="page-heading"><p className="eyebrow">Your shortlist</p><h1>Saved Jobs</h1></div>
      {error && <div className="alert error">{error}</div>}
      {jobs.length === 0 ? <div className="status-card">No saved jobs yet. <Link to="/jobs">Browse jobs</Link></div> : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <article className="job-card" key={job.id}>
              <span className="badge">{job.job_type}</span><h2>{job.title}</h2><h3>{job.company}</h3><p>📍 {job.location}</p>
              <div className="card-actions"><Link className="primary-button" to={`/jobs/${job.id}`}>Details</Link><button className="danger-button" onClick={() => remove(job.id)}>Remove</button></div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
