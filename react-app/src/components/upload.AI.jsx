import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components.css.styles/upload.module.css";
import { PreviewPDF } from "./pdf.preview.jsx";
import Loader from "./loaders/loader.jsx";
import { SummaryView } from "./summary.view.jsx";

function UploadResources() {
  let location = useNavigate();
  const [file, setFile] = useState(null);
  const [PDFURL, resetURL] = useState("");
  const [close, setClose] = useState(false);
  const [loader, setLoader] = useState(false);
  const [summaryState, resetSummaryState] = useState(false);
  const [AISummary, resetAISummary] = useState("");
  const [rawSummary, setRawSummary] = useState("");
  const [summaryHistory, setSummaryHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);

  function setPDFUrl() {
    if (file) {
      if (PDFURL) URL.revokeObjectURL(PDFURL);
      const url = URL.createObjectURL(file);
      resetURL(url);
    }
  }

  function clearInfo() {
    setTimeout(() => setUploadStatus(""), 5000);
  }

  function clearFile() {
    setFile(null);
    resetURL("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function formatAllElements(text) {
    if (!text) return "";

    let processed = text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/&nbsp;/gi, " ")
      .trim();

    const mathStore = [];
    processed = processed.replace(
      /(\(?[A-Z0-1][A-Z0-1Â·+âŠ•Â¬â€²() ]*[A-Z0-1â€²)]\)?|\d\s*\d\s*â†’\s*\d)/g,
      (match) => {
        const id = mathStore.length;
        mathStore.push(match);
        return `@@MATH${id}@@`;
      },
    );

    processed = processed.replace(
      /((?:^\|.+\|\s*(?:\n|$))+)/gm,
      (tableBlock) => {
        const lines = tableBlock.trim().split("\n");
        const rows = lines
          .filter((line) => !/^\s*\|(?:\s*-+\s*\|)+\s*$/.test(line))
          .map((line, index) => {
            const cells = line
              .split("|")
              .filter((cell, i, arr) => i > 0 && i < arr.length - 1);
            const isHeader = index === 0;
            const tag = isHeader ? "th" : "td";
            const cellClass = isHeader
              ? "border border-gray-300 px-4 py-2 bg-gray-100 font-bold text-left"
              : "border border-gray-300 px-4 py-2";

            const htmlCells = cells
              .map(
                (c) =>
                  `<${tag} class="${cellClass}">${c.trim() || "&nbsp;"}</${tag}>`,
              )
              .join("");
            return `<tr>${htmlCells}</tr>`;
          })
          .join("");

        return `<div class="overflow-x-auto my-4"><table class="table-auto border-collapse border border-gray-300 w-full text-sm">${rows}</table></div>`;
      },
    );

    processed = processed
      .replace(
        /^###\s*(.+)$/gm,
        '<h3 class="text-lg font-bold mt-6 mb-2 text-gray-800">$1</h3>',
      )
      .replace(
        /^##\s*(.+)$/gm,
        '<h2 class="text-xl font-bold mt-8 mb-3 text-gray-800">$1</h2>',
      )
      .replace(
        /^#\s*(.+)$/gm,
        '<h1 class="text-2xl font-black mt-10 mb-4 text-gray-900">$1</h1>',
      )
      .replace(
        /^\s*(\*\*\*|---)\s*$/gm,
        '<hr class="my-8 border-t border-gray-300">',
      );

    processed = processed.replace(
      /(?:^\s*(?:â€¢|-|\*|\d+\.)\s+.+\n?)+/gm,
      (block) => {
        const isNumbered = /^\s*\d+\./.test(block.trim());
        const tag = isNumbered ? "ol" : "ul";
        const listClass = isNumbered
          ? "list-decimal ml-6 my-4"
          : "list-disc ml-6 my-4";
        const items = block
          .trim()
          .split("\n")
          .map((line) => line.replace(/^\s*(?:â€¢|-|\*|\d+\.)\s+/, ""))
          .map((item) => `<li class="mb-1">${item}</li>`)
          .join("");
        return `<${tag} class="${listClass}">${items}</${tag}>`;
      },
    );

    processed = processed
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(?!\*)([^*]+)\*/g, '<em class="italic">$1</em>');

    processed = processed
      .split(/\n{2,}/)
      .map((chunk) => {
        const c = chunk.trim();
        if (!c) return "";
        if (/^<(h\d|div|table|ul|ol|hr|li)/.test(c)) return c;
        return `<p class="leading-relaxed mb-4 text-gray-700">${c.replace(/\n/g, "<br>")}</p>`;
      })
      .join("\n");

    processed = processed.replace(
      /@@MATH(\d+)@@/g,
      (_, i) =>
        `<span class="font-mono bg-gray-50 px-1 rounded text-blue-700">${mathStore[i]}</span>`,
    );

    return processed.trim();
  }

  useEffect(() => {
    const fetchSummaryHistory = async () => {
      try {
        setHistoryLoading(true);
        const response = await fetch(
          "https://campushub-backend-57dg.onrender.com/api/resource/pdf/history",
          {
            method: "GET",
            credentials: "include",
          },
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || "Unable to load summary history");
        }

        setSummaryHistory(result.history || []);
      } catch (error) {
        setSummaryHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchSummaryHistory();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== "application/pdf") {
        setUploadStatus("invalid-file");
        setFile(null);
        setTimeout(() => setUploadStatus(""), 5000);
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadStatus("file-too-large");
        setFile(null);
        setTimeout(() => setUploadStatus(""), 5000);
        return;
      }

      setFile(selectedFile);
      setUploadStatus("");
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const openSummaryFromHistory = (historyItem) => {
    setRawSummary(historyItem.summaryText || "");
    resetAISummary(formatAllElements(historyItem.summaryText || ""));
    setClose(false);
    resetSummaryState(true);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("error");
      clearInfo();
      return;
    }

    setLoader(true);

    const formData = new FormData();
    formData.append("file", file);

    async function uploadRequest() {
      return fetch("https://campushub-backend-57dg.onrender.com/api/resource/pdf", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
    }

    try {
      let response = await uploadRequest();

      if (response.status === 401) {
        await fetch("https://campushub-backend-57dg.onrender.com/auth/verify/refresh", {
          method: "POST",
          credentials: "include",
        });

        response = await uploadRequest();
      }

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const res = await response.json();

      setUploadStatus("success");
      resetSummaryState(true);
      setClose(false);
      setRawSummary(res.data2 || "");
      resetAISummary(formatAllElements(res.data2 || ""));
      setSummaryHistory((currentHistory) => [
        {
          _id: res.summaryId || `${Date.now()}`,
          fileName: res.fileName || file?.name || "Untitled PDF",
          summaryText: res.data2 || "",
          truncated: Boolean(res.truncated),
          extractedCharacters: res.extractedCharacters || 0,
          summarizedCharacters: res.summarizedCharacters || 0,
          createdAt: new Date().toISOString(),
        },
        ...currentHistory,
      ]);

      clearInfo();
    } catch (error) {
      setUploadStatus("error");
      clearInfo();
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div>
        <PreviewPDF
          url={PDFURL}
          onClose={() => {
            resetURL("");
          }}
        />
      </div>
      {summaryState && !close && (
        <div className={styles.summarized}>
          <SummaryView
            closeBtn={close}
            closeSet={setClose}
            setSummary={resetSummaryState}
            rawSummary={rawSummary}
            AI={<div dangerouslySetInnerHTML={{ __html: AISummary }} />}
          />
        </div>
      )}
      {loader && (
        <div>
          <Loader />
        </div>
      )}
      {!summaryState && (
        <div>
          <div className={styles.uploadHeader}>Upload PDF Resource</div>
          <div className={styles.uploadSubtitle}>
            AI Summarization happens here
          </div>
          <div className={styles.uploadBox} onClick={handleBoxClick}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className={styles.uploadInput}
            />
            <div className={styles.uploadIcon}>PDF</div>
            <div className={styles.uploadText}>
              {file ? file.name : "Click to select a PDF file"}
            </div>
            <div className={styles.uploadSubtext}>Maximum file size: 5MB</div>
          </div>
          {file && (
            <div className={styles.uploadButtonGroup}>
              <button className={styles.uploadBtn} onClick={handleUpload}>
                Generate summary
              </button>
              <button className={styles.uploadBtn} onClick={setPDFUrl}>
                Preview
              </button>
              <button className={styles.clearBtn} onClick={clearFile}>
                Clear
              </button>
            </div>
          )}
          {uploadStatus === "success" && (
            <div className={styles.successMessage}>
              Summary generated successfully
            </div>
          )}
          {uploadStatus === "error" && (
            <div className={styles.errorMessage}>
              Upload failed or no file selected
            </div>
          )}
          {uploadStatus === "invalid-file" && (
            <div className={styles.errorMessage}>
              Invalid file type. Please upload only PDF files.
            </div>
          )}
          {uploadStatus === "file-too-large" && (
            <div className={styles.errorMessage}>
              File is too large. Maximum file size is 5MB.
            </div>
          )}

          <div className={styles.summaryHistorySection}>
            <div className={styles.summaryHistoryHeader}>
              <div>
                <h3>Summary History</h3>
                <p>Reopen summaries you generated earlier.</p>
              </div>
            </div>
            {historyLoading ? (
              <div className={styles.summaryHistoryEmpty}>
                Loading your summary history...
              </div>
            ) : summaryHistory.length === 0 ? (
              <div className={styles.summaryHistoryEmpty}>
                No AI summaries yet. Generate one from a PDF to see it here.
              </div>
            ) : (
              <div className={styles.summaryHistoryList}>
                {summaryHistory.map((item) => (
                  <article key={item._id} className={styles.summaryHistoryCard}>
                    <div className={styles.summaryHistoryMeta}>
                      <h4>{item.fileName || "Untitled PDF"}</h4>
                      <span>
                        {new Date(item.createdAt || Date.now()).toLocaleString()}
                      </span>
                    </div>
                    <p>
                      {(item.summaryText || "").slice(0, 180)}
                      {(item.summaryText || "").length > 180 ? "..." : ""}
                    </p>
                    <div className={styles.summaryHistoryActions}>
                      <button
                        className={styles.uploadBtn}
                        onClick={() => openSummaryFromHistory(item)}
                      >
                        Open Summary
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { UploadResources };
