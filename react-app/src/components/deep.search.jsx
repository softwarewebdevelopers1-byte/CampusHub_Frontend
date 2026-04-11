import { useState } from "react";
import styles from "../components.css.styles/deepsearch.module.css";

function DeepPDFSearch() {
  const [unitName, setUnitName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loadState, setLoadState] = useState(false);
  const [searchMessage, setSearchMessage] = useState(
    "Use unit name for topic intent and unit code for precision.",
  );

  const handleSearch = async () => {
    const trimmedUnitName = unitName.trim();
    const trimmedCourseCode = courseCode.trim();

    if (!trimmedUnitName && !trimmedCourseCode) {
      setResults([]);
      setSearchMessage("Add a unit name, a unit code, or both.");
      return;
    }

    try {
      setLoadState(true);
      setSearchMessage("Searching and ranking the strongest matches...");

      const response = await fetch(
        "https://campushub-backend-57dg.onrender.com/api/resources/get/pdf/users",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unitName: trimmedUnitName,
            courseCode: trimmedCourseCode,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        const nextResults = Array.isArray(data.data) ? data.data : [];
        const totalResults =
          typeof data.total === "number" ? data.total : nextResults.length;

        setResults(nextResults);
        setSearchMessage(
          totalResults > 0
            ? `Found ${totalResults} ranked result${totalResults === 1 ? "" : "s"}.`
            : "No strong matches found. Try a more exact unit name or unit code.",
        );
      } else {
        setResults([]);
        setSearchMessage(data.message || "Search failed.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
      setSearchMessage("Search failed. Please try again.");
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
          placeholder="Enter unit name or topic..."
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <input
          type="text"
          placeholder="Enter unit code for precision..."
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className={styles.noResults}>
        {loadState ? "Searching..." : searchMessage}
      </div>

      <div className={styles.results}>
        {results.length === 0 ? (
          <div className={styles.noResults}>
            {loadState ? "Searching ..." : "No results yet"}
          </div>
        ) : (
          results.map((pdf, index) => (
            <div key={pdf._id || index} className={styles.pdfBox}>
              <h3>{pdf.unitName?.toUpperCase() || "UNTITLED UNIT"}</h3>
              <p>
                <strong>Code:</strong> {pdf.unitCode || "N/A"}
              </p>
              <p>
                <strong>Course:</strong> {pdf.courseTitle || pdf.course || "N/A"}
              </p>
              <p>
                <strong>Uploaded By:</strong> {pdf.from || "Unknown"}
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

      {selectedPdf && (
        <div className={styles.previewOverlay}>
          <div className={styles.previewContainer}>
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedPdf(null)}
            >
              Close
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
