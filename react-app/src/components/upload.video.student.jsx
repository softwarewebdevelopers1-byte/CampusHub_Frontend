import { useRef, useState } from "react";
import styles from "../components.css.styles/upload.module.css";
import Loader from "./loaders/loader.jsx";

const API_BASE_URL = "https://campushub-backend-57dg.onrender.com";

const initialMetadata = {
  courseTitle: "",
  unitName: "",
  unitCode: "",
};

function StudentVideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [loader, setLoader] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const fileInputRef = useRef(null);

  function clearMessage() {
    setTimeout(() => {
      setUploadStatus("");
      setFeedbackMessage("");
    }, 5000);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMetadata((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    if (!event.target.files?.[0]) return;

    const selectedFile = event.target.files[0];

    if (!selectedFile.type.startsWith("video/")) {
      setUploadStatus("invalid-file");
      setFeedbackMessage("");
      setVideoFile(null);
      clearMessage();
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setUploadStatus("file-too-large");
      setFeedbackMessage("");
      setVideoFile(null);
      clearMessage();
      return;
    }

    setVideoFile(selectedFile);
    setUploadStatus("");
    setFeedbackMessage("");
  };

  const handleUpload = async () => {
    if (
      !videoFile ||
      !metadata.courseTitle ||
      !metadata.unitName ||
      !metadata.unitCode
    ) {
      setUploadStatus("missing-info");
      setFeedbackMessage("");
      clearMessage();
      return;
    }

    setLoader(true);
    setUploadStatus("");
    setFeedbackMessage("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("courseTitle", metadata.courseTitle);
    formData.append("unitName", metadata.unitName);
    formData.append("unitCode", metadata.unitCode);

    try {
      const response = await fetch(`${API_BASE_URL}/api/students/upload/video`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed. Try again.");
      }

      setUploadStatus("success");
      setFeedbackMessage(result.message || "Video uploaded successfully.");
      setVideoFile(null);
      setMetadata(initialMetadata);
      if (fileInputRef.current) fileInputRef.current.value = "";
      clearMessage();
    } catch (error) {
      setUploadStatus("error");
      setFeedbackMessage(error.message || "Upload failed. Try again.");
      clearMessage();
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      {loader && <Loader />}

      <div className={styles.contentWrapper}>
        <h2 className={styles.uploadHeader}>Upload Video Resource</h2>
        <p className={styles.uploadSubtitle}>
          Share video learning materials with other CampusHub users
        </p>

        <div
          className={styles.uploadBox}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className={styles.uploadInput}
          />
          <div className={styles.uploadIcon}>{videoFile ? "VID" : "MP4"}</div>
          <div className={styles.uploadText}>
            {videoFile ? videoFile.name : "Click to select a video file"}
          </div>
          <div className={styles.uploadSubtext}>Max file size: 50MB</div>
        </div>

        {videoFile && (
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
              placeholder="Unit Name (e.g., Database Systems)"
              value={metadata.unitName}
              onChange={handleInputChange}
              className={styles.textInput}
            />
            <input
              type="text"
              name="unitCode"
              placeholder="Unit Code (e.g., INS 3104)"
              value={metadata.unitCode}
              onChange={handleInputChange}
              className={styles.textInput}
            />

            <div className={styles.uploadButtonGroup}>
              <button className={styles.uploadBtn} onClick={handleUpload}>
                Upload Now
              </button>
              <button
                className={styles.clearBtn}
                onClick={() => {
                  setVideoFile(null);
                  setMetadata(initialMetadata);
                  setFeedbackMessage("");
                  setUploadStatus("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className={styles.messageArea}>
          {uploadStatus === "success" && (
            <p className={styles.successMessage}>{feedbackMessage}</p>
          )}
          {uploadStatus === "missing-info" && (
            <p className={styles.errorMessage}>
              Please fill in all fields before uploading
            </p>
          )}
          {uploadStatus === "error" && (
            <p className={styles.errorMessage}>{feedbackMessage}</p>
          )}
          {uploadStatus === "invalid-file" && (
            <p className={styles.errorMessage}>
              Invalid file type. Video files only.
            </p>
          )}
          {uploadStatus === "file-too-large" && (
            <p className={styles.errorMessage}>File exceeds 50MB limit.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export { StudentVideoUpload };
