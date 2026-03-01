import { useState } from "react";
import styles from "../../components.css.styles/notification.module.css";

function Notification({ notifications }) {
  const [viewAll, setViewAll] = useState(false);

  return (
    <div className={styles.panel}>
      <div
        className={`${styles.wrapper} ${
          viewAll ? styles.expanded : styles.collapsed
        }`}
      >
        <div className={styles.header}>
          <h4>Notifications</h4>
        </div>

        <div className={styles.list}>
          {notifications?.length > 0 ? (
            notifications.map((n) => (
              <div key={n._id} className={styles.item}>
                <p className={styles.title}>{n.title}</p>
                <p className={styles.text}>{n.content}</p>
                <span className={styles.time}>{n.time}</span>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No new updates</p>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.button}
          onClick={() => setViewAll((prev) => !prev)}
        >
          {viewAll ? "View Less" : "View All"}
        </button>
      </div>
    </div>
  );
}

export default Notification;
