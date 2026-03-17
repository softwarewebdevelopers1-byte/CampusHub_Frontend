import { useState } from "react";
import styles from "../components.css.styles/settings.module.css";

function Settings() {
  const [username, setUsername] = useState("Carlos");
  const [email, setEmail] = useState("carlos@example.com");
  const [notifications, setNotifications] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 🔹 Update profile info
  const handleProfileUpdate = (e) => {
    e.preventDefault();

    console.log({ username, email, notifications });
    alert("Profile updated successfully!");
  };

  // 🔹 Change password
  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log({ currentPassword, newPassword });
    alert("Password changed successfully!");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // 🔹 Delete account
  const handleDeleteAccount = () => {
    console.log("Account deleted");
    alert("Account deleted!");

    // TODO: Call backend delete route
  };

  return (
    <div className={styles.settingsContainer}>
      <h2 className={styles.title}>Account Settings</h2>

      {/* ================= PROFILE SECTION ================= */}
      <form onSubmit={handleProfileUpdate} className={styles.form}>
        <h3>Profile Information</h3>

        <label className={styles.label}>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          Enable Notifications
        </label>

        <button type="submit" className={styles.button}>
          Save Profile
        </button>
      </form>

      {/* ================= PASSWORD SECTION ================= */}
      <form onSubmit={handlePasswordChange} className={styles.form}>
        <h3>Change Password</h3>

        <label className={styles.label}>
          Current Password:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.button}>
          Update Password
        </button>
      </form>

      {/* ================= DANGER ZONE ================= */}
      <div className={styles.dangerZone}>
        <h3>Danger Zone</h3>

        {!showDeleteConfirm ? (
          <button
            className={styles.deleteButton}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        ) : (
          <div className={styles.confirmBox}>
            <p>Are you sure? This action cannot be undone.</p>

            <button
              className={styles.confirmDelete}
              onClick={handleDeleteAccount}
            >
              Yes, Delete
            </button>

            <button
              className={styles.cancelDelete}
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
