import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, getErrorMessage } from "../services/api";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then((response) => setJob(response.data))
      .catch((requestError) => setError(getErrorMessage(requestError)));
  }, [id]);

  if (error) return <div className="page container alert error">{error}</div>;
  if (!job) return <div className="page container status-card">Loading job...</div>;

  return (
    <section className="page container">
      <Link className="back-link" to="/jobs">← Back to jobs</Link>
      <article className="details-card">
        <span className="badge">{job.job_type}</span><h1>{job.title}</h1><h2>{job.company}</h2>
        <div className="job-meta"><span>📍 {job.location}</span><span>💰 {job.salary || "Not specified"}</span></div>
        <hr /><h3>Job Description</h3><p className="preline">{job.description}</p><h3>Requirements</h3>
        <p className="preline">{job.requirements || "Requirements will be discussed during the interview."}</p>
        <Link className="primary-button" to={`/apply/${job.id}`}>Apply Now</Link>
      </article>
    </section>
  );
}
