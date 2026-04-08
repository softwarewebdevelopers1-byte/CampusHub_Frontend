import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AINav } from "./AI.nav";
import "../components.css.styles/home.css";

const API_BASE = "https://campushub-backend-57dg.onrender.com";

export function WelcomePage() {
  const navigate = useNavigate();

  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState("Student");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [latestUploads, setLatestUploads] = useState([]);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setTimeOfDay("morning");
      else if (hour < 18) setTimeOfDay("afternoon");
      else setTimeOfDay("evening");
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  /* 
     Load Username
   */
  useEffect(() => {
    const storedName =
      JSON.parse(localStorage.getItem("username#campusHub0ZX")) || "Student";
    setUserName(storedName);
  }, []);

  /* 
      Real-Time Notifications (Polling)
   */
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          "https://campushub-backend-57dg.onrender.com/api/public/notifications",
          { credentials: "include" },
        );

        if (res.ok) {
          const data = await res.json();
          setNotificationCount(data.count || 0);

          // Sync to localStorage for other tabs
          localStorage.setItem(
            "notificationCount#campusHub0ZX",
            JSON.stringify(data.count || 0),
          );
        }
      } catch (err) {
        console.error("Notification fetch failed");
      }
    };

    fetchNotifications(); // initial load

    const interval = setInterval(fetchNotifications, 8000); // every 8 sec

    return () => clearInterval(interval);
  }, []);

  /* 
      Cross-Tab Sync
   */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "notificationCount#campusHub0ZX") {
        setNotificationCount(JSON.parse(e.newValue) || 0);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchLatestUploads = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/resources/latest/uploads`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setLatestUploads(data.uploads || []);
        }
      } catch (err) {
        console.error("Latest uploads fetch failed");
      }
    };

    fetchLatestUploads();
  }, []);

  const stats = [
    { label: "Active Courses", value: 4, icon: "fas fa-book-open" },
    {
      label: "Upcoming Deadlines/Notifications",
      value: notificationCount,
      icon: "fas fa-calendar-alt",
    },
    { label: "Study Hours", value: "24h", icon: "fas fa-clock" },
  ];

  return (
    <div className="welcome-page">
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>
              Good {timeOfDay}, {userName}
            </h1>
            <p>Stay focused. Let’s make today productive.</p>
          </div>

          <button className="upload-btn" onClick={() => navigate("/sharePDF")}>
            Upload Resource
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <i className={stat.icon}></i>
              <div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="latest-section">
          <div className="latest-header">
            <div>
              <h2>Latest Uploads</h2>
              <p>Newest PDFs and videos shared by lecturers.</p>
            </div>
          </div>

          {latestUploads.length === 0 ? (
            <div className="latest-empty">No uploads available yet.</div>
          ) : (
            <div className="latest-grid">
              {latestUploads.map((item, index) => (
                <article className="latest-card" key={`${item.type}-${index}`}>
                  <span className={`latest-type latest-${item.type}`}>
                    {item.type === "pdf" ? "PDF" : "VIDEO"}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.courseTitle}</p>
                  <div className="latest-meta">
                    <span>{item.unitCode}</span>
                    <span>{item.uploadedBy}</span>
                  </div>
                  <button
                    className="latest-action"
                    onClick={() =>
                      navigate(
                        item.type === "pdf" ? "/simpleSearch" : "/videos",
                      )
                    }
                  >
                    {item.type === "pdf" ? "Open PDF Search" : "Open Videos"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* AI Floating Button */}
      <button
        className="ai-floating-btn"
        onClick={() => setShowChat(!showChat)}
      >
        <i className="fas fa-robot"></i>
      </button>
      {showChat && (
        <div className="AI-cont">
          <AINav user={userName} />
        </div>
      )}
    </div>
  );
}
