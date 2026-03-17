import { useEffect, useState } from "react";
import styles from "../../components.css.styles/topBar.module.css";
import Notification from "../notifications/notification.jsx";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../loaders/loader.jsx";
export function TopBar({ userName }) {
  const [notification, setNotification] = useState(false);
  const [count, resetCount] = useState(() => {
    const storedCount = localStorage.getItem("notificationCount#campusHub0ZX");
    return storedCount ? JSON.parse(storedCount) : 0;
  });
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false);
  let [loading, resetLoading] = useState(false);
  const [getNotification, setNotifications] = useState("");
  let locate = useNavigate();
  useEffect(() => {
    const fetchNotifications = async () => {
      let notify = await fetch(
        "http://localhost:8000/api/public/notifications",
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (notify.status === 200) {
        let data = await notify.json();
        resetCount(data.count); // IMPORTANT
        setNotifications(data.data);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000); // 10 sec

    return () => clearInterval(interval);
  }, []);
  async function DeleteAccount() {
    setDeleteAccountConfirm(false);
    resetLoading(true);
    try {
      let res = await fetch("http://localhost:8000/auth/delete/account", {
        method: "POST",
        credentials: "include",
      });
      GetInfo(res);
    } catch (error) {
      console.log(`issue: ${error}`);
    } finally {
      resetLoading(false);
    }
  }
  function GetInfo(response) {
    if (response.ok) {
      localStorage.removeItem("username#campusHub0ZX");
      locate("/login");
    }
  }
  async function LogOut() {
    resetLoading(true);
    try {
      let res = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      GetInfo(res);
    } catch (error) {
      console.log(`issue: ${error}`);
    } finally {
      resetLoading(false);
    }
  }
  let LogOutAll = async () => {
    try {
      let res = await fetch("http://localhost:8000/auth/all/logout", {
        method: "POST",
        credentials: "include",
      });
      GetInfo(res);
    } catch (error) {
      console.log(`issue: ${error}`);
    } finally {
      resetLoading(false);
    }
  };
  return (
    <div>
      <nav className={styles.topNav}>
        {loading && (
          <>
            <Loader />
          </>
        )}
        {/* Logo */}
        <div className={styles.logoSection}>
          <i className="fas fa-graduation-cap logo-icon"></i>
          <div className={styles.logo}>CampusHub</div>
        </div>

        {/* Search */}
        <div className={styles.searchBar}>
          <i className={`fas fa-search ${styles.searchIcon}`}></i>
          <input type="text" placeholder="Ask AI or search for resources..." />
        </div>

        {/* Actions */}
        <div className={styles.navActions}>
          <div
            className={styles.notificationBtn}
            onClick={() => {
              // FunctionNotifications();
              setNotification(!notification);
            }}
          >
            <i className="far fa-bell fa-lg"></i>
            <div className={styles.notificationBadge}>{count}</div>
            {/* notification panel */}

            <div className={`${styles.notificationPanel} `}></div>
          </div>
          {notification && (
            <div className={`${styles.notify_panel}`}>
              <Notification notifications={getNotification} />
            </div>
          )}
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {userName?.charAt(0).toUpperCase()}
            </div>

            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <i className="fas fa-chevron-down"></i>
            </div>

            <div className={styles.dropdown}>
              <button className={styles.profileBtn}>View Profile</button>
              <button className={styles.logoutBtn} onClick={LogOut}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
              <button className={styles.logoutBtn} onClick={LogOutAll}>
                <i className="fas fa-sign-out-alt"></i> Logout All Devices
              </button>
              {/* <button
                className={styles.logoutBtn}
                onClick={() => setDeleteAccountConfirm(true)}
              >
                <i className="fas fa-user-times"></i> Delete Account
              </button> */}
              <Link to="/settings" className={styles.logoutBtn}>
                <i
                  className={`fa fa-cog`}
                  style={{paddingRight:"10px"}}
                  aria-hidden="true"
                ></i>
                Settings
              </Link>
            </div>
          </div>
          <button className={`${styles.aiAssistantBtn} ${styles.aiPulse}`}>
            <i className="fas fa-robot"></i>
            <span>AI Assistant</span>
          </button>
        </div>
      </nav>
      {deleteAccountConfirm && (
        <div className={`${styles.accountDelCont}`}>
          <div className={`${styles.deleteAccount}`}>
            <i
              className={`fas fa-times icon-close ${styles.icon}`}
              onClick={() => setDeleteAccountConfirm(false)}
            ></i>
            <p>
              Are you sure{" "}
              <span
                style={{
                  fontWeight: 1000,
                  color: "brown",
                  textDecoration: "underline",
                }}
              >
                {userName}
              </span>{" "}
              you want to delete your account?, This account is currently
              suspended. If recovery is required, please contact the system
              administrator softwarewebdevelopers1@gmail.com . ?
            </p>
            <div className={`${styles.DeleteCont}`}>
              <button onClick={DeleteAccount}> Delete Account</button>
              <button onClick={() => setDeleteAccountConfirm(false)}>
                No, Keep My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
