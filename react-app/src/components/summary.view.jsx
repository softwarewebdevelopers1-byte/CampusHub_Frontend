import React from "react";
import styles from "../components.css.styles/summary.module.css";
import copyData from "./copying.component/copy.js";
import { useState } from "react";

export function SummaryView({
  closeBtn,
  closeSet,
  setSummary,
  AI,
  rawSummary,
}) {
  let [copyBtn, resetcopyBtn] = useState("copy");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [questionError, setQuestionError] = useState("");
  function copyPattern() {
    setTimeout(() => {
      resetcopyBtn("copy");
    }, 5000);
  }

  async function askSummaryQuestion() {
    if (!question.trim() || !rawSummary?.trim()) {
      setQuestionError("Add a question after generating a summary.");
      return;
    }

    setAsking(true);
    setQuestionError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/resource/pdf/ask-summary",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            summary: rawSummary,
            question,
          }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to answer question");
      }

      setAnswer(result.answer || "");
    } catch (error) {
      setQuestionError(error.message || "Unable to answer question");
    } finally {
      setAsking(false);
    }
  }

  return (
    <div>
      {AI ? (
        <div className={styles.card}>
          <div className={styles.header}>
            <button
              className={`${styles.closeBtn} ${styles.copyBtn}`}
              title="copy"
              onClick={() => {
                // copyData(AI);
                // resetcopyBtn("copied");
              }}
            >
              {copyBtn}
            </button>
            <h2 className={styles.title}>AI Generated Summary</h2>
            <button
              title="close"
              className={styles.closeBtn}
              onClick={() => {
                closeSet(true);
                setSummary(false);
              }}
            >
              ✕
            </button>
          </div>
          <div className={styles.content}>
            {AI}
          </div>
          <div className={styles.followUpSection}>
            <h3 className={styles.followUpTitle}>Ask About This Summary</h3>
            <p className={styles.followUpText}>
              Ask a follow-up question based on the AI-generated summary.
            </p>
            <textarea
              className={styles.questionInput}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a question about the summary..."
            />
            <div className={styles.actions}>
              <button
                className={styles.askBtn}
                onClick={askSummaryQuestion}
                disabled={asking}
              >
                {asking ? "Thinking..." : "Ask Question"}
              </button>
            </div>
            {questionError && (
              <p className={styles.errorText}>{questionError}</p>
            )}
            {answer && (
              <div className={styles.answerBox}>
                <h4 className={styles.answerTitle}>Answer</h4>
                <p className={styles.answerText}>{answer}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.header}>
            <div></div>
            <h2 className={styles.title}>Summary</h2>
            <button
              title="close"
              className={styles.closeBtn}
              onClick={() => {
                closeSet(true);
                setSummary(false);
              }}
            >
              ✕
            </button>
          </div>
          <div className={styles.content}>
            <p className={styles.noSummary}>📋 No Summary Created Yet</p>
            <p className={styles.noSummarySubtext}>
              Upload a PDF and click "Generate summary" to create an AI-generated summary.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
