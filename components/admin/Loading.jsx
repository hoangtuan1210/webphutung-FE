import styles from "@/styles/loading.module.css";

export default function Loading({ fullScreen = false }) {
  return (
    <div className={fullScreen ? styles.overlay : styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Đang tải dữ liệu...</p>
    </div>
  );
}