import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../../components.css.styles/sideBar.module.css";

export function SideBar({ collapsed, setCollapsed }) {
  const location = useLocation();
  // controls the collapse state for my sidebar
  const [collapsedLink, setCollapsedLink] = useState(true);
  function changeTitle(Title) {
    document.title = Title;
  }
  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* Hamburger */}
      <div
        className={styles.hamburger}
        onClick={() => setCollapsed(!collapsed)}
      >
        <i className="fas fa-bars"></i>
      </div>

      {/* Navigation */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarTitle}>
          <span>Navigation</span>
          <i className="fas fa-compress-alt"></i>
        </div>

        <ul className={styles.sidebarMenu}>
          <li>
            <Link
              to="/homepage"
              className={location.pathname === "/homepage" ? styles.active : ""}
              onClick={() => {
                changeTitle("Home");
              }}
            >
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/myCollection"
              className={
                location.pathname === "/myCollection" ? styles.active : ""
              }
            >
              <i className="fas fa-book-open"></i>
              <span>My Collection</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={() => {
                setCollapsedLink(!collapsedLink);
              }}
              className={
                location.pathname === "/simpleSearch" ||
                location.pathname === "/deepsearch" ||
                location.pathname === "/AISummary" ||
                location.pathname === "/sharePDF"
                  ? styles.active
                  : ""
              }
            >
              <i className="fas fa-file-pdf"></i>
              <span>
                PDF Library{" "}
                {collapsedLink ? (
                  <i className="fas fa-angle-right"></i>
                ) : (
                  <i className="fas fa-angle-down"></i>
                )}
              </span>
            </Link>
            <div>
              {/* Nested Links */}
              <ul
                className={`${styles.nestedMenu} ${collapsedLink ? "" : styles.activeLink}`}
              >
                <li>
                  <Link
                    to="/simpleSearch"
                    className={
                      location.pathname === "/simpleSearch" ? styles.active : ""
                    }
                    onClick={() => {
                      changeTitle("PDF Library-Simple Search");
                    }}
                  >
                    Simple Search
                  </Link>
                  <Link
                    to="/deepsearch"
                    className={
                      location.pathname === "/deepsearch" ? styles.active : ""
                    }
                    onClick={() => {
                      changeTitle("PDF Library-Deep Search");
                    }}
                  >
                    Deep Search
                  </Link>
                </li>
                <li>
                  <Link
                    to="/AISummary"
                    className={
                      location.pathname === "/AISummary" ? styles.active : ""
                    }
                    onClick={() => {
                      changeTitle("PDF Library-AI Summary");
                    }}
                  >
                    AI Summary
                  </Link>
                  <Link
                    to="/sharePDF"
                    className={
                      location.pathname === "/sharePDF" ? styles.active : ""
                    }
                    onClick={() => {
                      changeTitle("PDF Library-Share PDF");
                    }}
                  >
                    Share PDF
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link to="/videos">
              <i className="fas fa-video"></i>
              <span>Lecture Videos</span>
            </Link>
          </li>
          <li>
            <Link to="/notes">
              <i className="fas fa-sticky-note"></i>
              <span>My Notes</span>
            </Link>
          </li>
          <li>
            <Link to="/groups">
              <i className="fas fa-users"></i>
              <span>Study Groups</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Academic Progress */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarTitle}>
          <span>Academic Progress</span>
          <i className="fas fa-chart-line"></i>
        </div>

        <div className={styles.courseProgress}>
          <div className={`${styles.progressRing} ${styles.engineering}`}>
            75%
          </div>
          <div className={styles.progressInfo}>
            <h4>Engineering</h4>
            <p>3 courses in progress</p>
          </div>
        </div>

        <div className={styles.courseProgress}>
          <div className={`${styles.arts} ${styles.progressRing}`}>60%</div>
          <div className={styles.progressInfo}>
            <h4>Arts & Humanities</h4>
            <p>2 courses completed</p>
          </div>
        </div>

        <div className={styles.courseProgress}>
          <div className={`${styles.sciences} ${styles.progressRing}`}>85%</div>
          <div className={styles.progressInfo}>
            <h4>Sciences</h4>
            <p>4 courses in progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
