import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import OTPVerify from "./otp.verify";

const Signup = () => {
  let navigate = useNavigate();
  let [otpView, resetView] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocus, setInputFocus] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [shakeError, setShakeError] = useState(false);

  const formRef = useRef(null);
  const buttonRef = useRef(null);
  document.title = "Sign-up";
  function loginDirect() {
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  }
  useEffect(() => {
    // Initial animation when component mounts
    const timer = setTimeout(() => {
      if (formRef.current) {
        formRef.current.style.opacity = "1";
        formRef.current.style.transform = "translateY(0)";
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    (async () => {
      // checking if user is logged in
      let Response = await fetch("https://campushub-backend-57dg.onrender.com/auth/check/logged", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "user" }),
        credentials: "include",
      });
      if (Response.ok) {
        navigate("/homepage");
        document.title = "CampusHub";
        return;
      }
      //
    })();
  }, []);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setShakeError(false);
  };

  const handleFocus = (field) => {
    setInputFocus({
      ...inputFocus,
      [field]: true,
    });
  };

  const handleBlur = (field) => {
    setInputFocus({
      ...inputFocus,
      [field]: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    setIsLoading(true);

    // Add loading animation
    if (buttonRef.current) {
      buttonRef.current.style.width = `${buttonRef.current.offsetWidth}px`;
    }
    fetch("https://campushub-backend-57dg.onrender.com/auth/signUp", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "OTP created") {
          setError("Almost there continue...");
          resetView(true);
        }
        if (data.message === "email already exists") {
          setError("Email already exists");
          loginDirect();
        }
      })

      .catch((err) => {
        if (err.status === 429) {
          return setError(err.response.message);
        }
        setError("Server error");
      })
      .finally(() => {
        setIsLoading(false);
      });

    setTimeout(() => {
      //   setIsLoading(false);
      // Success animation
      if (formRef.current) {
        formRef.current.style.animation = "successPulse 0.5s ease-in-out";
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.style.animation = "";
          }
        }, 500);
      }
      //   alert("Account created successfully );
    }, 1500);
  };

  return (
    <>
      {!otpView ? (
        <div>
          <div className="signup-container">
            {/* Animated Background Elements */}
            <div className="bg-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
            </div>

            <form ref={formRef} className="signup-form" onSubmit={handleSubmit}>
              <h2 className="form-title">
                <span className="title-text">Create Account</span>
                <div className="title-underline"></div>
              </h2>

              {error && (
                <div className={`error-message ${shakeError ? "shake" : ""}`}>
                  <span className="error-icon">⚠</span>
                  {error}
                </div>
              )}

              <div className="input-group">
                <div
                  className={`input-container ${inputFocus.email ? "focused" : ""}`}
                >
                  <label
                    className={`input-label ${formData.email ? "filled" : ""}`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                    className={formData.email ? "has-value" : ""}
                  />
                  <div className="input-border"></div>
                  {formData.email && <div className="input-check">✓</div>}
                </div>
              </div>

              <div className="input-group">
                <div
                  className={`input-container ${inputFocus.password ? "focused" : ""}`}
                >
                  <label
                    className={`input-label ${formData.password ? "filled" : ""}`}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus("password")}
                    onBlur={() => handleBlur("password")}
                    className={formData.password ? "has-value" : ""}
                  />
                  <div className="input-border"></div>
                  <div className="password-strength">
                    {formData.password.length > 0 && (
                      <div className="strength-meter">
                        <div
                          className={`strength-bar ${formData.password.length < 6 ? "weak" : formData.password.length < 10 ? "medium" : "strong"}`}
                          style={{
                            width: `${Math.min(formData.password.length * 8.33, 100)}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="input-group">
                <div
                  className={`input-container ${inputFocus.confirmPassword ? "focused" : ""}`}
                >
                  <label
                    className={`input-label ${formData.confirmPassword ? "filled" : ""}`}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => handleFocus("confirmPassword")}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={formData.confirmPassword ? "has-value" : ""}
                  />
                  <div className="input-border"></div>
                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <div className="input-check success">✓</div>
                    )}
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <div className="input-check error">✗</div>
                    )}
                </div>
              </div>

              <p className="login-link">
                Already have an account?{" "}
                <Link className="links" to="/login">
                  Login
                </Link>
              </p>

              <button
                ref={buttonRef}
                type="submit"
                disabled={isLoading}
                className={`submit-btn ${isLoading ? "loading" : ""}`}
              >
                <span className="btn-text">
                  {isLoading ? "Creating account..." : "Sign Up"}
                </span>
                <span className="btn-loading">
                  <div className="loading-spinner"></div>
                </span>
                <span className="btn-success">✓</span>
              </button>

              <div className="form-footer">
                <div className="terms">
                  By signing up, you agree to our <a href="#">Terms</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </div>
              </div>
            </form>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(10, 31, 58, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(10, 31, 58, 0); }
        }

        @keyframes slideIn {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .signup-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(-45deg, #0a1f3a, #162b50, #0a1f3a, #1e3a8a);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          position: relative;
          overflow: hidden;
        }

        .bg-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(74, 222, 128, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: -150px;
          left: -150px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          bottom: -100px;
          right: -100px;
          animation-delay: 2s;
          background: rgba(34, 211, 238, 0.1);
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          left: 10%;
          animation-delay: 4s;
          background: rgba(255, 255, 255, 0.05);
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          bottom: 30%;
          right: 20%;
          animation-delay: 6s;
          background: rgba(74, 222, 128, 0.05);
        }

        .signup-form {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          width: 380px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 10;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-title {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .title-text {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #0a1f3a, #4ade80);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .title-underline {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #0a1f3a, #4ade80);
          margin: 0.5rem auto 0;
          border-radius: 2px;
          animation: slideIn 0.8s ease-out 0.4s both;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.8rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
          animation: fadeInUp 0.3s ease-out;
        }

        .error-message.shake {
          animation: shake 0.5s ease-in-out;
        }

        .error-icon {
          font-size: 1.1rem;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-container {
          position: relative;
        }

        .input-label {
          position: absolute;
          left: 0.8rem;
          top: 0.8rem;
          font-size: 0.9rem;
          color: #666;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          padding: 0 0.3rem;
          z-index: 2;
        }

        .input-label.filled,
        .input-container.focused .input-label {
          top: -0.6rem;
          font-size: 0.75rem;
          color: #0a1f3a;
          font-weight: 600;
        }

        input {
          width: 100%;
          padding: 0.9rem;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          font-size: 0.95rem;
          background: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
        }

        input:focus {
          outline: none;
          border-color: #0a1f3a;
          box-shadow: 0 0 0 3px rgba(10, 31, 58, 0.1);
        }

        .input-container.focused input {
          padding-top: 1.1rem;
          padding-bottom: 0.7rem;
        }

        .input-border {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #0a1f3a, #4ade80);
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        .input-container.focused .input-border {
          transform: scaleX(1);
        }

        .input-check {
          position: absolute;
          right: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: #10b981;
          font-weight: bold;
          opacity: 0;
          animation: fadeInUp 0.3s ease-out forwards;
        }

        .input-check.success {
          color: #10b981;
        }

        .input-check.error {
          color: #ef4444;
        }

        .password-strength {
          margin-top: 0.5rem;
          height: 4px;
        }

        .strength-meter {
          width: 100%;
          height: 100%;
          background: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-bar {
          height: 100%;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .strength-bar.weak {
          background: #ef4444;
        }

        .strength-bar.medium {
          background: #f59e0b;
        }

        .strength-bar.strong {
          background: #10b981;
        }

        .login-link {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
          margin: 1.5rem 0;
          animation: fadeInUp 0.6s ease-out 0.6s both;
        }

        .links {
          color: #0a1f3a;
          text-decoration: none;
          font-weight: 600;
          position: relative;
          transition: color 0.3s ease;
        }

        .links::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #0a1f3a, #4ade80);
          transition: width 0.3s ease;
        }

        .links:hover {
          color: #4ade80;
        }

        .links:hover::after {
          width: 100%;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #0a1f3a, #162b50);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: pulse 2s infinite;
          animation-delay: 1s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(10, 31, 58, 0.3);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }

        .submit-btn.loading {
          animation: none;
        }

        .btn-text {
          display: block;
          transition: opacity 0.3s ease;
        }

        .submit-btn.loading .btn-text {
          opacity: 0;
        }

        .btn-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .submit-btn.loading .btn-loading {
          opacity: 1;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .btn-success {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          font-size: 1.2rem;
        }

        .form-footer {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e0e0e0;
          text-align: center;
        }

        .terms {
          font-size: 0.8rem;
          color: #666;
          line-height: 1.4;
        }

        .terms a {
          color: #0a1f3a;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .terms a:hover {
          color: #4ade80;
          text-decoration: underline;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .signup-form {
            width: 90%;
            padding: 2rem;
            margin: 1rem;
          }
          
          .signup-container {
            padding: 1rem;
          }
        }
      `}</style>
          </div>
        </div>
      ) : (
        <div>
          <OTPVerify email={formData.email} />
        </div>
      )}
    </>
  );
};

export default Signup;
