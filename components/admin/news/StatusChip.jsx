import { FiCheckCircle, FiClock, FiEyeOff } from "react-icons/fi";
import styles from "../../../styles/admin/newsAdmin.module.css";

const STATUS_MAP = {
  "Đã đăng": { cls: styles.chipPublished, icon: <FiCheckCircle size={11} /> },
  "Nháp":    { cls: styles.chipDraft,     icon: <FiClock size={11} /> },
  "Ẩn":      { cls: styles.chipHidden,    icon: <FiEyeOff size={11} /> },
};

export default function StatusChip({ status }) {
  const { cls, icon } = STATUS_MAP[status] || {};
  return (
    <span className={`${styles.chip} ${cls}`}>
      {icon} {status}
    </span>
  );
}
