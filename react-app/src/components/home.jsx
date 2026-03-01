import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components.css.styles/home.css";

export function WelcomePage({ userprofile }) {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState("User");
  const [timeOfDay, setTimeOfDay] = useState("");
  useEffect(() => {
    // Determine time of day for greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    // Simulate user data fetch
    let storedName =
      JSON.parse(localStorage.getItem("username#campusHub0ZX")) || "User";
    setUserName(storedName);
  }, []);

  const handleUploadClick = () => {
    navigate("/sharePDF");
    document.title = "PDF Library-Share PDF";
  };

  const handleResourceClick = (resourceId) => {
    navigate(`/resource/${resourceId}`);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleAIQuestion = () => {
    setShowChat(true);
  };

  const stats = {
    resourcesViewed: 47,
    studyHours: 24.5,
    upcomingDeadlines: 3,
    coursesEnrolled: 5,
    studyGroups: 2,
  };

  const recentActivities = [
    {
      id: 1,
      type: "pdf",
      title: "Quantum Mechanics Lecture Notes",
      course: "Physics 301",
      time: "2 hours ago",
      color: "#EF4444",
    },
    {
      id: 2,
      type: "video",
      title: "Organic Chemistry Lab Demo",
      course: "Chemistry 205",
      time: "Yesterday",
      color: "#3B82F6",
    },
    {
      id: 3,
      type: "notes",
      title: "Calculus III Problem Set",
      course: "Mathematics 303",
      time: "2 days ago",
      color: "#10B981",
    },
    {
      id: 4,
      type: "pdf",
      title: "Data Structures Slides",
      course: "CS 201",
      time: "3 days ago",
      color: "#EF4444",
    },
  ];

  const aiRecommendations = [
    {
      id: 1,
      title: "Upcoming Exam Prep",
      summary:
        "Based on your study patterns, I've identified key topics for your Calculus final. Focus on integration techniques and series convergence.",
      course: "MATH 303",
      action: "Study Plan",
    },
    {
      id: 2,
      title: "Related Video Lecture",
      summary:
        "This 45-minute video covers quantum entanglement concepts that complement the PDF you read yesterday.",
      course: "PHYS 401",
      action: "Watch Now",
    },
  ];

  const courses = [
    {
      id: 1,
      name: "Calculus III",
      code: "MATH 303",
      department: "Engineering",
      progress: 75,
      resources: 20,
      color: "#3B82F6",
    },
    {
      id: 2,
      name: "Modern Literature",
      code: "ENGL 205",
      department: "Arts",
      progress: 60,
      resources: 13,
      color: "#F59E0B",
    },
    {
      id: 3,
      name: "Organic Chemistry",
      code: "CHEM 301",
      department: "Sciences",
      progress: 85,
      resources: 25,
      color: "#10B981",
    },
    {
      id: 4,
      name: "Data Structures",
      code: "CS 201",
      department: "Computer Science",
      progress: 45,
      resources: 18,
      color: "#8B5CF6",
    },
  ];

  const quickActions = [
    {
      id: 1,
      icon: "fas fa-plus",
      title: "Create Study Session",
      color: "#3B82F6",
    },
    {
      id: 2,
      icon: "fas fa-search",
      title: "Find Study Group",
      color: "#10B981",
    },
    {
      id: 3,
      icon: "fas fa-download",
      title: "Download Materials",
      color: "#F59E0B",
    },
    {
      id: 4,
      icon: "fas fa-chart-bar",
      title: "View Analytics",
      color: "#8B5CF6",
    },
  ];

  return (
    <div className="welcome-page">
      {/* Main Content */}
      <div className="main-content">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="welcome-message">
            <h1>
              Good {timeOfDay}, {userName}!
            </h1>
            <p>Here's your personalized learning dashboard for today.</p>
          </div>
          <button className="upload-btn" onClick={handleUploadClick}>
            <i className="fas fa-cloud-upload-alt"></i>
            Upload Resource
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="stats-grid">
          {[
            {
              label: "Resources Viewed",
              value: stats.resourcesViewed,
              icon: "fas fa-eye",
              color: "#3B82F6",
            },
            {
              label: "Study Hours",
              value: `${stats.studyHours}h`,
              icon: "fas fa-clock",
              color: "#10B981",
            },
            {
              label: "Upcoming Deadlines",
              value: stats.upcomingDeadlines,
              icon: "fas fa-calendar-exclamation",
              color: "#EF4444",
            },
            {
              label: "Active Courses",
              value: stats.coursesEnrolled,
              icon: "fas fa-book-open",
              color: "#8B5CF6",
            },
          ].map((stat, index) => (
            <div className="stat-card" key={index}>
              <div
                className="stat-icon"
                style={{
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                <i className={stat.icon}></i>
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Three Column Layout */}
        <div className="dashboard-columns">
          {/* Left Column - Recent Activity */}
          <div className="dashboard-column">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-history"></i> Recent Activity
                </h3>
                <a href="/activity" className="view-all">
                  View All <i className="fas fa-arrow-right"></i>
                </a>
              </div>
              <div className="activity-list">
                {recentActivities.map((activity) => (
                  <div
                    className="activity-item"
                    key={activity.id}
                    onClick={() => handleResourceClick(activity.id)}
                  >
                    <div
                      className="activity-icon"
                      style={{
                        backgroundColor: `${activity.color}20`,
                        color: activity.color,
                      }}
                    >
                      <i
                        className={`fas fa-${activity.type === "video" ? "video" : activity.type === "notes" ? "sticky-note" : "file-pdf"}`}
                      ></i>
                    </div>
                    <div className="activity-info">
                      <h4>{activity.title}</h4>
                      <p>
                        {activity.course} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-bolt"></i> Quick Actions
                </h3>
              </div>
              <div className="quick-actions-grid">
                {quickActions.map((action) => (
                  <div
                    className="action-card"
                    key={action.id}
                    style={{ borderLeftColor: action.color }}
                    onClick={() => alert(`Opening: ${action.title}`)}
                  >
                    <div
                      className="action-icon"
                      style={{ color: action.color }}
                    >
                      <i className={action.icon}></i>
                    </div>
                    <p>{action.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - AI Recommendations */}
          <div className="dashboard-column">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-robot"></i> AI Recommendations
                </h3>
                <span className="ai-badge">Powered by AI</span>
              </div>
              <div className="recommendations-list">
                {aiRecommendations.map((rec) => (
                  <div className="recommendation-card" key={rec.id}>
                    <div className="recommendation-header">
                      <h4>{rec.title}</h4>
                      <i
                        className="fas fa-lightbulb"
                        style={{ color: "#F59E0B" }}
                      ></i>
                    </div>
                    <p className="recommendation-summary">{rec.summary}</p>
                    <div className="recommendation-footer">
                      <span className="course-tag">{rec.course}</span>
                      <button
                        className="action-btn"
                        onClick={() => alert(`Opening ${rec.action}`)}
                      >
                        {rec.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Progress */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-chart-line"></i> Study Progress
                </h3>
              </div>
              <div className="progress-chart">
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Weekly Goal</span>
                    <span>75%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Resources Completed</span>
                    <span>60%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="study-tip">
                <i className="fas fa-lightbulb"></i>
                <p>
                  You're on track! Try studying at consistent times each day for
                  better retention.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Courses */}
          <div className="dashboard-column">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-graduation-cap"></i> My Courses
                </h3>
                <a href="/courses" className="view-all">
                  View All <i className="fas fa-arrow-right"></i>
                </a>
              </div>
              <div className="courses-list">
                {courses.map((course) => (
                  <div
                    className="course-card"
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="course-header">
                      <div
                        className="course-icon"
                        style={{
                          backgroundColor: `${course.color}20`,
                          color: course.color,
                        }}
                      >
                        {course.department === "Engineering" ? (
                          <i className="fas fa-calculator"></i>
                        ) : course.department === "Arts" ? (
                          <i className="fas fa-book"></i>
                        ) : course.department === "Sciences" ? (
                          <i className="fas fa-flask"></i>
                        ) : (
                          <i className="fas fa-laptop-code"></i>
                        )}
                      </div>
                      <div className="course-info">
                        <h4>{course.name}</h4>
                        <p>
                          {course.code} • {course.resources} resources
                        </p>
                      </div>
                    </div>
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${course.progress}%`,
                            backgroundColor: course.color,
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {course.progress}% complete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-calendar-alt"></i> Upcoming Deadlines
                </h3>
              </div>
              <div className="deadlines-list">
                <div className="deadline-item urgent">
                  <div className="deadline-info">
                    <h4>Calculus Assignment</h4>
                    <p>Integration Techniques • MATH 303</p>
                  </div>
                  <div className="deadline-time">
                    <span className="time-badge">2 days</span>
                  </div>
                </div>
                <div className="deadline-item warning">
                  <div className="deadline-info">
                    <h4>Chemistry Lab Report</h4>
                    <p>Organic Compounds • CHEM 301</p>
                  </div>
                  <div className="deadline-time">
                    <span className="time-badge">5 days</span>
                  </div>
                </div>
                <div className="deadline-item normal">
                  <div className="deadline-info">
                    <h4>Literature Essay</h4>
                    <p>Modern Analysis • ENGL 205</p>
                  </div>
                  <div className="deadline-time">
                    <span className="time-badge">1 week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Chat Widget */}
      {showChat && (
        <div className="ai-chat-widget">
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <i className="fas fa-robot"></i>
              CampusHub AI Assistant
            </div>
            <button className="close-chat" onClick={() => setShowChat(false)}>
              ×
            </button>
          </div>
          <div className="ai-chat-body">
            <div className="ai-message">
              <strong>Hello {userName}!</strong> I'm your AI learning assistant.
              I can help you:
              <ul>
                <li>Find resources for your courses</li>
                <li>Summarize complex topics</li>
                <li>Create study plans</li>
                <li>Answer questions about your materials</li>
              </ul>
              How can I help you today?
            </div>
          </div>
          <div className="ai-chat-input">
            <input
              type="text"
              placeholder="Ask me anything about your courses..."
            />
            <button>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
