import { useEffect, useState } from "react";
import styles from "../components.css.styles/pdf.module.css";

function MyCollection() {
  const [myPdfs, setMyPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); // 'date', 'name', 'code'
  const [filteredPdfs, setFilteredPdfs] = useState([]);

  useEffect(() => {
    const fetchMyPdfs = async () => {
      try {
        setLoading(true);
        let response = await fetch(
          "https://campushub-backend-57dg.onrender.com/api/users/get/own/pdfs",
          {
            method: "GET",
            credentials: "include",
          },
        );

        let data = await response.json();
        console.log(data);
        

        if (response.status === 200) {
          setMyPdfs(data);
          setFilteredPdfs(data);
        } else {
          setMyPdfs([]);
          setFilteredPdfs([]);
        }
      } catch (error) {
        console.error("Failed to load collection:", error);
        setMyPdfs([]);
        setFilteredPdfs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPdfs();
  }, []);

  // Filter and search PDFs
  useEffect(() => {
    let result = [...myPdfs];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (pdf) =>
          pdf.unitName?.toLowerCase().includes(term) ||
          pdf.unitCode?.toLowerCase().includes(term),
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.unitName || "").localeCompare(b.unitName || "");
        case "code":
          return (a.unitCode || "").localeCompare(b.unitCode || "");
        case "date":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    setFilteredPdfs(result);
  }, [searchTerm, sortBy, myPdfs]);

  const handlePreview = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const handleClosePreview = () => {
    setSelectedPdf(null);
    document.body.style.overflow = "unset";
  };

  const getFileSize = (url) => {
    // This is a placeholder - in real app, you'd get size from backend
    return "2.3 MB";
  };

  if (loading) {
    return (
      <div className={styles.pdfSection}>
        <div className={styles.headers}>My Collection</div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your uploads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pdfSection}>
      <div className={styles.headers}>My Collection</div>

      {/* Search and Sort Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.searchContainer}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by unit name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearchTerm("")}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className={styles.sortContainer}>
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="date">Recently Added</option>
            <option value="name">Unit Name</option>
            <option value="code">Unit Code</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <span>
          <i className="fas fa-file-pdf"></i> Total PDFs: {filteredPdfs.length}
        </span>
        {searchTerm && (
          <span>
            <i className="fas fa-filter"></i> Filtered: {filteredPdfs.length} of{" "}
            {myPdfs.length}
          </span>
        )}
      </div>

      {/* Results Grid */}
      {!loading && filteredPdfs.length === 0 ? (
        <div className={styles.noResults}>
          {myPdfs.length === 0 ? (
            <>
              <i className="fas fa-cloud-upload-alt"></i>
              <h3>No PDFs uploaded yet</h3>
              <p>Start by uploading your first PDF resource!</p>
            </>
          ) : (
            <>
              <i className="fas fa-search"></i>
              <h3>No matching results</h3>
              <p>Try adjusting your search terms</p>
            </>
          )}
        </div>
      ) : (
        <div className={styles.resultsGrid}>
          {filteredPdfs.map((pdf, index) => (
            <div key={index} className={styles.pdfCard}>
              <div className={styles.pdfIcon}>
                <i className="fas fa-file-pdf"></i>
              </div>
              <div className={styles.pdfInfo}>
                <h3 className={styles.pdfTitle}>{pdf.unitName}</h3>
                <p className={styles.pdfCode}>
                  <strong>Code:</strong> {pdf.unitCode}
                </p>
                <div className={styles.pdfMeta}>
                  <span>
                    <i className="far fa-calendar"></i>{" "}
                    {new Date(pdf.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <span>
                    <i className="far fa-file"></i> {getFileSize(pdf.pdfUrl)}
                  </span>
                </div>
              </div>
              <div className={styles.pdfActions}>
                <button
                  className={styles.previewBtn}
                  onClick={() => handlePreview(pdf.pdfUrl)}
                  title="Preview PDF"
                >
                  <i className="fas fa-eye"></i>
                </button>
                <a
                  href={pdf.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadBtn}
                  title="Download PDF"
                >
                  <i className="fas fa-download"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedPdf && (
        <div className={styles.previewOverlay} onClick={handleClosePreview}>
          <div
            className={styles.previewContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.previewHeader}>
              <h3>
                <i className="fas fa-file-pdf"></i> PDF Preview
              </h3>
              <button className={styles.closeBtn} onClick={handleClosePreview}>
                <i className="fas fa-times"></i> Close
              </button>
            </div>
            <iframe
              src={selectedPdf}
              title="PDF Preview"
              className={styles.iframePreview}
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { MyCollection };
