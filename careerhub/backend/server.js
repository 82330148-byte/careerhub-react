import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDirectory = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}
app.use("/uploads", express.static(uploadsDirectory));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDirectory),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Same Week 4 logic: one MySQL connection used by the Express APIs.
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "careerhub_db",
  port: Number(process.env.MYSQLPORT || 3306),
});

db.connect((error) => {
  if (error) {
    console.error("Database connection failed:", error);
    return;
  }
  console.log("Connected to careerhub_db.");
});

function requireFields(values, res) {
  const missing = Object.entries(values).find(([, value]) =>
    value === undefined || value === null || String(value).trim() === ""
  );
  if (missing) {
    res.status(400).json({ message: `${missing[0]} is required.` });
    return false;
  }
  return true;
}

function checkAdmin(userId, callback) {
  const query = "SELECT id, role FROM users WHERE id = ?";
  db.query(query, [userId], (error, rows) => {
    if (error) return callback(error, false);
    callback(null, rows.length > 0 && rows[0].role === "admin");
  });
}

app.get("/", (req, res) => {
  res.json({ message: "CareerHub API is running." });
});

// Authentication
app.post("/register", async (req, res) => {
  const { full_name, email, password } = req.body;
  if (!requireFields({ full_name, email, password }, res)) return;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  db.query("SELECT id FROM users WHERE email = ?", [email], async (error, rows) => {
    if (error) return res.status(500).json({ message: error.message });
    if (rows.length > 0) return res.status(409).json({ message: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, 'user')";
    db.query(query, [full_name, email, hashedPassword], (insertError, result) => {
      if (insertError) return res.status(500).json({ message: insertError.message });
      res.status(201).json({
        message: "Account created successfully.",
        user: { id: result.insertId, full_name, email, role: "user" },
      });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!requireFields({ email, password }, res)) return;

  db.query(
    "SELECT id, full_name, email, password, role FROM users WHERE email = ?",
    [email],
    async (error, rows) => {
      if (error) return res.status(500).json({ message: error.message });
      if (rows.length === 0) return res.status(401).json({ message: "Wrong email or password." });

      const account = rows[0];
      const matches = await bcrypt.compare(password, account.password);
      if (!matches) return res.status(401).json({ message: "Wrong email or password." });

      res.json({
        message: "Login successful.",
        user: {
          id: account.id,
          full_name: account.full_name,
          email: account.email,
          role: account.role,
        },
      });
    }
  );
});


// User profile API - same simple SELECT/UPDATE pattern used in Week 4.
app.get("/users/:id", (req, res) => {
  const query = "SELECT id, full_name, email, role, created_at FROM users WHERE id = ?";
  db.query(query, [req.params.id], (error, rows) => {
    if (error) return res.status(500).json({ message: error.message });
    if (rows.length === 0) return res.status(404).json({ message: "User not found." });
    res.json(rows[0]);
  });
});

app.put("/users/:id", (req, res) => {
  const { full_name, email } = req.body;
  if (!requireFields({ full_name, email }, res)) return;

  const query = "UPDATE users SET full_name = ?, email = ? WHERE id = ?";
  db.query(query, [full_name, email, req.params.id], (error, result) => {
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists." });
    }
    if (error) return res.status(500).json({ message: error.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found." });
    res.json({ message: "Profile updated successfully.", user: { id: Number(req.params.id), full_name, email } });
  });
});

// Jobs APIs (same GET/POST/PUT/DELETE pattern used in Week 4)
app.get("/jobs", (req, res) => {
  const query = "SELECT * FROM jobs ORDER BY created_at DESC";
  db.query(query, (error, data) => {
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  });
});

app.get("/jobs/:id", (req, res) => {
  const query = "SELECT * FROM jobs WHERE id = ?";
  db.query(query, [req.params.id], (error, rows) => {
    if (error) return res.status(500).json({ message: error.message });
    if (rows.length === 0) return res.status(404).json({ message: "Job not found." });
    res.json(rows[0]);
  });
});

app.post("/admin/jobs", (req, res) => {
  const { user_id, title, company, location, job_type, salary, description, requirements } = req.body;
  if (!requireFields({ user_id, title, company, location, job_type, description }, res)) return;

  checkAdmin(user_id, (adminError, isAdmin) => {
    if (adminError) return res.status(500).json({ message: adminError.message });
    if (!isAdmin) return res.status(403).json({ message: "Admin access required." });

    const query = `INSERT INTO jobs
      (title, company, location, job_type, salary, description, requirements)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [title, company, location, job_type, salary || null, description, requirements || null], (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      res.status(201).json({ message: "Job added successfully.", id: result.insertId });
    });
  });
});

app.put("/admin/jobs/:id", (req, res) => {
  const { user_id, title, company, location, job_type, salary, description, requirements } = req.body;
  if (!requireFields({ user_id, title, company, location, job_type, description }, res)) return;

  checkAdmin(user_id, (adminError, isAdmin) => {
    if (adminError) return res.status(500).json({ message: adminError.message });
    if (!isAdmin) return res.status(403).json({ message: "Admin access required." });

    const query = `UPDATE jobs SET title = ?, company = ?, location = ?, job_type = ?,
      salary = ?, description = ?, requirements = ? WHERE id = ?`;
    db.query(query, [title, company, location, job_type, salary || null, description, requirements || null, req.params.id], (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      res.json({ message: "Job updated successfully.", result });
    });
  });
});

app.delete("/admin/jobs/:id", (req, res) => {
  const userId = req.body.user_id;
  checkAdmin(userId, (adminError, isAdmin) => {
    if (adminError) return res.status(500).json({ message: adminError.message });
    if (!isAdmin) return res.status(403).json({ message: "Admin access required." });

    db.query("DELETE FROM jobs WHERE id = ?", [req.params.id], (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      res.json({ message: "Job deleted successfully.", result });
    });
  });
});

// Saved jobs
app.get("/saved-jobs/:userId", (req, res) => {
  const query = `SELECT j.* FROM saved_jobs s
    INNER JOIN jobs j ON s.job_id = j.id
    WHERE s.user_id = ? ORDER BY s.created_at DESC`;
  db.query(query, [req.params.userId], (error, rows) => {
    if (error) return res.status(500).json({ message: error.message });
    res.json(rows);
  });
});

app.post("/saved-jobs", (req, res) => {
  const { user_id, job_id } = req.body;
  if (!requireFields({ user_id, job_id }, res)) return;
  const query = "INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)";
  db.query(query, [user_id, job_id], (error, result) => {
    if (error?.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Job is already saved." });
    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json({ message: "Job saved successfully.", result });
  });
});

app.delete("/saved-jobs/:userId/:jobId", (req, res) => {
  const query = "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?";
  db.query(query, [req.params.userId, req.params.jobId], (error, result) => {
    if (error) return res.status(500).json({ message: error.message });
    res.json({ message: "Saved job removed.", result });
  });
});

// Applications with CV upload, following Week 4 multer/FormData logic.
app.post("/applications", upload.single("cv"), (req, res) => {
  const { user_id, job_id, phone, cover_letter } = req.body;
  if (!requireFields({ user_id, job_id, phone }, res)) return;
  const cvPath = req.file ? req.file.filename : null;

  const query = `INSERT INTO applications
    (user_id, job_id, phone, cover_letter, cv_path)
    VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [user_id, job_id, phone, cover_letter || null, cvPath], (error, result) => {
    if (error?.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "You already applied for this job." });
    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json({ message: "Application submitted successfully.", result });
  });
});

app.get("/applications/:userId", (req, res) => {
  const query = `SELECT a.*, j.title, j.company, j.location
    FROM applications a INNER JOIN jobs j ON a.job_id = j.id
    WHERE a.user_id = ? ORDER BY a.created_at DESC`;
  db.query(query, [req.params.userId], (error, rows) => {
    if (error) return res.status(500).json({ message: error.message });
    res.json(rows);
  });
});

// Contact messages
app.post("/contact", (req, res) => {
  const { full_name, email, subject, message } = req.body;
  if (!requireFields({ full_name, email, subject, message }, res)) return;
  const query = "INSERT INTO contact_messages (full_name, email, subject, message) VALUES (?, ?, ?, ?)";
  db.query(query, [full_name, email, subject, message], (error, result) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json({ message: "Message sent successfully.", result });
  });
});

// Admin dashboard data
app.get("/admin/dashboard/:userId", (req, res) => {
  checkAdmin(req.params.userId, (adminError, isAdmin) => {
    if (adminError) return res.status(500).json({ message: adminError.message });
    if (!isAdmin) return res.status(403).json({ message: "Admin access required." });

    const countQueries = {
      users: "SELECT COUNT(*) AS total FROM users",
      jobs: "SELECT COUNT(*) AS total FROM jobs",
      applications: "SELECT COUNT(*) AS total FROM applications",
      contact_messages: "SELECT COUNT(*) AS total FROM contact_messages",
    };

    const counts = {};
    const entries = Object.entries(countQueries);
    let completed = 0;
    let failed = false;

    entries.forEach(([key, query]) => {
      db.query(query, (error, rows) => {
        if (failed) return;
        if (error) {
          failed = true;
          return res.status(500).json({ message: error.message });
        }
        counts[key] = rows[0].total;
        completed += 1;
        if (completed === entries.length) {
          const applicationsQuery = `SELECT a.*, u.full_name, u.email, j.title, j.company
            FROM applications a
            INNER JOIN users u ON a.user_id = u.id
            INNER JOIN jobs j ON a.job_id = j.id
            ORDER BY a.created_at DESC LIMIT 20`;
          db.query(applicationsQuery, (applicationsError, applications) => {
            if (applicationsError) return res.status(500).json({ message: applicationsError.message });
            db.query("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 20", (messagesError, messages) => {
              if (messagesError) return res.status(500).json({ message: messagesError.message });
              res.json({ counts, applications, messages });
            });
          });
        }
      });
    });
  });
});

app.put("/admin/applications/:id", (req, res) => {
  const { user_id, status } = req.body;
  checkAdmin(user_id, (adminError, isAdmin) => {
    if (adminError) return res.status(500).json({ message: adminError.message });
    if (!isAdmin) return res.status(403).json({ message: "Admin access required." });
    db.query("UPDATE applications SET status = ? WHERE id = ?", [status, req.params.id], (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      res.json({ message: "Application status updated.", result });
    });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CareerHub backend is running on port ${PORT}`);
});
