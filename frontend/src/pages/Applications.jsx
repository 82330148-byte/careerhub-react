import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/applications/${user.id}`)
      .then((response) => setApplications(response.data))
      .catch((requestError) => setError(getErrorMessage(requestError)));
  }, [user.id]);

  return (
    <section className="page container">
      <div className="page-heading"><p className="eyebrow">Track progress</p><h1>My Applications</h1></div>
      {error && <div className="alert error">{error}</div>}
      {applications.length === 0 ? <div className="status-card">You have not submitted any applications yet.</div> : (
        <div className="table-wrap"><table><thead><tr><th>Job</th><th>Company</th><th>Location</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>{applications.map((application) => <tr key={application.id}><td>{application.title}</td><td>{application.company}</td><td>{application.location}</td><td><span className={`status ${application.status.toLowerCase()}`}>{application.status}</span></td><td>{new Date(application.created_at).toLocaleDateString()}</td></tr>)}</tbody>
        </table></div>
      )}
    </section>
  );
}
