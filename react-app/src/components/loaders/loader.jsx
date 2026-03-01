function Loader() {
  const styles = {
    wrapper: {
      display: "flex",
      position: "fixed",
      inset: "0",
      zIndex: "2000", // Ensure it's above everything
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "rgba(15, 23, 42, 0.9)", // Semi-transparent for glass effect
      backdropFilter: "blur(8px)", // Blurs the background content
    },
    cont: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "24px",
    },
    loaderContainer: {
      position: "relative",
      width: "80px",
      height: "80px",
    },
    outerRing: {
      width: "100%",
      height: "100%",
      border: "4px solid transparent",
      borderTop: "4px solid #38bdf8",
      borderRight: "4px solid #38bdf8",
      borderRadius: "50%",
      animation: "spin 0.8s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite",
    },
    innerRing: {
      position: "absolute",
      top: "10px",
      left: "10px",
      width: "60px",
      height: "60px",
      border: "4px solid transparent",
      borderBottom: "4px solid #6366f1",
      borderLeft: "4px solid #6366f1",
      borderRadius: "50%",
      animation: "spin-reverse 1.2s linear infinite",
      opacity: "0.7",
    },
    text: {
      color: "#ffffff",
      fontSize: "20px",
      fontWeight: "600",
      letterSpacing: "2px",
      animation: "pulse 1.5s ease-in-out infinite",
      textShadow: "0 0 10px rgba(56, 189, 248, 0.5)",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.cont}>
        <div style={styles.loaderContainer}>
          <div style={styles.outerRing}></div>
          <div style={styles.innerRing}></div>
        </div>
        <div style={styles.text}>CAMPUSHUB</div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
}

export default Loader;
