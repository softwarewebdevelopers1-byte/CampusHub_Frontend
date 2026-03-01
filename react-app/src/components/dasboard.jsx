import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SideBar } from "./navigations/sidebar.jsx";
import { TopBar } from "./navigations/topbar.jsx";
import "../components.css.styles/dashboard.css";
import ErrorPage from "./error.page.jsx";
import Loader from "./loaders/loader.jsx";

export function Dashboard({ children }) {
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  const [user, setUser] = useState(() => {
    const users = localStorage.getItem("username#campusHub0ZX");
    return JSON.parse(users) || "user";
  });
  const [isLogged, setLogged] = useState(null);
  let locate = useNavigate();
  const [rateLimitError, setRateLimitError] = useState(false); // NEW
  function Locate(linked) {
    setTimeout(() => {
      setLogged(linked);
    });
  }

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/auth/check/logged",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ user: user }),
          },
        );
        if (response.ok) {
          document.title = "CampusHub";
          Locate(true);
          setLogged(true);
        }
        if (response.status === 401) {
          Locate(false);
          document.title = "Login Now !";
          setTimeout(() => {
            locate("/login");
          }, 5000);
          localStorage.removeItem("username#campusHub0ZX");
        }
      } catch (err) {
        Locate(false);
        console.log(err);

        setRateLimitError(true); // show box instead of alert
      }
    };
    checkLogin();
  }, []);

  if (isLogged === null) {
    return <Loader />;
  }

  return (
    <div>
      {isLogged === false ? (
        <ErrorPage />
      ) : (
        <div className="mainContainer">
          <TopBar userName={user} />
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <SideBar
              collapsed={collapsedSidebar}
              setCollapsed={setCollapsedSidebar}
            />
            <main
              userprofile={user}
              className={`main ${collapsedSidebar ? "collapsedSidebar" : "notCollapsed"}`}
            >
              {rateLimitError && (
                <div className="rate-limit-box">
                  <h2>⚠️ Too Many Requests</h2>
                  <p>Please wait a moment before trying again.</p>
                </div>
              )}
              {children}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
