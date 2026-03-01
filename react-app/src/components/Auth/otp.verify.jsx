import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../../components.css.styles/otp.module.css";

const OTPVerify = ({ email }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ message: "", status: true });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("error"); // success or error
  const [otpDigits, setOtpDigits] = useState(Array(4).fill(""));

  const navigate = useNavigate();
  const otpInputsRef = useRef([]);
  const formRef = useRef(null);
  const notificationRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  document.title = "otp-verfication";
  // Show notification when error/success changes
  useEffect(() => {
    if (error.message !== "") {
      setShowNotification(true);
      setNotificationType(error.status ? "success" : "error");
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Step transition animation
  useEffect(() => {
    if (formRef.current) {
      formRef.current.style.opacity = "0.7";
      formRef.current.style.transform = "translateX(20px)";
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.style.opacity = "1";
          formRef.current.style.transform = "translateX(0)";
        }
      }, 300);
    }
  }, []);

  // Auto-focus OTP inputs
  useEffect(() => {
    if (otpInputsRef.current[0]) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 400);
    }
  }, []);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    setValue("otp", newOtpDigits.join(""));

    // Auto-focus next input
    if (value && index < 3 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }

    // Auto-focus previous input on backspace
    if (!value && index > 0 && otpInputsRef.current[index - 1]) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  // OTP SUBMIT
  const onOtpSubmit = (data) => {
    if (isLoading) return;
    setIsLoading(true);
    fetch("https://campushub-backend-57dg.onrender.com/auth/verify-otp", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp: data.otp,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          setError({
            message: result.message || "OTP verified successfully",
            status: result.success,
          });
          setTimeout(() => {
            navigate("/login");
            document.title = "Home";
          }, 3000);
        }
        if (result.success === false) {
          setError({
            message: result.message || "Session Expired",
            status: result.success,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setError({
          message:  "OTP verification failed",
          status: false,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles["otp"]}>
      {/* Animated Notification */}
      <div
        ref={notificationRef}
        className={`${styles["notification"]} ${showNotification ? styles["show"] : ""} ${styles[notificationType]}`}
        onClick={() => setShowNotification(false)}
      >
        <div className={styles["notification-icon"]}>
          {notificationType === "success" ? "✓" : "⚠"}
        </div>
        <div className={styles["notification-content"]}>
          <p className={styles["notification-message"]}>{error.message}</p>
          <p className={styles["notification-subtitle"]}>
            {notificationType === "success"
              ? "Success"
              : "Please enter your OTP"}
          </p>
        </div>
        <button
          className={styles["notification-close"]}
          onClick={() => {
            setShowNotification(false);
          }}
        >
          ×
        </button>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit(onOtpSubmit)}
        className={styles["login-form"]}
      >
        {/* Form Header */}
        <div className={styles["form-header"]}>
          <div className={styles["logo"]}>
            <span className={styles["logo-icon"]}>🎓</span>
            <span className={styles["logo-text"]}>CampusHub</span>
          </div>
          <h2 className={styles["form-title"]}>
            <span className={styles["title-text"]}>Verify Identity</span>
            <div className={styles["title-underline"]}></div>
          </h2>
          <p className={styles["form-subtitle"]}>
            Enter OTP sent to your email
          </p>
        </div>

        {/* OTP Step */}
        <div className={`${styles["form-step"]} ${styles["otp-step"]}`}>
          <div className={styles["otp-header"]}>
            <p className={styles["otp-email"]}>
              OTP sent to{" "}
              <span className={styles["email-highlight"]}>{email}</span>
            </p>
            <p className={styles["otp-instruction"]}>
              Enter the 4-digit verification code
            </p>
          </div>

          <div className={styles["otp-inputs"]}>
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className={styles["otp-digit-container"]}>
                <input
                  ref={(el) => (otpInputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={otpDigits[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className={styles["otp-digit"]}
                  placeholder="0"
                />
                {index < 3 && <div className={styles["digit-separator"]}></div>}
              </div>
            ))}
          </div>
          <input
            type="hidden"
            {...register("otp", {
              required: "OTP is required",
              minLength: { value: 4, message: "OTP must be 4 digits" },
            })}
          />
          {errors.otp && (
            <p className={`${styles["input-error"]} ${styles["otp-error"]}`}>
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`${styles["submit-button"]} ${isLoading ? styles["loading"] : ""}`}
        >
          <span className={styles["button-text"]}>
            {isLoading ? "Please wait..." : "Verify OTP"}
          </span>
          <span className={styles["button-loader"]}>
            <div className={styles["spinner"]}></div>
          </span>
          <span className={styles["button-icon"]}>✓</span>
        </button>

        {/* Form Footer */}
        <div className={styles["form-footer"]}>
          <p className={styles["security-note"]}>
            🔒 Your verification is secured with end-to-end encryption
          </p>
        </div>
      </form>
    </div>
  );
};

export default OTPVerify;
