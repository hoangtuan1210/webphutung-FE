"use client";
import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import { FiBell, FiCheck, FiTrash2, FiShoppingBag, FiUser, FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";
import styles from "../../styles/admin/notification.module.css";


const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    icon: <FiShoppingBag size={15} />,
    title: "Đơn hàng mới #10234",
    desc: "Khách hàng Nguyễn Văn A vừa đặt đơn 2 sản phẩm.",
    time: "2 phút trước",
    read: false,
  },
  {
    id: 2,
    type: "user",
    icon: <FiUser size={15} />,
    title: "Người dùng mới đăng ký",
    desc: "Trần Thị B vừa tạo tài khoản mới trên hệ thống.",
    time: "15 phút trước",
    read: false,
  },
  {
    id: 3,
    type: "alert",
    icon: <FiAlertCircle size={15} />,
    title: "Cảnh báo tồn kho",
    desc: "Sản phẩm \"Áo thun basic\" sắp hết hàng (còn 3 cái).",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: 4,
    type: "success",
    icon: <FiCheckCircle size={15} />,
    title: "Thanh toán thành công",
    desc: "Đơn hàng #10229 đã được xác nhận thanh toán.",
    time: "3 giờ trước",
    read: true,
  },
  {
    id: 5,
    type: "info",
    icon: <FiInfo size={15} />,
    title: "Cập nhật hệ thống",
    desc: "Phiên bản v1.2.0 sẽ được triển khai vào 23:00 tối nay.",
    time: "Hôm qua",
    read: true,
  },
];

function NotifItem({ notif, onRead, onDelete }) {
  return (
    <Box
      className={`${styles.item} ${!notif.read ? styles.itemUnread : ""}`}
      onClick={() => onRead(notif.id)}
    >
      <Box className={`${styles.iconWrap} ${styles[`icon_${notif.type}`]}`}>
        {notif.icon}
      </Box>

      <Box className={styles.itemBody}>
        <Typography className={styles.itemTitle}>{notif.title}</Typography>
        <Typography className={styles.itemDesc}>{notif.desc}</Typography>
        <Typography className={styles.itemTime}>{notif.time}</Typography>
      </Box>

      <Box className={styles.itemActions}>
        {!notif.read && <Box className={styles.unreadDot} />}
        <IconButton
          size="small"
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notif.id);
          }}
        >
          <FiTrash2 size={13} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function Notification() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteNotif = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <Box className={styles.wrapper} ref={ref}>
      <IconButton
        size="small"
        className={`${styles.bellBtn} ${open ? styles.bellBtnActive : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={9}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.6rem",
              minWidth: 16,
              height: 16,
              padding: "0 4px",
            },
          }}
        >
          <FiBell size={16} />
        </Badge>
      </IconButton>

      {open && (
        <Box className={styles.panel}>
          {/* Header */}
          <Box className={styles.panelHeader}>
            <Box>
              <Typography className={styles.panelTitle}>Thông báo</Typography>
              {unreadCount > 0 && (
                <Typography className={styles.panelSub}>
                  {unreadCount} chưa đọc
                </Typography>
              )}
            </Box>
            {unreadCount > 0 && (
              <button className={styles.markAllBtn} onClick={markAllRead}>
                <FiCheck size={12} /> Đọc tất cả
              </button>
            )}
          </Box>

          <Divider sx={{ borderColor: "#e2e8f0" }} />

          <Box className={styles.list}>
            {notifications.length === 0 ? (
              <Box className={styles.emptyState}>
                <FiBell size={32} className={styles.emptyIcon} />
                <Typography className={styles.emptyText}>
                  Không có thông báo nào
                </Typography>
              </Box>
            ) : (
              notifications.map((n) => (
                <NotifItem
                  key={n.id}
                  notif={n}
                  onRead={markAsRead}
                  onDelete={deleteNotif}
                />
              ))
            )}
          </Box>
          {notifications.length > 0 && (
            <>
              <Divider sx={{ borderColor: "#e2e8f0" }} />
              <Box className={styles.panelFooter}>
                <button className={styles.footerBtn} onClick={clearAll}>
                  <FiTrash2 size={12} /> Xóa tất cả
                </button>
                <button className={styles.footerBtnPrimary}>
                  Xem tất cả
                </button>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}