import { useState } from "react";
import styles from "../components.css.styles/pdf.module.css";

function PDFLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setResults([]);

    try {
      setLoading(true);

      let response = await fetch(
        "http://localhost:8000/api/resources/pdf/users/simple/search",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unitName: searchTerm }),
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
      setLoading(false);
    }
  };

  return (
    <div className={styles.pdfSection}>
      <div className={styles.headers}>PDF Library</div>

      <div style={{ fontWeight: "bold", color: "#fff" }}>
        Here you can access and manage your PDF resources.
      </div>

      {/* Categories */}
      <div className={styles.AllCategory}>
        <div className={styles.category}>New</div>
        <div className={styles.category}>Informatics</div>
        <div className={styles.category}>Information Science</div>
        <div className={styles.category}>Computer Science</div>
        <div className={styles.category}>Computer Graphics</div>
      </div>

      {/* Search */}
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search PDFs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Loading */}
      {loading && <div className={styles.noResults}>Searching...</div>}

      {/* Results */}
      <div className={styles.results}>
        {!loading && results.length === 0 && (
          <div className={styles.noResults}>No PDFs found</div>
        )}

        {results.map((pdf, index) => (
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
              Preview
            </button>
          </div>
        ))}
      </div>

      {/* Iframe Preview */}
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

export { PDFLibrary };
