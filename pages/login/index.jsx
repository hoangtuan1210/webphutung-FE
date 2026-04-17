import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import styles from "@/styles/auth/login.module.css";
import { authService } from "@/services/authService";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";
        else if (!emailRegex.test(form.email)) newErrors.email = "Email không hợp lệ";
        if (!form.password) newErrors.password = "Vui lòng nhập mật khẩu";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        if (apiError) setApiError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await authService.login({
                email: form.email,
                password: form.password,
            });

            if (res?.success) {
                const { accessToken, user } = res.data || {};
                if (accessToken) {
                    localStorage.setItem("token", accessToken);
                }
                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));
                }

                toast.success("Đăng nhập thành công!");

                if (user?.role === "ADMIN") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/");
                }
            } else {
                setApiError(res?.message || "Email hoặc mật khẩu không đúng");
            }
        } catch (err) {
            setApiError("Đã có lỗi xảy ra, vui lòng thử lại");
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
                            <i className="bi bi-bag-heart-fill" />
                        </div>
                        <h1 className={styles.title}>Đăng nhập</h1>
                        <p className={styles.subtitle}>Chào mừng bạn quay trở lại!</p>
                    </div>

                    {apiError && (
                        <div className={`alert alert-danger ${styles.alertError}`} role="alert">
                            <i className="bi bi-exclamation-circle me-2" />
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className={styles.formLabel}>
                                Email <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${styles.formInput} ${errors.email ? "is-invalid" : ""}`}
                                placeholder="example@gmail.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                            {errors.email && <div className={styles.errorMsg}>{errors.email}</div>}
                        </div>

                        <div className="mb-1">
                            <label className={styles.formLabel}>
                                Mật khẩu <span className="text-danger">*</span>
                            </label>
                            <div className={styles.inputGroup}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className={`form-control ${styles.formInput} ${errors.password ? "is-invalid" : ""}`}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    style={{ paddingRight: "2.5rem" }}
                                />
                                <span
                                    className={styles.inputIcon}
                                    onClick={() => setShowPassword((v) => !v)}
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                                </span>
                            </div>
                            {errors.password && <div className={styles.errorMsg}>{errors.password}</div>}
                        </div>

                        <div className="mb-3">
                            <Link href="/forgot-password" className={styles.forgotLink}>
                                Quên mật khẩu?
                            </Link>
                            <div className="clearfix" />
                        </div>

                        <button
                            type="submit"
                            className={`btn ${styles.submitBtn}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-box-arrow-in-right me-2" />
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}