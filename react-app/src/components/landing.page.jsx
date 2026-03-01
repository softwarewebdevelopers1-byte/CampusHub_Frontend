import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import "../components.css.styles/landing.page.css";

const CampusHubLanding = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const features = [
    {
      icon: "🔐",
      title: "Secure Authentication",
      description:
        "Military-grade OTP verification and biometric login options",
    },
    {
      icon: "📊",
      title: "Student Dashboard",
      description:
        "Personalized overview of your academic progress and campus life",
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      description: "Real-time alerts for classes, deadlines, and campus events",
    },
    {
      icon: "📁",
      title: "Document Manager",
      description:
        "Secure upload, storage, and access to all academic documents",
    },
    {
      icon: "📈",
      title: "Performance Tracking",
      description: "Visual analytics of your grades and academic performance",
    },
    {
      icon: "🔗",
      title: "Campus Integration",
      description:
        "Seamless connection with all university systems and services",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up / Login",
      description:
        "Create your account using your university email or student ID",
    },
    {
      number: "02",
      title: "Verify Identity",
      description: "Secure OTP verification sent to your registered contact",
    },
    {
      number: "03",
      title: "Access Services",
      description:
        "Explore all campus services from your personalized dashboard",
    },
  ];

  const benefits = [
    {
      icon: "⚡",
      title: "Fast",
      description: "Lightning-fast performance with optimized load times",
    },
    {
      icon: "🛡️",
      title: "Secure",
      description: "End-to-end encryption and GDPR-compliant data protection",
    },
    {
      icon: "🎯",
      title: "Student-First Design",
      description: "Built with students in mind—intuitive and accessible",
    },
    {
      icon: "📱",
      title: "Responsive",
      description: "Works perfectly on all devices—desktop, tablet, or mobile",
    },
  ];

  return (
    <div className="campus-hub-container">
      {/* Header/Navigation */}
      <header className={`header ${scrollPosition > 50 ? "scrolled" : ""}`}>
        <div className="header-container">
          <div className="logo" onClick={() => scrollToSection("hero")}>
            <span className="logo-icon">🎓</span>
            <span className="logo-text">CampusHub</span>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={isMenuOpen ? "line open" : "line"}></span>
            <span className={isMenuOpen ? "line open" : "line"}></span>
            <span className={isMenuOpen ? "line open" : "line"}></span>
          </button>

          <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
            <ul className="nav-list">
              <li>
                <button onClick={() => scrollToSection("features")}>
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("how-it-works")}>
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("why")}>
                  Why CampusHub
                </button>
              </li>
              <li>
                <button
                  className="nav-login"
                  onClick={() => scrollToSection("cta")}
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  className="nav-signup"
                  onClick={() => scrollToSection("cta")}
                >
                  Sign Up Free
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">Welcome to Smart Campus</span>
          </div>

          <h1 className="hero-title">
            <span className="title-line">CampusHub —</span>
            <span className="title-line">Your Smart Campus Companion</span>
          </h1>

          <p className="hero-subtitle">
            Secure login, smart access, and seamless campus services—all in one
            platform. Designed for students, trusted by universities.
          </p>

          <div className="hero-cta">
            <button
              className="btn btn-primary"
              onClick={() => scrollToSection("cta")}
            >
              <span>Get Started Free</span>
              <span className="btn-icon">→</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => scrollToSection("cta")}
            >
              <span>Login to Dashboard</span>
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Universities</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">250K+</span>
              <span className="stat-label">Active Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need, in One Place</h2>
            <p className="section-subtitle">
              CampusHub integrates all essential campus services into a single,
              user-friendly platform.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="steps-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Simple, Secure, and Fast</h2>
            <p className="section-subtitle">
              Get started with CampusHub in just three easy steps.
            </p>
          </div>

          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CampusHub */}
      <section id="why" className="benefits-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Built for Modern Campus Life</h2>
            <p className="section-subtitle">
              Why thousands of students and universities choose CampusHub.
            </p>
          </div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta-section">
        <div className="section-container">
          <div className="cta-card">
            <h2 className="cta-title">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="cta-subtitle">
              Join thousands of students who are already enjoying seamless
              campus services.
            </p>

            <div className="cta-buttons">
              <button className="btn btn-primary btn-large">
                <Link to="/signup">
                 Create Your Free Account
                </Link>
                <span className="btn-icon">→</span>
              </button>
              <button className="btn btn-outline">
                <span>Schedule a Demo</span>
              </button>
            </div>

            <div className="cta-features">
              <div className="cta-feature">
                <span className="feature-check">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <span className="feature-check">✓</span>
                <span>Free for individual students</span>
              </div>
              <div className="cta-feature">
                <span className="feature-check">✓</span>
                <span>University-wide deployment available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">🎓</span>
                <span className="logo-text">CampusHub</span>
              </div>
              <p className="footer-tagline">
                Empowering modern education through technology.
              </p>
              <div className="social-links">
                <a href="#" aria-label="Twitter" className="social-link">
                  𝕏
                </a>
                <a href="#" aria-label="LinkedIn" className="social-link">
                  in
                </a>
                <a href="#" aria-label="Instagram" className="social-link">
                  📷
                </a>
                <a href="#" aria-label="YouTube" className="social-link">
                  ▶️
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-column-title">Platform</h4>
                <ul>
                  <li>
                    <a href="#">Features</a>
                  </li>
                  <li>
                    <a href="#">How It Works</a>
                  </li>
                  <li>
                    <a href="#">Pricing</a>
                  </li>
                  <li>
                    <a href="#">API</a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-column-title">Company</h4>
                <ul>
                  <li>
                    <a href="#">About</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                  <li>
                    <a href="#">Partners</a>
                  </li>
                  <li>
                    <a href="#">Blog</a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-column-title">Support</h4>
                <ul>
                  <li>
                    <a href="#">Help Center</a>
                  </li>
                  <li>
                    <a href="#">Contact Us</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Terms of Service</a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-column-title">Contact</h4>
                <ul>
                  <li>support@softwarewebdevelopers1@gmail.com</li>
                  <li>+254751433064</li>
                  <li>University Tech Park</li>
                  <li>Education City, EC 10101</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              © {new Date().getFullYear()} CampusHub. All rights reserved.
              Designed for educational institutions worldwide.
            </p>
            <div className="footer-badges">
              <span className="badge">GDPR Compliant</span>
              <span className="badge">ISO 27001 Certified</span>
              <span className="badge">WCAG 2.1 AA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CampusHubLanding;
