import { useState, useEffect, useRef } from "react";
import styles from "../components.css.styles/AI.module.css";
import { useNavigate } from "react-router-dom";

function AINav({ user }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Load chat history from session storage on mount
  useEffect(() => {
    const savedMessages = sessionStorage.getItem("aiChatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initialize with welcome message
      const welcomeMsg = [
        {
          text: `Hello ${user}! I'm your CampusHub assistant. How can I help you today?`,
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(welcomeMsg);
      sessionStorage.setItem("aiChatHistory", JSON.stringify(welcomeMsg));
    }
  }, [user]);

  // Save messages to session storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("aiChatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const navigateTo = (path) => {
    const validPaths = {
      home: "/homepage",
      dashboard: "/homepage",
      profile: "/profile",
      notifications: "/notifications",
      uploads: "/sharePDF",
      assignments: "/assignments",
      courses: "/courses",
      deadlines: "/deadlines",
      calendar: "/calendar",
      settings: "/settings",
      resources: "/resources",
    };

    const cleanPath = path.replace(/^\//, "").toLowerCase();

    if (validPaths[cleanPath]) {
      navigate(validPaths[cleanPath]);
      return true;
    }
    return false;
  };

  // Get notification count from session storage with fallback
  const getNotificationCount = () => {
    try {
      // Try sessionStorage first
      let count = sessionStorage.getItem("notificationCount");
      if (count) return JSON.parse(count);

      // Fallback to localStorage
      count = localStorage.getItem("notificationCount#campusHub0ZX");
      return count ? JSON.parse(count) : 0;
    } catch {
      return 0;
    }
  };

  // Clear chat history
  const clearChat = () => {
    sessionStorage.removeItem("aiChatHistory");
    setMessages([
      {
        text: `Hello ${user}! I'm your CampusHub assistant. How can I help you today?`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Process bot response with delay
  const processBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase().trim();

    // Check for clear chat command
    if (
      lowerInput.includes("clear history") ||
      lowerInput.includes("reset chat") ||
      lowerInput.includes("clear chat")
    ) {
      clearChat();
      return {
        text: "✅ Chat history cleared! Starting fresh.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
    } else if (
      lowerInput.includes("campushub") ||
      lowerInput.includes("campus hub")
    ) {
      return {
        text: `CampusHub is your all-in-one student portal designed to simplify your academic life. You can navigate to different sections like courses, profile, notifications, uploads, deadlines, and more. Just ask me to "link to" any section or say "help" to see what I can do!`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
    }
    // Check for "link to" command
    else if (lowerInput.includes("link to")) {
      const section = lowerInput.split("link to")[1]?.trim();

      if (!section) {
        return {
          text: `Please specify the section you want to navigate to. For example: "link to uploads", "link to profile", or "link to notifications".`,
          sender: "bot",
          timestamp: new Date().toISOString(),
        };
      } else {
        const navigated = navigateTo(section);

        if (navigated) {
          return {
            text: `✅ Taking you to the ${section} section...`,
            sender: "bot",
            timestamp: new Date().toISOString(),
          };
        } else {
          return {
            text: `❌ Sorry, I couldn't find "${section}". Available sections: home, dashboard, profile, notifications, uploads, assignments, courses, deadlines, calendar, settings, resources.`,
            sender: "bot",
            timestamp: new Date().toISOString(),
          };
        }
      }
    }
    // Check for navigation intents
    else if (
      lowerInput.includes("go to") ||
      lowerInput.includes("take me to") ||
      lowerInput.includes("open") ||
      lowerInput.includes("navigate to")
    ) {
      let section = "";
      if (lowerInput.includes("go to"))
        section = lowerInput.split("go to")[1]?.trim();
      else if (lowerInput.includes("take me to"))
        section = lowerInput.split("take me to")[1]?.trim();
      else if (lowerInput.includes("open"))
        section = lowerInput.split("open")[1]?.trim();
      else if (lowerInput.includes("navigate to"))
        section = lowerInput.split("navigate to")[1]?.trim();

      if (section) {
        const navigated = navigateTo(section);
        if (navigated) {
          return {
            text: `✅ Taking you to the ${section} section...`,
            sender: "bot",
            timestamp: new Date().toISOString(),
          };
        } else {
          return {
            text: `I can help you navigate. Please specify a valid section. Available: courses, profile, uploads, notifications, deadlines, etc.`,
            sender: "bot",
            timestamp: new Date().toISOString(),
          };
        }
      } else {
        return {
          text: `I can help you navigate to different sections. Just tell me where you want to go!`,
          sender: "bot",
          timestamp: new Date().toISOString(),
        };
      }
    }
    // Check for notifications
    else if (
      lowerInput.includes("notification") ||
      lowerInput.includes("notifications") ||
      lowerInput.includes("notify") ||
      lowerInput.includes("alerts") ||
      lowerInput.includes("alert")
    ) {
      const notifCount = getNotificationCount();
      return {
        text: `You have ${notifCount} new notification${notifCount !== 1 ? "s" : ""}. Would you like to view them?`,
        sender: "bot",
        suggestions: notifCount > 0 ? ["link to notifications"] : [],
        timestamp: new Date().toISOString(),
      };
    }
    // Check for uploads
    else if (
      lowerInput.includes("upload") ||
      lowerInput.includes("file") ||
      lowerInput.includes("document") ||
      lowerInput.includes("share")
    ) {
      return {
        text: `To upload a file, you can go to the Uploads section. Would you like me to take you there?`,
        sender: "bot",
        suggestions: ["link to uploads"],
        timestamp: new Date().toISOString(),
      };
    }
    // Check for chat stats
    else if (
      lowerInput.includes("chat stats") ||
      lowerInput.includes("message count") ||
      lowerInput.includes("how many messages")
    ) {
      const messageCount = messages.length;
      return {
        text: `📊 Chat Statistics:\n• Messages in this session: ${messageCount}\n• You can type "clear chat" to reset.`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
    }
    // Check for goodbye
    else if (
      lowerInput.includes("bye") ||
      lowerInput.includes("goodbye") ||
      lowerInput.includes("see you later")
    ) {
      return {
        text: `Goodbye ${user}! Have a great day! 👋 Type "hello" to start a new conversation.`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
    }
    // Check for thanks
    else if (lowerInput.includes("thank") || lowerInput.includes("thanks")) {
      return {
        text: `You're welcome ${user}! 😊 Is there anything else I can help you with?`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
    }
    // Check for help/greetings
    else if (
      lowerInput.includes("help") ||
      lowerInput.includes("assist") ||
      lowerInput.includes("support") ||
      lowerInput.includes("how") ||
      lowerInput.includes("what") ||
      lowerInput.includes("hey") ||
      lowerInput.includes("hi") ||
      lowerInput.includes("hello") ||
      lowerInput.includes("good morning") ||
      lowerInput.includes("good afternoon") ||
      lowerInput.includes("good evening")
    ) {
      return {
        text: `Hey ${user}! 👋 I can help you with:\n• Navigating to sections (try "link to courses")\n• Checking notifications\n• Uploading files\n• Finding deadlines\n• Chat management ("clear chat", "chat stats")\n• Answering questions about CampusHub\n\nWhat would you like to do?`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
    }
    // Default response
    else {
      return {
        text: `I'm not sure how to respond to that. Try saying "help" to see what I can do!`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
    }
  };

  const handleUserInput = () => {
    if (input.trim() === "") return;

    const userMessage = {
      text: input,
      sender: user,
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Show typing indicator
    setIsTyping(true);

    // Process bot response with delay
    setTimeout(() => {
      const botResponse = processBotResponse(input);

      // Handle clear chat specially (it already updates messages)
      if (
        input.toLowerCase().includes("clear history") ||
        input.toLowerCase().includes("reset chat") ||
        input.toLowerCase().includes("clear chat")
      ) {
        // clearChat function already handles this
        setIsTyping(false);
        return;
      }

      // Add bot response
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000); // 1 second delay for realistic typing
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleUserInput();
    }
  };

  // Format timestamp
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
          <span className={styles.sessionBadge}>Session active</span>
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
                    onClick={() => {
                      setInput(suggestion);
                      handleUserInput();
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
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
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask CampusHub assistant (try 'link to courses')"
          disabled={isTyping} // Disable input while bot is typing
        />
        <button onClick={handleUserInput} disabled={isTyping}>
          <i className="fas fa-paper-plane"></i> Send
        </button>
      </div>
      <div className={styles.sessionFooter}>
        <small>Chat persisted for this session</small>
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
