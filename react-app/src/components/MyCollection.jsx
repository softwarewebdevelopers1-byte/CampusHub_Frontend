import { useEffect, useState } from "react";
import styles from "../components.css.styles/pdf.module.css";

function MyCollection() {
  const [myPdfs, setMyPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchMyPdfs = async () => {
      try {
        let response = await fetch(
          "http://localhost:8000/api/users/get/own/pdfs",
          {
            method: "GET",
            credentials: "include",
          },
        );

        let data = await response.json();

        if (response.status===200) {
          setMyPdfs(data);
        } else {
          setMyPdfs([]);
        }
      } catch (error) {
        console.error("Failed to load collection:", error);
        setMyPdfs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPdfs();
  }, []);

  return (
    <div className={styles.pdfSection}>
      <div className={styles.headers}>My Collection</div>

      {loading && (
        <div className={styles.noResults}>Loading your uploads...</div>
      )}

      {!loading && myPdfs.length === 0 && (
        <div className={styles.noResults}>
          You haven't uploaded any PDFs yet.
        </div>
      )}

      <div className={styles.results}>
        {myPdfs.map((pdf, index) => (
          <div key={index} className={styles.pdfBox}>
            <h3>{pdf.unitName.toUpperCase()}</h3>
            <p>
              <strong>Code:</strong> {pdf.unitCode}
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

      {/* Preview Modal */}
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

export { MyCollection };
