import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-label">Build your future</p>

        <h1>Find the right job for your career</h1>

        <p className="hero-description">
          Explore job opportunities, search by title, filter by job type, and
          save the positions that interest you.
        </p>

        <div className="hero-buttons">
          <Link to="/jobs" className="primary-button">
            Browse Jobs
          </Link>

          <Link to="/saved" className="secondary-button">
            View Saved Jobs
          </Link>
        </div>
      </div>

      <div className="hero-card">
        <h2>CareerHub</h2>
      

        <div className="hero-stat">
          <strong>4+</strong>
          <span>Available Jobs</span>
        </div>

        <div className="hero-stat">
          <strong>3</strong>
          <span>Job Types</span>
        </div>

        <div className="hero-stat">
                  </div>
      </div>
    </section>
  );
}

export default Home;