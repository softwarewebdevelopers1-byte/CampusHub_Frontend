import React from "react";
import styles from "../components.css.styles/summary.module.css";
import copyData from "./copying.component/copy.js";
import { useState } from "react";

export function SummaryView({ closeBtn, closeSet, setSummary, AI }) {
  let [copyBtn, resetcopyBtn] = useState("copy");
  function copyPattern() {
    setTimeout(() => {
      resetcopyBtn("copy");
    }, 5000);
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
