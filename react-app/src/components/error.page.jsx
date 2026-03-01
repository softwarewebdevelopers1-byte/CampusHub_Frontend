import React, { useEffect, useState } from "react";
import "../components.css.styles/error.page.css";

const ErrorPage = () => {
  // creating the title
  // document.title = "Error page";
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const usefulLinks = [
    { path: "/", label: "Homepage", description: "Back to main dashboard" },
    { path: "/login", label: "Login", description: "Access your account" },
  ];

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };
  function changePage() {}

  return (
    <div className="error-page">
      {/* Animated Background */}
      <div className="error-background">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="floating-particle"
            style={{
              left: `${particle.x}vw`,
              top: `${particle.y}vh`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${10 / particle.speed}s`,
            }}
          />
        ))}

        {/* Gradient Background */}
        <div
          className="gradient-overlay"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(74, 222, 128, 0.15) 0%, 
              rgba(10, 31, 58, 0) 50%)`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="error-container">
        <header className="error-header">
          <div className="error-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">CampusHub</span>
          </div>
        </header>

        <main className="error-content">
          <div className="error-illustration">
            <div className="error-number">
              <span className="digit digit-4">4</span>
              <div className="planet-container">
                <div className="planet">
                  <div className="planet-ring"></div>
                  <div className="planet-core"></div>
                </div>
              </div>
              <span className="digit digit-4">4</span>
            </div>

            <div className="satellite">
              <div className="satellite-body"></div>
              <div className="satellite-panel"></div>
              <div className="satellite-signal"></div>
            </div>

            <div className="orbit-path"></div>
          </div>

          <div className="error-text">
            <h1 className="error-title">Page Not Found</h1>
            <p className="error-subtitle">
              Oops! It looks like you've navigated to an unknown part of the
              campus. The page you're looking for might have been moved or
              doesn't exist.
            </p>

            <div className="error-cta">
              <button className="btn btn-primary" onClick={handleGoBack}>
                <span className="btn-icon">←</span>
                <span>Go Back</span>
              </button>
              <button className="btn btn-secondary" onClick={handleGoHome}>
                <span>Return Home</span>
                <span className="btn-icon">🏠</span>
              </button>
            </div>
          </div>
        </main>

        {/* Useful Links Section */}
        <section className="useful-links">
          <h3 className="links-title">Quick Navigation</h3>
          <p className="links-subtitle">
            Here are some useful links that might help you find what you're
            looking for:
          </p>

          <div className="links-grid">
            {usefulLinks.map((link, index) => (
              <a
                key={index}
                href={link.path}
                className="link-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="link-icon">
                  {index === 0 && "🏠"}
                  {index === 1 && "🔐"}
                  {index === 2 && "📊"}
                  {index === 3 && "📚"}
                  {index === 4 && "👤"}
                  {index === 5 && "❓"}
                </div>
                <div className="link-content">
                  <h4 className="link-label">{link.label}</h4>
                  <p className="link-description">{link.description}</p>
                </div>
                <div className="link-arrow">→</div>
              </a>
            ))}
          </div>
        </section>

        {/* Search Bar */}
        <section className="search-section">
          <h3 className="search-title">Can't find what you're looking for?</h3>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search CampusHub..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  window.location.href = `${e.target.value}`;
                }
              }}
            />
          </div>
        </section>

        {/* Error Details (Collapsible) */}
        <details className="error-details">
          <summary className="details-summary">
            <span>Technical Details</span>
            <span className="details-icon">▼</span>
          </summary>
          <div className="details-content">
            <div className="detail-item">
              <span className="detail-label">Error Code:</span>
              <span className="detail-value">404 - Page Not Found</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current URL:</span>
              <span className="detail-value">{window.location.href}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Timestamp:</span>
              <span className="detail-value">
                {new Date().toLocaleString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">User Agent:</span>
              <span className="detail-value">{navigator.userAgent}</span>
            </div>

            <button
              className="btn btn-small"
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              📋 Copy Error Details
            </button>
          </div>
        </details>

        <footer className="error-footer">
          <p>
            Still having trouble? Contact our{" "}
            <a href="/support" className="footer-link">
              support team
            </a>{" "}
            or check our{" "}
            <a href="/help" className="footer-link">
              help center
            </a>
            .
          </p>
          <p className="copyright">© {new Date().getFullYear()} CampusHub</p>
        </footer>
      </div>
    </div>
  );
};

export default ErrorPage;
