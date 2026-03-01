import { useEffect, useState } from "react";
import styles from "../../components.css.styles/login.module.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import campusHub_logo from "../../assets/campusHub.png";
const Login = () => {
  document.title = "Login";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Check if already logged in
  useEffect(() => {
    (async () => {
      const response = await fetch("https://campushub-backend-57dg.onrender.com/auth/check/logged", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "user" }),
        credentials: "include",
      });

      if (response.ok) {
        navigate("/homepage");
        document.title = "CampusHub";
      }
    })();
  }, [navigate]);

  const onSubmit = async (data) => {
    if (isLoading) return;

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://campushub-backend-57dg.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data), // SAME STRUCTURE
      });

      if (res.status === 429) {
        setMessage("Too many attempts. Try again later.");
        setIsLoading(false);
        return;
      }
      if (!res.ok) {
        const errorResult = await res.json();
        setMessage(errorResult.message || "Login failed");
        setIsLoading(false);
        return;
      }

      const result = await res.json();

      if (result.success) {
        localStorage.setItem(
          "username#campusHub0ZX",
          JSON.stringify(result.user),
        );

        navigate("/homepage");
        document.title = "CampusHub";
      } else {
        setMessage(result.message || "Login failed");
        setTimeout(() => {
          reset();
        }, 1000);
        setIsLoading(false);
      }
    } catch (err) {
      setMessage("Something went wrong");
      setIsLoading(false);
    } finally {
      setTimeout(() => {
        setMessage("");
        reset();
      }, 3000);
    }
  };
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <img src={campusHub_logo} alt="" />
        <h2>Welcome Again</h2>

        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className={styles.signup}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "green" }}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
