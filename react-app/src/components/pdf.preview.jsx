export function PreviewPDF({ url, onClose }) {
  if (!url) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Toolbar Header */}
        <div style={styles.toolbar}>
          <span style={styles.fileName}>Document Preview</span>
          <button onClick={onClose} style={styles.closeButton}>
            ✕ Close Preview
          </button>
        </div>

        {/* PDF Viewer */}
        <iframe src={url} title="PDF Preview" style={styles.iframe} />
      </div>
    </div>
  );
}

// Inline styles for quick implementation
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    width: "90%",
    height: "90%",
    backgroundColor: "#fff",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #ddd",
  },
  fileName: {
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.2s",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
};
