import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>CareerHub</h2>

          <p>
            Helping job seekers find the right career opportunities.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/saved">Saved Jobs</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p>support@careerhub.com</p>
          <p>Beirut, Lebanon</p>
          <p>+961 70 000 000</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 CareerHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;