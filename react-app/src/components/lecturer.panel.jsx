import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components.css.styles/lecturer.module.css";

const API_BASE_URL = "https://campushub-backend-57dg.onrender.com";

const initialPdfState = {
  courseTitle: "",
  unitName: "",
  unitCode: "",
};

const initialVideoState = {
  courseTitle: "",
  unitName: "",
  unitCode: "",
};

const sections = [
  { id: "overview", label: "Main Page" },
  { id: "pdfs", label: "Upload PDFs" },
  { id: "videos", label: "Upload Videos" },
];

export default function LecturerPanel() {
  const navigate = useNavigate();
  const pdfInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [pdfFile, setPdfFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [pdfForm, setPdfForm] = useState(initialPdfState);
  const [videoForm, setVideoForm] = useState(initialVideoState);
  const [uploads, setUploads] = useState([]);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadLatestUploads = async () => {
    const response = await fetch(`${API_BASE_URL}/api/resources/latest/uploads`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Unable to load latest uploads");
    }

    setUploads(result.uploads || []);
  };

  useEffect(() => {
    const bootLecturerDashboard = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/lecturer/check/logged`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          navigate("/login");
          return;
        }

        await loadLatestUploads();
      } catch (bootError) {
        navigate("/login");
      } finally {
        setLoadingUploads(false);
      }
    };

    bootLecturerDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/auth/lecturer/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("username#campusHub0ZX");
    localStorage.removeItem("user");
    localStorage.removeItem("role#campusHub0ZX");
    navigate("/login");
  };

  const handlePdfFormChange = (event) => {
    const { name, value } = event.target;
    setPdfForm((current) => ({ ...current, [name]: value }));
  };

  const handleVideoFormChange = (event) => {
    const { name, value } = event.target;
    setVideoForm((current) => ({ ...current, [name]: value }));
  };

  const uploadPdf = async (event) => {
    event.preventDefault();

    if (
      !pdfFile ||
      !pdfForm.courseTitle ||
      !pdfForm.unitName ||
      !pdfForm.unitCode
    ) {
      setError("Select a PDF and complete all PDF fields.");
      return;
    }

    setUploadingPdf(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("courseTitle", pdfForm.courseTitle);
    formData.append("unitName", pdfForm.unitName);
    formData.append("unitCode", pdfForm.unitCode);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resources/upload/users/data/pdf`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to upload PDF");
      }

      setMessage("PDF uploaded successfully");
      setPdfFile(null);
      setPdfForm(initialPdfState);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      await loadLatestUploads();
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload PDF");
    } finally {
      setUploadingPdf(false);
    }
  };

  const uploadVideo = async (event) => {
    event.preventDefault();

    if (
      !videoFile ||
      !videoForm.courseTitle ||
      !videoForm.unitName ||
      !videoForm.unitCode
    ) {
      setError("Select a video and complete all video fields.");
      return;
    }

    setUploadingVideo(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("courseTitle", videoForm.courseTitle);
    formData.append("unitName", videoForm.unitName);
    formData.append("unitCode", videoForm.unitCode);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/upload/video`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to upload video");
      }

      setMessage("Video uploaded successfully");
      setVideoFile(null);
      setVideoForm(initialVideoState);
      if (videoInputRef.current) videoInputRef.current.value = "";
      await loadLatestUploads();
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const renderOverview = () => (
    <>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>CampusHub Lecturer</p>
          <h1>Lecturer Dashboard</h1>
          <p className={styles.heroText}>
            Upload course PDFs and videos, then track the newest resources that
            students can discover from search and their dashboard.
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span>Total latest uploads shown</span>
          <strong>{uploads.length}</strong>
        </article>
        <article className={styles.statCard}>
          <span>PDF uploads</span>
          <strong>{uploads.filter((item) => item.type === "pdf").length}</strong>
        </article>
        <article className={styles.statCard}>
          <span>Video uploads</span>
          <strong>
            {uploads.filter((item) => item.type === "video").length}
          </strong>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.panelEyebrow}>Recent uploads</p>
            <h2>Latest shared materials</h2>
          </div>
        </div>

        {loadingUploads ? (
          <div className={styles.emptyState}>Loading uploads...</div>
        ) : uploads.length === 0 ? (
          <div className={styles.emptyState}>No uploads available yet.</div>
        ) : (
          <div className={styles.uploadsGrid}>
            {uploads.map((item, index) => (
              <article key={`${item.type}-${item.fileUrl}-${index}`} className={styles.uploadCard}>
                <div className={styles.uploadType}>
                  {item.type === "pdf" ? "PDF" : "VIDEO"}
                </div>
                <h3>{item.title}</h3>
                <p>{item.courseTitle}</p>
                <div className={styles.metaLine}>
                  <span>{item.unitCode}</span>
                  <span>{item.uploadedBy}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );

  const renderPdfUpload = () => (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelEyebrow}>Upload PDFs</p>
          <h2>Share learning documents</h2>
        </div>
      </div>

      <form className={styles.form} onSubmit={uploadPdf}>
        <label className={styles.field}>
          <span>Course title</span>
          <input
            name="courseTitle"
            value={pdfForm.courseTitle}
            onChange={handlePdfFormChange}
            placeholder="Bsc in Computer Science"
          />
        </label>
        <label className={styles.field}>
          <span>Unit name</span>
          <input
            name="unitName"
            value={pdfForm.unitName}
            onChange={handlePdfFormChange}
            placeholder="Systems Analysis"
          />
        </label>
        <label className={styles.field}>
          <span>Unit code</span>
          <input
            name="unitCode"
            value={pdfForm.unitCode}
            onChange={handlePdfFormChange}
            placeholder="INF 2201"
          />
        </label>
        <label className={styles.field}>
          <span>Select PDF</span>
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            onChange={(event) => setPdfFile(event.target.files?.[0] || null)}
          />
        </label>
        <button className={styles.primaryButton} type="submit">
          {uploadingPdf ? "Uploading..." : "Upload PDF"}
        </button>
      </form>
    </section>
  );

  const renderVideoUpload = () => (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelEyebrow}>Upload Videos</p>
          <h2>Share lecture videos</h2>
        </div>
      </div>

      <form className={styles.form} onSubmit={uploadVideo}>
        <label className={styles.field}>
          <span>Course title</span>
          <input
            name="courseTitle"
            value={videoForm.courseTitle}
            onChange={handleVideoFormChange}
            placeholder="Bsc in Information Science"
          />
        </label>
        <label className={styles.field}>
          <span>Unit name</span>
          <input
            name="unitName"
            value={videoForm.unitName}
            onChange={handleVideoFormChange}
            placeholder="Database Systems"
          />
        </label>
        <label className={styles.field}>
          <span>Unit code</span>
          <input
            name="unitCode"
            value={videoForm.unitCode}
            onChange={handleVideoFormChange}
            placeholder="INS 3104"
          />
        </label>
        <label className={styles.field}>
          <span>Select Video</span>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
          />
        </label>
        <button className={styles.primaryButton} type="submit">
          {uploadingVideo ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </section>
  );

  const renderSection = () => {
    if (activeSection === "pdfs") return renderPdfUpload();
    if (activeSection === "videos") return renderVideoUpload();
    return renderOverview();
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div>
            <p className={styles.sidebarEyebrow}>CampusHub</p>
            <h2>Lecturer Desk</h2>
          </div>
          <nav className={styles.sidebarNav}>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`${styles.sidebarLink} ${activeSection === section.id ? styles.sidebarLinkActive : ""}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </aside>

        <main className={styles.mainContent}>
          {message && <div className={styles.successBanner}>{message}</div>}
          {error && <div className={styles.errorBanner}>{error}</div>}
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
