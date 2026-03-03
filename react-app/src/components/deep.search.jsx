import { useState } from "react";
import styles from "../components.css.styles/deepsearch.module.css";

function DeepPDFSearch() {
  const [unitName, setUnitName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loadState, setLoadState] = useState(false);

  const handleSearch = async () => {
    if (!unitName && !courseCode) return;

    try {
      setLoadState(true);
      let response = await fetch(
        "https://campushub-backend-57dg.onrender.com/api/resources/get/pdf/users",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unitName, courseCode }),
        },
      );

      let data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoadState(false);
    }
  };

  return (
    <div className={styles.pdfSection}>
      <div className={styles.headers}>Deep PDF Search</div>

      <div className={styles.search}>
        <input
          type="text"
          placeholder="Enter Unit Name..."
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Course Code (optional)..."
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Results */}
      <div className={styles.results}>
        {results.length === 0 ? (
          <div className={styles.noResults}>
            {loadState ? "Searching ..." : "No results yet"}
          </div>
        ) : (
          results.map((pdf, index) => (
            <div key={index} className={styles.pdfBox}>
              <h3>{pdf.unitName.toUpperCase()}</h3>
              <p>
                <strong>Code:</strong> {pdf.unitCode}
              </p>
              <p>
                <strong>Uploaded By:</strong> {pdf.from}
              </p>

              <button
                className={styles.viewBtn}
                onClick={() => setSelectedPdf(pdf.pdfUrl)}
              >
                Preview PDF
              </button>
            </div>
          ))
        )}
      </div>

      {/* Iframe Preview Modal */}
      {selectedPdf && (
        <div className={styles.previewOverlay}>
          <div className={styles.previewContainer}>
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedPdf(null)}
            >
              ✕ Close
            </button>

            <iframe
              src={selectedPdf}
              title="PDF Preview"
              className={styles.iframePreview}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { DeepPDFSearch };
