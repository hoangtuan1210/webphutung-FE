import styles from "@/styles/client/home.module.css";

const FEATURES = [
  {
    icon: "bi-shield-check",
    title: "Chất lượng sản phẩm",
    desc: "Cam kết phụ tùng chính hãng từ nhà máy sản xuất",
    color: "#ff3d00",
  },
  {
    icon: "bi-truck",
    title: "Giao hàng hỏa tốc",
    desc: "Nhận hàng nhanh chóng trong nội thành và toàn quốc",
    color: "#2979ff",
  },
  {
    icon: "bi-tools",
    title: "Chăm sóc khách hàng",
    desc: "Đội ngũ nhân viên tư vấn chi tiết, nhiệt tình",
    color: "#00c853",
  },
  {
    icon: "bi-arrow-repeat",
    title: "Đổi trả dễ dàng",
    desc: "Hỗ trợ đổi trả trong vòng 7 ngày nếu lỗi từ nhà sản xuất",
    color: "#ffa000",
  },
];

export default function FeaturesSection() {
  return (
    <div className="container mt-5">
      <div className="row g-4">
        {FEATURES.map((f, i) => (
          <div key={i} className="col-6 col-lg-3">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ backgroundColor: f.color + "15", color: f.color }}>
                <i className={`bi ${f.icon}`} />
              </div>
              <h5 className={styles.featureTitle}>{f.title}</h5>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
