import { useEffect, useMemo, useState } from "react";
import styles from "../components.css.styles/pdf.module.css";

const API_BASE_URL = "https://campushub-backend-57dg.onrender.com";

function MyCollection() {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [deletingId, setDeletingId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/users/get/own/pdfs`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setCollection(Array.isArray(data) ? data : []);
        } else {
          setCollection([]);
        }
      } catch (error) {
        console.error("Failed to load collection:", error);
        setCollection([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  const filteredCollection = useMemo(() => {
    let result = [...collection];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.unitName?.toLowerCase().includes(term) ||
          item.unitCode?.toLowerCase().includes(term) ||
          item.courseTitle?.toLowerCase().includes(term) ||
          item.type?.toLowerCase().includes(term),
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.unitName || "").localeCompare(b.unitName || "");
        case "code":
          return (a.unitCode || "").localeCompare(b.unitCode || "");
        case "date":
        default:
          return (
            new Date(b.uploadedAt || 0).getTime() -
            new Date(a.uploadedAt || 0).getTime()
          );
      }
    });

    return result;
  }, [collection, searchTerm, sortBy]);

  const pdfCount = filteredCollection.filter((item) => item.type === "pdf").length;
  const videoCount = filteredCollection.filter((item) => item.type === "video").length;

  const handlePreview = (item) => {
    setSelectedItem(item);
    document.body.style.overflow = "hidden";
  };

  const handleClosePreview = () => {
    setSelectedItem(null);
    document.body.style.overflow = "unset";
  };

  const handleDelete = async (item) => {
    const label = item.type === "video" ? "video" : "document";
    const shouldDelete = window.confirm(
      `Delete "${item.unitName || `this ${label}`}" from your collection?`,
    );

    if (!shouldDelete) return;

    try {
      setDeletingId(item._id);
      setActionMessage("");
      setActionError("");

      const response = await fetch(
        `${API_BASE_URL}/api/users/get/own/pdfs/${item._id}?type=${item.type}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || `Unable to delete ${label}`);
      }

      setCollection((current) =>
        current.filter((currentItem) => currentItem._id !== item._id),
      );

      if (selectedItem?._id === item._id) {
        handleClosePreview();
      }

      setActionMessage(
        result?.message ||
          `${item.type === "video" ? "Video" : "Document"} deleted successfully.`,
      );
    } catch (error) {
      setActionError(
        error.message ||
          `Unable to delete ${item.type === "video" ? "video" : "document"}.`,
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "Recently added";
    return new Date(value).toLocaleDateString();
  };

  const getFileSize = () => "Available online";

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

      <div className={styles.controlsBar}>
        <div className={styles.searchContainer}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by unit name, code, course, or type..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
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
            onChange={(event) => setSortBy(event.target.value)}
            className={styles.sortSelect}
          >
            <option value="date">Recently Added</option>
            <option value="name">Unit Name</option>
            <option value="code">Unit Code</option>
          </select>
        </div>
      </div>

      <div className={styles.statsBar}>
        <span>
          <i className="fas fa-folder-open"></i> Total uploads:{" "}
          {filteredCollection.length}
        </span>
        <span>
          <i className="fas fa-file-pdf"></i> PDFs: {pdfCount}
        </span>
        <span>
          <i className="fas fa-video"></i> Videos: {videoCount}
        </span>
      </div>

      {actionMessage && <p className={styles.successBanner}>{actionMessage}</p>}
      {actionError && <p className={styles.errorBanner}>{actionError}</p>}

      {filteredCollection.length === 0 ? (
        <div className={styles.noResults}>
          {collection.length === 0 ? (
            <>
              <i className="fas fa-cloud-upload-alt"></i>
              <h3>No uploads yet</h3>
              <p>Your PDFs and videos will appear here after upload.</p>
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
          {filteredCollection.map((item, index) => (
            <div key={item._id || index} className={styles.pdfCard}>
              <div className={styles.pdfIcon}>
                <i
                  className={
                    item.type === "video" ? "fas fa-video" : "fas fa-file-pdf"
                  }
                ></i>
              </div>
              <div className={styles.pdfInfo}>
                <h3 className={styles.pdfTitle}>{item.unitName}</h3>
                <p className={styles.pdfCode}>
                  <strong>Code:</strong> {item.unitCode}
                </p>
                <p className={styles.pdfCode}>
                  <strong>Type:</strong> {item.type === "video" ? "Video" : "PDF"}
                </p>
                <div className={styles.pdfMeta}>
                  <span>
                    <i className="far fa-calendar"></i> {formatDate(item.uploadedAt)}
                  </span>
                  <span>
                    <i className="far fa-file"></i> {getFileSize()}
                  </span>
                </div>
              </div>
              <div className={styles.pdfActions}>
                <button
                  className={styles.previewBtn}
                  onClick={() => handlePreview(item)}
                  title={`Preview ${item.type === "video" ? "video" : "PDF"}`}
                >
                  <i className="fas fa-eye"></i>
                </button>
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadBtn}
                  title={item.type === "video" ? "Open video" : "Download PDF"}
                >
                  <i
                    className={
                      item.type === "video" ? "fas fa-external-link-alt" : "fas fa-download"
                    }
                  ></i>
                </a>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(item)}
                  title={`Delete ${item.type === "video" ? "video" : "PDF"}`}
                  disabled={deletingId === item._id}
                >
                  <i
                    className={`fas ${deletingId === item._id ? "fa-spinner fa-spin" : "fa-trash"}`}
                  ></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className={styles.previewOverlay} onClick={handleClosePreview}>
          <div
            className={styles.previewContainer}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.previewHeader}>
              <h3>
                <i
                  className={
                    selectedItem.type === "video" ? "fas fa-video" : "fas fa-file-pdf"
                  }
                ></i>{" "}
                {selectedItem.type === "video" ? "Video Preview" : "PDF Preview"}
              </h3>
              <button className={styles.closeBtn} onClick={handleClosePreview}>
                <i className="fas fa-times"></i> Close
              </button>
            </div>
            {selectedItem.type === "video" ? (
              <video
                src={selectedItem.fileUrl}
                controls
                className={styles.iframePreview}
              />
            ) : (
              <iframe
                src={selectedItem.fileUrl}
                title="PDF Preview"
                className={styles.iframePreview}
                loading="lazy"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { MyCollection };
