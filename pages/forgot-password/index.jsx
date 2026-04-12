import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import styles from "@/styles/auth/login.module.css";
import { authService } from "@/services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Vui lòng nhập email");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Email không hợp lệ");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authService.forgotPassword(email.trim());
      if (res?.success !== false) {
        setSent(true);
        toast.success("Email đặt lại mật khẩu đã được gửi!");
      } else {
        toast.error(res?.message || "Không tìm thấy tài khoản với email này");
      }
    } catch (err) {
      toast.error(err?.message || "Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.card}>

          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <i className="bi bi-shield-lock-fill" />
            </div>
            <h1 className={styles.title}>Quên mật khẩu</h1>
            <p className={styles.subtitle}>
              {sent
                ? "Kiểm tra hộp thư của bạn!"
                : "Nhập email để nhận link đặt lại mật khẩu"}
            </p>
          </div>

          {sent ? (
            <div className="text-center py-3">
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#d1fae5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                }}
              >
                <i className="bi bi-envelope-check-fill" style={{ fontSize: "2rem", color: "#059669" }} />
              </div>
              <p className="text-muted mb-1" style={{ fontSize: "0.95rem" }}>
                Chúng tôi đã gửi link đặt lại mật khẩu tới
              </p>
              <p className="fw-bold mb-4" style={{ color: "#111" }}>{email}</p>
              <p className="text-muted small mb-4">
                Không nhận được email? Kiểm tra thư mục Spam hoặc{" "}
                <button
                  className="btn btn-link p-0 text-danger fw-semibold"
                  style={{ fontSize: "0.9rem", textDecoration: "underline", verticalAlign: "baseline" }}
                  onClick={() => { setSent(false); }}
                >
                  gửi lại
                </button>
              </p>
              <Link href="/login" className={`btn ${styles.submitBtn}`}>
                <i className="bi bi-arrow-left me-2" />
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label className={styles.formLabel}>
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${styles.formInput} ${emailError ? "is-invalid" : ""}`}
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  autoComplete="email"
                />
                {emailError && <div className={styles.errorMsg}>{emailError}</div>}
              </div>

              <button
                type="submit"
                className={`btn ${styles.submitBtn}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2" />
                    Gửi link đặt lại mật khẩu
                  </>
                )}
              </button>
            </form>
          )}

          {!sent && (
            <p className={styles.registerLink} style={{ marginTop: "1.25rem" }}>
              <Link href="/login" className={styles.forgotLink}>
                <i className="bi bi-arrow-left me-1" />
                Quay lại đăng nhập
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
