import { useState } from "react";
import styles from "../components.css.styles/simpleSearch.module.css";

function PDFLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState(
    "Search by unit name, unit code, course title, or uploader.",
  );

  const handleSearch = async () => {
    const trimmedSearch = searchTerm.trim();
    if (!trimmedSearch) {
      setResults([]);
      setSearchMessage("Enter a unit name, code, course title, or uploader.");
      return;
    }

    setResults([]);

    try {
      setLoading(true);
      setSearchMessage("Searching for the best matches...");

      const response = await fetch(
        "https://campushub-backend-57dg.onrender.com/api/resources/pdf/users/simple/search",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unitName: trimmedSearch }),
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
            ? `Found ${totalResults} result${totalResults === 1 ? "" : "s"} for "${trimmedSearch}".`
            : `No strong matches found for "${trimmedSearch}". Try unit name, code, or course title keywords.`,
        );
      } else {
        setResults([]);
        setSearchMessage(data.message || "Search failed. Try again.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
      setSearchMessage("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pdfSection}>
      <div className={styles.headers}>PDF Library</div>

      <div style={{ fontWeight: "bold", color: "#fff" }}>
        Find the closest PDF matches across unit names, unit codes, course titles,
        and uploader details.
      </div>

      <div className={styles.AllCategory}>
        <div className={styles.category}>Best Matches</div>
        <div className={styles.category}>Unit Name</div>
        <div className={styles.category}>Unit Code</div>
        <div className={styles.category}>Course Title</div>
        <div className={styles.category}>Uploader</div>
      </div>

      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search by unit name, code, course title, or uploader..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className={styles.noResults}>{loading ? "Searching..." : searchMessage}</div>

      <div className={styles.results}>
        {!loading && results.length === 0 && (
          <div className={styles.noResults}>No PDFs found</div>
        )}

        {results.map((pdf, index) => (
          <div key={pdf._id || index} className={styles.pdfBox}>
            <h3>{pdf.unitName?.toUpperCase() || "UNTITLED UNIT"}</h3>
            <p>
              <strong>Code:</strong> {pdf.unitCode || "N/A"}
            </p>
            <p>
              <strong>Course:</strong> {pdf.courseTitle || "N/A"}
            </p>
            <p>
              <strong>Uploaded By:</strong> {pdf.from || "Unknown"}
            </p>

            <button
              className={styles.viewBtn}
              onClick={() => setSelectedPdf(pdf.pdfUrl)}
            >
              Preview
            </button>
          </div>
        ))}
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

export { PDFLibrary };
