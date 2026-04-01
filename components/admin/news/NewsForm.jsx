import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FiImage } from "react-icons/fi";
import { CATEGORIES, STATUS_LIST } from "../../../constants/news";
import styles from "../../../styles/admin/newsAdmin.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

const DEFAULT_FORM = {
  title: "",
  category: "Công nghệ",
  status: "Nháp",
  content: "",
  thumbnail: "",
};

export default function NewsForm({ editData }) {
  const isEdit = !!editData;
  const router = useRouter();
  const [form, setForm] = useState(DEFAULT_FORM);

  // Sync form khi editData thay đổi
  useEffect(() => {
    setForm(editData || DEFAULT_FORM);
  }, [editData]);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    // Mock save logic ... sau này gọi API ở đây
    alert(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
    router.push("/admin/news");
  };

  const handleCancel = () => {
    router.push("/admin/news");
  };

  return (
    <Box className={styles.page}>
      <Box className={styles.pageHeader}>
        <Box>
          <Typography className={styles.pageTitle}>
            {isEdit ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}
          </Typography>
          <Typography className={styles.pageSub}>
            {isEdit ? `Đang sửa: #${editData?.id}` : "Điền đầy đủ thông tin bên dưới"}
          </Typography>
        </Box>
        <Box display="flex" gap="10px">
          <button className={styles.btnCancel} onClick={handleCancel}>Hủy bỏ</button>
          <button className={styles.btnSave} onClick={handleSave}>
            {isEdit ? "Lưu thay đổi" : "Thêm tin tức"}
          </button>
        </Box>
      </Box>

      <Box className={styles.card}>
        <Box className={styles.drawerBody} style={{ padding: 0 }}>
          {/* Thumbnail preview */}
          <Box className={styles.thumbSection}>
            <Typography className={styles.formLabel}>Ảnh đại diện</Typography>
            <Box className={styles.thumbPreview}>
              {form.thumbnail ? (
                <img src={form.thumbnail} alt="thumb" className={styles.thumbImg} />
              ) : (
                <Box className={styles.thumbPlaceholder}>
                  <FiImage size={28} color="#9ca3af" />
                  <Typography className={styles.thumbPlaceholderText}>Chưa có ảnh</Typography>
                </Box>
              )}
            </Box>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Nhập URL ảnh..."
              value={form.thumbnail}
              onChange={(e) => set("thumbnail", e.target.value)}
            />
          </Box>

          {/* Title */}
          <Box className={styles.formGroup}>
            <Typography className={styles.formLabel}>
              Tiêu đề <span className={styles.required}>*</span>
            </Typography>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Nhập tiêu đề tin tức..."
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Box>

          {/* Category + Status */}
          <Box className={styles.formRow}>
            <Box className={styles.formGroup}>
              <Typography className={styles.formLabel}>Danh mục</Typography>
              <select
                className={styles.formSelect}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.filter((c) => c !== "Tất cả").map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Box>
            <Box className={styles.formGroup}>
              <Typography className={styles.formLabel}>Trạng thái</Typography>
              <select
                className={styles.formSelect}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUS_LIST.filter((s) => s !== "Tất cả").map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Box>
          </Box>

          {/* Content */}
          <Box className={styles.formGroup}>
            <Typography className={styles.formLabel}>Nội dung</Typography>
            <textarea
              className={styles.formTextarea}
              placeholder="Nhập nội dung bài viết..."
              rows={8}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
