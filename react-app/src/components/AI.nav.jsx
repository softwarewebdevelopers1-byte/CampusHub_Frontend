import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components.css.styles/AI.module.css";

const API_BASE = "https://campushub-backend-57dg.onrender.com";
const CHAT_STORAGE_KEY = "aiChatHistory";

const PAGE_MAP = {
  homepage: { path: "/homepage", label: "Dashboard" },
  myCollection: { path: "/myCollection", label: "My Collection" },
  simpleSearch: { path: "/simpleSearch", label: "Simple Search" },
  deepsearch: { path: "/deepsearch", label: "Deep Search" },
  AISummary: { path: "/AISummary", label: "AI Summary" },
  sharePDF: { path: "/sharePDF", label: "Share PDF" },
  videos: { path: "/videos", label: "Lecture Videos" },
  settings: { path: "/settings", label: "Settings" },
  notes: { path: "/notes", label: "My Notes" },
};

function createBotMessage(text, suggestions = []) {
  return {
    text,
    sender: "bot",
    suggestions,
    timestamp: new Date().toISOString(),
  };
}

function AINav({ user }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const savedMessages = sessionStorage.getItem(CHAT_STORAGE_KEY);

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
      return;
    }

    const welcomeMsg = [
      createBotMessage(
        `Hello ${user}! I can guide you to real CampusHub pages like Dashboard, My Collection, My Notes, Share PDF, AI Summary, Videos, and Settings.`,
        ["Open My Notes", "Take me to Share PDF", "Go to Dashboard"],
      ),
    ];

    setMessages(welcomeMsg);
    sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(welcomeMsg));
  }, [user]);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const clearChat = () => {
    const resetMessages = [
      createBotMessage(
        `Hello ${user}! I can help you navigate the CampusHub student platform.`,
        ["Open My Collection", "Take me to AI Summary", "Go to Settings"],
      ),
    ];

    sessionStorage.removeItem(CHAT_STORAGE_KEY);
    setMessages(resetMessages);
  };

  const sendMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || isTyping) {
      return;
    }

    const lowerInput = trimmedMessage.toLowerCase();

    if (
      lowerInput.includes("clear history") ||
      lowerInput.includes("reset chat") ||
      lowerInput.includes("clear chat")
    ) {
      clearChat();
      setMessages((prev) => [
        ...prev,
        createBotMessage("Chat history cleared. We can start fresh."),
      ]);
      setInput("");
      return;
    }

    const userMessage = {
      text: trimmedMessage,
      sender: user,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/api/ai/student/navigation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: trimmedMessage,
          userName: user,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Unable to reach CampusHub AI");
      }

      let replyText =
        result?.reply || "I can help you navigate around CampusHub.";
      const page = result?.targetPageId ? PAGE_MAP[result.targetPageId] : null;
      const suggestions = Array.isArray(result?.suggestions)
        ? result.suggestions
        : [];

      if (result?.shouldNavigate) {
        if (page) {
          navigate(page.path);
          replyText = `${replyText} Opening ${page.label} now.`;
        } else {
          replyText =
            "That page does not exist on CampusHub right now. Please try another page.";
        }
      }

      setMessages((prev) => [
        ...prev,
        createBotMessage(replyText, suggestions),
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        createBotMessage(
          error.message ||
            "CampusHub AI is unavailable right now. Please try again shortly.",
        ),
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleUserInput = () => {
    void sendMessage(input);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleUserInput();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={styles.aiChatContainer}>
      <div className={styles.chatHeader}>
        <h3>
          <i className="fas fa-robot"></i> AI Assistant
          <span className={styles.sessionBadge}>AI navigation</span>
        </h3>
      </div>

      <div className={styles.messagesContainer} ref={containerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === "bot" ? styles.botMessage : styles.userMessage
            }
          >
            {message.sender === "bot" && <i className="fas fa-robot"></i>}
            <div className={styles.messageContent}>
              <span>{message.text}</span>
              {message.timestamp && (
                <span className={styles.timestamp}>
                  {formatTime(message.timestamp)}
                </span>
              )}
            </div>
            {message.suggestions && message.suggestions.length > 0 && (
              <div className={styles.suggestionChips}>
                {message.suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    className={styles.suggestionChip}
                    onClick={() => void sendMessage(suggestion)}
                    disabled={isTyping}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className={styles.botMessage}>
            <i className="fas fa-robot"></i>
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.userInfo}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me to open a CampusHub page..."
          disabled={isTyping}
        />
        <button onClick={handleUserInput} disabled={isTyping}>
          <i className="fas fa-paper-plane"></i> Send
        </button>
      </div>

      <div className={styles.sessionFooter}>
        <small>Navigation only. Non-existent pages will be flagged.</small>
        <button
          className={styles.clearBtn}
          onClick={clearChat}
          title="Clear chat history"
          disabled={isTyping}
        >
          <i className="fas fa-trash"></i> Clear
        </button>
      </div>
    </div>
  );
}

export { AINav };
