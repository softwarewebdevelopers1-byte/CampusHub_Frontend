import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NetworkError() {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);

    // If we're online, try to reload the page
    if (isOnline) {
      window.location.reload();
    } else {
      // If offline, show retry feedback
      setTimeout(() => {
        setIsRetrying(false);
      }, 2000);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Status Icon */}
        <div style={styles.iconContainer}>{isOnline ? "🌐" : "📡"}</div>

        {/* Title with dynamic status */}
        <h1 style={styles.title}>
          {isOnline ? "Server Unreachable" : "No Internet Connection"}
        </h1>

        {/* Main message */}
        <p style={styles.message}>
          {isOnline
            ? "CampusHub can't connect to our servers. This might be temporary."
            : "Your device appears to be offline. Please check your connection."}
        </p>

        {/* Status indicator */}
        <div style={styles.statusContainer}>
          <span style={styles.statusDot(isOnline)}></span>
          <span style={styles.statusText}>
            {isOnline ? "Connected to internet" : "No internet connection"}
          </span>
        </div>

        {/* Action buttons */}
        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryButton}
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? "Checking..." : "Retry Connection"}
          </button>

          <button style={styles.secondaryButton} onClick={handleGoBack}>
            Go Back
          </button>
        </div>

        {/* Simple tip for offline users */}
        {!isOnline && (
          <p style={styles.tip}>
            💡 Tip: Check if Wi-Fi is turned on or try toggling Airplane mode
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow:
      "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  iconContainer: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#1e293b",
  },
  message: {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "20px",
    color: "#475569",
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "30px",
    padding: "12px",
    backgroundColor: "#f1f5f9",
    borderRadius: "100px",
  },
  statusDot: (isOnline) => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: isOnline ? "#22c55e" : "#ef4444",
    display: "inline-block",
  }),
  statusText: {
    fontSize: "14px",
    color: "#334155",
    fontWeight: "500",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  primaryButton: {
    flex: 2,
    padding: "12px 20px",
    backgroundColor: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#ea580c",
    },
    ":disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  secondaryButton: {
    flex: 1,
    padding: "12px 20px",
    backgroundColor: "#fff",
    color: "#334155",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#f8fafc",
    },
  },
  tip: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#fef9c3",
    borderRadius: "10px",
    borderLeft: "3px solid #f97316",
    textAlign: "left",
  },
};
