import { useDeferredValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components.css.styles/admin.module.css";

const API_BASE_URL = "http://localhost:8000";

const initialFormState = {
  role: "Student",
  email: "",
  password: "",
  userName: "",
  fullName: "",
};

const initialAnnouncementState = {
  title: "",
  content: "",
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcementLoading, setAnnouncementLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [formData, setFormData] = useState(initialFormState);
  const [announcementForm, setAnnouncementForm] = useState(
    initialAnnouncementState,
  );
  const deferredSearch = useDeferredValue(search);

  const loadUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      navigate("/login");
      return;
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Unable to load users");
    }

    setUsers(result.users || []);
  };

  const loadAnnouncements = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/get/notifications`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      navigate("/login");
      return;
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Unable to load announcements");
    }

    setAnnouncements(result.data || []);
  };

  useEffect(() => {
    const bootDashboard = async () => {
      try {
        const sessionResponse = await fetch(
          `${API_BASE_URL}/auth/check/admin/logged`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!sessionResponse.ok) {
          navigate("/login");
          return;
        }

        await Promise.all([loadUsers(), loadAnnouncements()]);
      } catch (bootError) {
        navigate("/login");
      } finally {
        setLoading(false);
        setAnnouncementLoading(false);
      }
    };

    bootDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout/admin/logout`, {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("username#campusHub0ZX");
    localStorage.removeItem("user");
    localStorage.removeItem("role#campusHub0ZX");
    navigate("/login");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleAnnouncementFormChange = (event) => {
    const { name, value } = event.target;
    setAnnouncementForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          role: formData.role,
          email: formData.email,
          password: formData.password,
          userName: formData.role === "Student" ? formData.userName : undefined,
          fullName:
            formData.role === "Lecturer" ? formData.fullName : undefined,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to create user");
      }

      setMessage(result.message || "User created successfully");
      setFormData(initialFormState);
      await loadUsers();
    } catch (createError) {
      setError(createError.message || "Unable to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleAccountState = async (user) => {
    if (user.role === "Admin") return;

    const nextState = user.account_state === "Active" ? "Inactive" : "Active";

    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: user.email,
          role: user.role,
          account_state: nextState,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update user");
      }

      setMessage(result.message || "User updated");
      await loadUsers();
    } catch (updateError) {
      setError(updateError.message || "Unable to update user");
    }
  };

  const handlePublishAnnouncement = async (event) => {
    event.preventDefault();
    if (postingAnnouncement) return;

    setPostingAnnouncement(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/send/notifications`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(announcementForm),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to publish announcement");
      }

      setMessage(result.message || "Announcement sent successfully");
      setAnnouncementForm(initialAnnouncementState);
      await loadAnnouncements();
    } catch (announcementError) {
      setError(announcementError.message || "Unable to publish announcement");
    } finally {
      setPostingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (content) => {
    try {
      setError("");
      setMessage("");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/delete/notification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: content }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete announcement");
      }

      setMessage(result.message || "Announcement deleted");
      await loadAnnouncements();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete announcement");
    }
  };

  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesSearch =
      !normalizedSearch ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      user.displayName.toLowerCase().includes(normalizedSearch);

    return matchesRole && matchesSearch;
  });

  const totalUsers = users.length;
  const studentCount = users.filter((user) => user.role === "Student").length;
  const lecturerCount = users.filter((user) => user.role === "Lecturer").length;
  const adminCount = users.filter((user) => user.role === "Admin").length;
  const activeAccounts = users.filter(
    (user) => user.account_state === "Active",
  ).length;
  const inactiveAccounts = users.filter(
    (user) => user.account_state === "Inactive",
  ).length;
  const latestUsers = [...users].slice(-5).reverse();

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>CampusHub Admin</p>
            <h1>Operations Dashboard</h1>
            <p className={styles.heroText}>
              Manage accounts, activate or suspend access, and broadcast
              announcements from one control center.
            </p>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </header>

        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <span>Total Accounts</span>
            <strong>{totalUsers}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Students</span>
            <strong>{studentCount}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Lecturers</span>
            <strong>{lecturerCount}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Admins</span>
            <strong>{adminCount}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Active</span>
            <strong>{activeAccounts}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Inactive</span>
            <strong>{inactiveAccounts}</strong>
          </article>
        </section>

        {message && <div className={styles.successBanner}>{message}</div>}
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.contentGrid}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Create Account</p>
                <h2>Add a new user</h2>
              </div>
            </div>

            <form className={styles.form} onSubmit={handleCreateUser}>
              <label className={styles.field}>
                <span>Role</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                >
                  <option value="Student">Student</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>

              {formData.role === "Student" && (
                <label className={styles.field}>
                  <span>Student name</span>
                  <input
                    name="userName"
                    type="text"
                    value={formData.userName}
                    onChange={handleFormChange}
                    placeholder="Enter student display name"
                    required
                  />
                </label>
              )}

              {formData.role === "Lecturer" && (
                <label className={styles.field}>
                  <span>Lecturer full name</span>
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    placeholder="Enter lecturer full name"
                    required
                  />
                </label>
              )}

              <label className={styles.field}>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="name@campushub.com"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Temporary password</span>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Create a secure temporary password"
                  required
                />
              </label>

              <button className={styles.primaryButton} type="submit">
                {saving ? "Creating..." : "Create user"}
              </button>
            </form>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Users</p>
                <h2>Manage accounts</h2>
              </div>
              <p className={styles.mutedText}>
                Filter by role and search by name or email.
              </p>
            </div>

            <div className={styles.toolbar}>
              <input
                className={styles.searchInput}
                type="search"
                placeholder="Search users"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select
                className={styles.filterSelect}
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="All">All roles</option>
                <option value="Student">Students</option>
                <option value="Lecturer">Lecturers</option>
                <option value="Admin">Admins</option>
              </select>
            </div>

            {loading ? (
              <div className={styles.emptyState}>Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className={styles.emptyState}>No users match this filter.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Account</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={`${user.role}-${user.email}`}>
                        <td>{user.displayName}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.status}</td>
                        <td>
                          <span
                            className={
                              user.account_state === "Active"
                                ? styles.activeBadge
                                : styles.inactiveBadge
                            }
                          >
                            {user.account_state}
                          </span>
                        </td>
                        <td>
                          {user.role === "Admin" ? (
                            <span className={styles.lockedAction}>Protected</span>
                          ) : (
                            <button
                              className={styles.rowAction}
                              onClick={() => handleAccountState(user)}
                            >
                              {user.account_state === "Active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className={styles.secondaryGrid}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Broadcast</p>
                <h2>Send announcement</h2>
              </div>
            </div>

            <form className={styles.form} onSubmit={handlePublishAnnouncement}>
              <label className={styles.field}>
                <span>Announcement title</span>
                <input
                  name="title"
                  type="text"
                  value={announcementForm.title}
                  onChange={handleAnnouncementFormChange}
                  placeholder="Important update title"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Message</span>
                <textarea
                  className={styles.textArea}
                  name="content"
                  value={announcementForm.content}
                  onChange={handleAnnouncementFormChange}
                  placeholder="Write the announcement details here"
                  required
                />
              </label>

              <button className={styles.primaryButton} type="submit">
                {postingAnnouncement ? "Publishing..." : "Publish"}
              </button>
            </form>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Recent Accounts</p>
                <h2>Latest activity</h2>
              </div>
            </div>

            <div className={styles.activityList}>
              {latestUsers.length === 0 ? (
                <div className={styles.emptyState}>No recent accounts.</div>
              ) : (
                latestUsers.map((user) => (
                  <article
                    key={`activity-${user.role}-${user.email}`}
                    className={styles.activityItem}
                  >
                    <div>
                      <h3>{user.displayName}</h3>
                      <p>{user.email}</p>
                    </div>
                    <div className={styles.activityMeta}>
                      <span>{user.role}</span>
                      <span>{user.account_state}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelEyebrow}>Published</p>
              <h2>Your announcements</h2>
            </div>
            <p className={styles.mutedText}>
              Review and remove notifications sent from this admin account.
            </p>
          </div>

          {announcementLoading ? (
            <div className={styles.emptyState}>Loading announcements...</div>
          ) : announcements.length === 0 ? (
            <div className={styles.emptyState}>No announcements yet.</div>
          ) : (
            <div className={styles.announcementList}>
              {announcements.map((announcement) => (
                <article
                  key={`${announcement.title}-${announcement.time}-${announcement.content}`}
                  className={styles.announcementCard}
                >
                  <div className={styles.announcementTop}>
                    <div>
                      <h3>{announcement.title}</h3>
                      <p>{announcement.time}</p>
                    </div>
                    <button
                      className={styles.secondaryButton}
                      onClick={() =>
                        handleDeleteAnnouncement(announcement.content)
                      }
                    >
                      Delete
                    </button>
                  </div>
                  <p className={styles.announcementContent}>
                    {announcement.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
