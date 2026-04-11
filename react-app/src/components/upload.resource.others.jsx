import { useState, useRef } from "react";
import styles from "../components.css.styles/upload.module.css";
import Loader from "./loaders/loader.jsx";
import { PreviewPDF } from "./pdf.preview.jsx";

function UploadResourcesToThers() {
  const [file, setFile] = useState(null);
  const [PDFURL, resetURL] = useState("");
  const [loader, setLoader] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [metadata, setMetadata] = useState({
    courseTitle: "",
    unitName: "",
    unitCode: "",
  });

  const fileInputRef = useRef(null);

  function clearError() {
    setTimeout(() => {
      setUploadStatus("");
      setFeedbackMessage("");
    }, 5000);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  function setPDFUrl() {
    if (file) {
      if (PDFURL) URL.revokeObjectURL(PDFURL);
      const url = URL.createObjectURL(file);
      resetURL(url);
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== "application/pdf") {
        setUploadStatus("invalid-file");
        setFeedbackMessage("");
        setFile(null);
        clearError();
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadStatus("file-too-large");
        setFeedbackMessage("");
        setFile(null);
        clearError();
        return;
      }

      setFile(selectedFile);
      setUploadStatus("");
      setFeedbackMessage("");
    }
  };

  const handleBoxClick = () => fileInputRef.current?.click();

  const handleUpload = async () => {
    if (
      !file ||
      !metadata.courseTitle ||
      !metadata.unitName ||
      !metadata.unitCode
    ) {
      setUploadStatus("missing-info");
      setFeedbackMessage("");
      clearError();
      return;
    }

    setLoader(true);
    setFeedbackMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseTitle", metadata.courseTitle);
    formData.append("unitName", metadata.unitName);
    formData.append("unitCode", metadata.unitCode);

    try {
      const res = await fetch(
        "https://campushub-backend-57dg.onrender.com/api/resources/upload/users/data/pdf",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      const result = await res.json();

      if (res.ok) {
        setUploadStatus("success");
        setFeedbackMessage(
          result?.verification?.feedback || "AI verified the document successfully.",
        );
        setFile(null);
        setMetadata({ courseTitle: "", unitName: "", unitCode: "" });
        resetURL("");
        clearError();
      } else {
        setUploadStatus(result?.verificationFailed ? "verification-failed" : "error");
        setFeedbackMessage(
          result?.feedback || result?.error || "Upload failed. Try again.",
        );
        clearError();
      }
    } catch (err) {
      setUploadStatus("error");
      setFeedbackMessage("Upload failed. Try again.");
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <PreviewPDF url={PDFURL} onClose={() => resetURL("")} />
      {loader && <Loader />}

      <div className={styles.contentWrapper}>
        <h2 className={styles.uploadHeader}>Upload PDF Resource</h2>
        <p className={styles.uploadSubtitle}>
          Share learning materials with others
        </p>

        <div className={styles.uploadBox} onClick={handleBoxClick}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className={styles.uploadInput}
          />
          <div className={styles.uploadIcon}>{file ? "PDF" : "DOC"}</div>
          <div className={styles.uploadText}>
            {file ? file.name : "Click to select a PDF file"}
          </div>
          <div className={styles.uploadSubtext}>Max file size: 5MB</div>
        </div>

        {file && (
          <div className={styles.metadataSection}>
            <p className={styles.infoPrompt}>Please provide resource details:</p>

            <select
              name="courseTitle"
              value={metadata.courseTitle}
              onChange={handleInputChange}
              className={styles.selectInput}
            >
              <option value="" disabled>
                Select Course
              </option>
              <option value="Bsc in Informatics">Bsc in Informatics</option>
              <option value="Bsc in Computer Science">
                Bsc in Computer Science
              </option>
              <option value="Bsc in Information Science">
                Bsc in Information Science
              </option>
            </select>

            <input
              type="text"
              name="unitName"
              placeholder="Unit Name (e.g., Systems Analysis)"
              value={metadata.unitName}
              onChange={handleInputChange}
              className={styles.textInput}
            />
            <input
              type="text"
              name="unitCode"
              placeholder="Unit Code (e.g., INF 2201)"
              value={metadata.unitCode}
              onChange={handleInputChange}
              className={styles.textInput}
            />

            <div className={styles.uploadButtonGroup}>
              <button className={styles.uploadBtn} onClick={handleUpload}>
                Upload Now
              </button>
              <button className={styles.uploadBtn} onClick={setPDFUrl}>
                Preview
              </button>
              <button
                className={styles.clearBtn}
                onClick={() => {
                  setFile(null);
                  setMetadata({ courseTitle: "", unitName: "", unitCode: "" });
                  resetURL("");
                  setFeedbackMessage("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className={styles.messageArea}>
          {uploadStatus === "success" && (
            <p className={styles.successMessage}>
              File uploaded successfully. {feedbackMessage}
            </p>
          )}
          {uploadStatus === "missing-info" && (
            <p className={styles.errorMessage}>
              Please fill in all fields before uploading
            </p>
          )}
          {uploadStatus === "error" && (
            <p className={styles.errorMessage}>{feedbackMessage}</p>
          )}
          {uploadStatus === "verification-failed" && (
            <p className={styles.errorMessage}>{feedbackMessage}</p>
          )}
          {uploadStatus === "invalid-file" && (
            <p className={styles.errorMessage}>Invalid file type. PDF only.</p>
          )}
          {uploadStatus === "file-too-large" && (
            <p className={styles.errorMessage}>File exceeds 5MB limit.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export { UploadResourcesToThers };
