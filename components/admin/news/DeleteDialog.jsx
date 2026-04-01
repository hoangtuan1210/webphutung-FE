import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { FiTrash2 } from "react-icons/fi";
import styles from "../../../styles/admin/newsAdmin.module.css";

export default function DeleteDialog({ open, news, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: styles.deleteDialog }}
    >
      <DialogContent className={styles.deleteContent}>
        <Box className={styles.deleteIconWrap}>
          <FiTrash2 size={22} color="#ef4444" />
        </Box>
        <Typography className={styles.deleteTitle}>Xóa tin tức?</Typography>
        <Typography className={styles.deleteDesc}>
          Bài viết <strong>{news?.title}</strong> sẽ bị xóa vĩnh viễn và không thể khôi phục.
        </Typography>
        <Box className={styles.deleteActions}>
          <button className={styles.btnCancel} onClick={onClose}>Hủy</button>
          <button className={styles.btnDelete} onClick={onConfirm}>Xóa bài viết</button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
