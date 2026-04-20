import styles from "@/styles/client/floatingContact.module.css";

export default function FloatingContact() {
  return (
    <div className={styles.container}>
      <a
        href="https://m.me/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.item} ${styles.messenger}`}
      >
        <div className={styles.ripple} />
        <div className={styles.iconWrapper}>
          <i className="bi bi-messenger" />
        </div>
      </a>

      <a
        href="https://zalo.me/0938884300"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.item} ${styles.zalo}`}
      >
        <div className={styles.ripple} />
        <div className={styles.iconWrapper}>
          <svg
            viewBox="0 0 240 240"
            className={styles.zaloIcon}
            fill="#ffffff"
          >
            <path d="M198 120c0 42.1-34.9 76.2-78 76.2-12.7 0-24.7-3-35.3-8.3L40 200l11.4-42.3C45 147.2 42 134 42 120c0-42.1 34.9-76.2 78-76.2s78 34.1 78 76.2z" />
            <text x="50%" y="55%" textAnchor="middle" fill="#0084FF" fontSize="50" fontWeight="bold" fontFamily="Arial">Zalo</text>
          </svg>
        </div>
      </a>
      <a
        href="tel:0938884300"
        className={`${styles.item} ${styles.phone}`}
      >
        <div className={styles.ripple} />
        <div className={styles.iconWrapper}>
          <i className="bi bi-telephone-fill" />
        </div>
      </a>
    </div>
  );
}
