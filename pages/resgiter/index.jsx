import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import styles from "@/styles/auth/resgiter.module.css";
import { authService } from "@/services/authService";

function getPasswordStrength(password) {
    if (!password) return null;
    if (password.length < 6) return "weak";
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score <= 1) return "weak";
    if (score === 2) return "fair";
    return "strong";
}

const STRENGTH_LABEL = {
    weak: { label: "Yếu", cls: styles.strengthWeak },
    fair: { label: "Trung bình", cls: styles.strengthFair },
    strong: { label: "Mạnh", cls: styles.strengthStrong },
};

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const strength = getPasswordStrength(form.password);

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

        if (!form.firstName.trim()) newErrors.firstName = "Vui lòng nhập tên";
        if (!form.lastName.trim()) newErrors.lastName = "Vui lòng nhập họ";
        if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";
        else if (!emailRegex.test(form.email)) newErrors.email = "Email không hợp lệ";
        if (form.phone && !phoneRegex.test(form.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
        if (!form.password) newErrors.password = "Vui lòng nhập mật khẩu";
        else if (!passwordRegex.test(form.password))
            newErrors.password = "Tối thiểu 8 ký tự, có chữ hoa, số và ký tự đặc biệt";
        if (!form.confirmPassword) newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        else if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Mật khẩu không khớp";

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
            const res = await authService.register({
                email: form.email,
                password: form.password,
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone || undefined,
            });

            if (res?.success) {
                toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
                router.push("/login");
            } else {
                setApiError(res?.message || "Đăng ký thất bại, vui lòng thử lại");
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

                    {/* Logo */}
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <i className="bi bi-person-plus-fill" />
                        </div>
                        <h1 className={styles.title}>Tạo tài khoản</h1>
                        <p className={styles.subtitle}>Đăng ký để bắt đầu mua sắm!</p>
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div className={`alert alert-danger ${styles.alertError}`} role="alert">
                            <i className="bi bi-exclamation-circle me-2" />
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Họ & Tên */}
                        <div className="row g-2 mb-3">
                            <div className="col-6">
                                <label className={styles.formLabel}>
                                    Họ <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className={`form-control ${styles.formInput} ${errors.lastName ? "is-invalid" : ""}`}
                                    placeholder="Nguyễn"
                                    value={form.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && <div className={styles.errorMsg}>{errors.lastName}</div>}
                            </div>
                            <div className="col-6">
                                <label className={styles.formLabel}>
                                    Tên <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className={`form-control ${styles.formInput} ${errors.firstName ? "is-invalid" : ""}`}
                                    placeholder="Văn A"
                                    value={form.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && <div className={styles.errorMsg}>{errors.firstName}</div>}
                            </div>
                        </div>

                        {/* Email */}
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

                        {/* Phone */}
                        <div className="mb-3">
                            <label className={styles.formLabel}>Số điện thoại</label>
                            <input
                                type="tel"
                                name="phone"
                                className={`form-control ${styles.formInput} ${errors.phone ? "is-invalid" : ""}`}
                                placeholder="012345678"
                                value={form.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <div className={styles.errorMsg}>{errors.phone}</div>}
                        </div>

                        {/* Password */}
                        <div className="mb-3">
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
                                    autoComplete="new-password"
                                    style={{ paddingRight: "2.5rem" }}
                                />
                                <span className={styles.inputIcon} onClick={() => setShowPassword((v) => !v)}>
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                                </span>
                            </div>
                            {/* Strength bar */}
                            {strength && (
                                <>
                                    <div className={`${styles.strengthBar} ${STRENGTH_LABEL[strength].cls}`} />
                                    <p className={styles.passwordHint}>
                                        Độ mạnh: <b>{STRENGTH_LABEL[strength].label}</b> — Tối thiểu 8 ký tự, chữ hoa, số và ký tự đặc biệt (!@#$%^&*)
                                    </p>
                                </>
                            )}
                            {errors.password && <div className={styles.errorMsg}>{errors.password}</div>}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-3">
                            <label className={styles.formLabel}>
                                Xác nhận mật khẩu <span className="text-danger">*</span>
                            </label>
                            <div className={styles.inputGroup}>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    className={`form-control ${styles.formInput} ${errors.confirmPassword ? "is-invalid" : ""}`}
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    style={{ paddingRight: "2.5rem" }}
                                />
                                <span className={styles.inputIcon} onClick={() => setShowConfirm((v) => !v)}>
                                    <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`} />
                                </span>
                            </div>
                            {errors.confirmPassword && (
                                <div className={styles.errorMsg}>{errors.confirmPassword}</div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className={`btn ${styles.submitBtn}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Đang đăng ký...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-person-check-fill me-2" />
                                    Đăng ký
                                </>
                            )}
                        </button>
                    </form>

                    <div className={styles.divider}>hoặc</div>

                    <p className={styles.loginLink}>
                        Đã có tài khoản?{" "}
                        <Link href="/login">Đăng nhập ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}