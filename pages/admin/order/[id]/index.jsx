"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { ALL_ORDERS } from "@/data/order";
import {
  FiArrowLeft,
  FiPhone,
  FiMail,
  FiMapPin,
  FiPackage,
  FiCreditCard,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEdit2,
  FiPrinter,
  FiDownload,
  FiAlertCircle,
  FiUser,
  FiShoppingCart,
} from "react-icons/fi";
import AdminLayout from "@/layouts/AdminLayout";
import styles from "../../../../styles/admin/orderDetail.module.css";

// ─── CONFIGS ──────────────────────────────────────────────────────────────────
const STATUS_CFG = {
  "Hoàn thành": { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: <FiCheckCircle size={14} /> },
  "Đang giao":  { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: <FiTruck size={14} /> },
  "Đang xử lý": { color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: <FiPackage size={14} /> },
  "Chờ duyệt":  { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: <FiClock size={14} /> },
  Huỷ:          { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: <FiXCircle size={14} /> },
};

const TIMELINE = {
  "Hoàn thành": [
    { label: "Đơn hàng đặt", done: true },
    { label: "Đã xác nhận",  done: true },
    { label: "Đang xử lý",   done: true },
    { label: "Đang giao",    done: true },
    { label: "Hoàn thành",   done: true },
  ],
  "Đang giao": [
    { label: "Đơn hàng đặt", done: true },
    { label: "Đã xác nhận",  done: true },
    { label: "Đang xử lý",   done: true },
    { label: "Đang giao",    done: true },
    { label: "Hoàn thành",   done: false },
  ],
  "Đang xử lý": [
    { label: "Đơn hàng đặt", done: true },
    { label: "Đã xác nhận",  done: true },
    { label: "Đang xử lý",   done: true },
    { label: "Đang giao",    done: false },
    { label: "Hoàn thành",   done: false },
  ],
  "Chờ duyệt": [
    { label: "Đơn hàng đặt", done: true },
    { label: "Đã xác nhận",  done: false },
    { label: "Đang xử lý",   done: false },
    { label: "Đang giao",    done: false },
    { label: "Hoàn thành",   done: false },
  ],
  Huỷ: [
    { label: "Đơn hàng đặt", done: true },
    { label: "Đã xác nhận",  done: false },
    { label: "Đơn bị huỷ",   done: true, cancelled: true },
  ],
};

const PAYMENT_CFG = {
  COD:            { color: "#374151", bg: "#f9fafb", border: "#e5e7eb" },
  "Chuyển khoản": { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "Ví điện tử":   { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
};

const STATUS_OPTIONS = ["Chờ duyệt", "Đang xử lý", "Đang giao", "Hoàn thành", "Huỷ"];

const fmtVND = (n) => n?.toLocaleString("vi-VN") + "₫";

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const order = useMemo(
    () => ALL_ORDERS.find((o) => o.id === id) ?? null,
    [id]
  );

  const [currentStatus, setCurrentStatus] = useState(order?.status ?? "");
  const [statusChanged, setStatusChanged] = useState(false);

  // Sync khi order load xong
  if (order && currentStatus === "" && order.status) {
    setCurrentStatus(order.status);
  }

  const cfg        = STATUS_CFG[currentStatus]  ?? STATUS_CFG["Chờ duyệt"];
  const timeline   = TIMELINE[currentStatus]    ?? TIMELINE["Chờ duyệt"];
  const paymentCfg = PAYMENT_CFG[order?.payment] ?? PAYMENT_CFG["COD"];

  const shipping = Math.round(order?.amount * 0.03) || 0;
  const discount = currentStatus === "Hoàn thành" ? 50000 : 0;
  const total    = order ? order.amount + shipping - discount : 0;

  // ─── NOT FOUND ──────────────────────────────────────────────────────────────
  if (router.isReady && !order) {
    return (
      <Box className={styles.notFound}>
        <FiAlertCircle size={48} color="#e5e7eb" />
        <Typography className={styles.notFoundText}>
          Không tìm thấy đơn hàng <strong>{id}</strong>
        </Typography>
        <Button
          component={Link}
          href="/admin/order"
          startIcon={<FiArrowLeft size={14} />}
          className={styles.btnPrimary}
        >
          Quay lại danh sách
        </Button>
      </Box>
    );
  }

  if (!order) return null;

  return (
    <Box className={styles.pageRoot}>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <Box className={styles.topBar}>
        <Box className={styles.topBarLeft}>
          <Button
            component={Link}
            href="/admin/order"
            startIcon={<FiArrowLeft size={14} />}
            className={styles.btnBack}
          >
            Quay lại
          </Button>
          <Box>
            <Typography className={styles.topBarTitle}>Chi tiết đơn hàng</Typography>
            <Typography className={styles.topBarMeta}>
              {order.id} · {order.date} {order.time}
            </Typography>
          </Box>
        </Box>

        <Box className={styles.topBarActions}>
          <Button startIcon={<FiPrinter size={13} />} className={styles.btnSecondary}>
            In đơn
          </Button>
          <Button startIcon={<FiDownload size={13} />} className={styles.btnSecondary}>
            Xuất PDF
          </Button>
          <Button
            component={Link}
            href={`/admin/order/${id}/edit`}
            startIcon={<FiEdit2 size={13} />}
            className={styles.btnPrimary}
          >
            Chỉnh sửa
          </Button>
        </Box>
      </Box>

      {/* ── Main grid ────────────────────────────────────────────────────── */}
      <Box className={styles.mainGrid}>

        {/* ── LEFT COLUMN ────────────────────────────────────────────────── */}
        <Box className={styles.leftColumn}>

          {/* Order Timeline */}
          <Box className={styles.card}>
            <CardHeader
              icon={<FiPackage size={15} />}
              title="Trạng thái đơn hàng"
              right={
                <Box className={styles.statusActionRow}>
                  <Select
                    value={currentStatus}
                    onChange={(e) => { setCurrentStatus(e.target.value); setStatusChanged(true); }}
                    size="small"
                    sx={{
                      fontSize: "0.8rem",
                      height: 32,
                      minWidth: 140,
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8ecf0", borderRadius: "8px" },
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s} sx={{ fontSize: "0.82rem" }}>{s}</MenuItem>
                    ))}
                  </Select>
                  {statusChanged && (
                    <Button
                      size="small"
                      onClick={() => setStatusChanged(false)}
                      className={styles.btnSave}
                    >
                      Lưu
                    </Button>
                  )}
                </Box>
              }
            />

            {/* Steps */}
            <Box className={styles.timeline}>
              {timeline.map((step, i) => (
                <Box key={step.label} className={styles.timelineStep}>
                  {/* Connector */}
                  {i < timeline.length - 1 && (
                    <Box
                      className={styles.timelineConnector}
                      sx={{ bgcolor: step.done && timeline[i + 1]?.done ? "#4f67f5" : "#e8ecf0" }}
                    />
                  )}
                  {/* Dot */}
                  <Box
                    className={styles.timelineDot}
                    sx={{
                      bgcolor:    step.cancelled ? "#fef2f2" : step.done ? "#eef2ff" : "#f9fafb",
                      border:     `2px solid ${step.cancelled ? "#dc2626" : step.done ? "#4f67f5" : "#e8ecf0"}`,
                    }}
                  >
                    {step.cancelled
                      ? <FiXCircle size={12} color="#dc2626" />
                      : step.done
                        ? <FiCheckCircle size={12} color="#4f67f5" />
                        : <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#d1d5db" }} />
                    }
                  </Box>
                  <Typography
                    className={`${styles.timelineLabel} ${step.done ? styles.timelineLabelDone : styles.timelineLabelPending}`}
                  >
                    {step.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Footer badge */}
            <Box className={styles.timelineFooter}>
              <Box
                className={styles.statusBadge}
                sx={{ bgcolor: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
              >
                {cfg.icon}
                {currentStatus}
              </Box>
              {order.note && (
                <Typography className={styles.timelineNote}>
                  Ghi chú: {order.note}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Products */}
          <Box className={styles.card}>
            <CardHeader icon={<FiShoppingCart size={15} />} title="Sản phẩm đặt hàng" />
            <Box className={styles.tableWrapper}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles.tableHeadCell}>Sản phẩm</TableCell>
                      <TableCell className={styles.tableHeadCell} align="center">Số lượng</TableCell>
                      <TableCell className={styles.tableHeadCell} align="right">Đơn giá</TableCell>
                      <TableCell className={styles.tableHeadCell} align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className={styles.tableBodyCell}>
                        <Box className={styles.productCell}>
                          <Box className={styles.productIcon}>
                            <FiPackage size={16} color="#4f67f5" />
                          </Box>
                          <Box>
                            <Typography className={styles.productName}>{order.product}</Typography>
                            <Typography className={styles.productSku}>SKU: {order.id}-01</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell className={styles.tableBodyCell} align="center">
                        <Box className={styles.qtyBadge}>{order.qty}</Box>
                      </TableCell>
                      <TableCell className={styles.tableBodyCell} align="right">
                        <Typography sx={{ fontSize: "0.85rem", color: "#6b7280" }}>
                          {fmtVND(order.unitPrice)}
                        </Typography>
                      </TableCell>
                      <TableCell className={styles.tableBodyCell} align="right">
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>
                          {fmtVND(order.unitPrice * order.qty)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Summary */}
            <Box className={styles.summarySection}>
              <SummaryRow label="Tạm tính"       value={fmtVND(order.amount)} />
              <SummaryRow label="Phí vận chuyển" value={`+${fmtVND(shipping)}`} color="#6b7280" />
              {discount > 0 && <SummaryRow label="Giảm giá" value={`-${fmtVND(discount)}`} color="#16a34a" />}
              <Divider sx={{ my: 0.5, borderColor: "#f1f5f9" }} />
              <SummaryRow label="Tổng cộng" value={fmtVND(total)} bold />
            </Box>
          </Box>

          {/* Payment */}
          <Box className={styles.card}>
            <CardHeader icon={<FiCreditCard size={15} />} title="Thông tin thanh toán" />
            <Box className={styles.paymentGrid}>
              <InfoItem label="Phương thức">
                <Box
                  className={styles.paymentBadge}
                  sx={{ bgcolor: paymentCfg.bg, border: `1px solid ${paymentCfg.border}`, color: paymentCfg.color }}
                >
                  <FiCreditCard size={12} />
                  {order.payment}
                </Box>
              </InfoItem>
              <InfoItem label="Trạng thái TT">
                <Box
                  className={styles.paymentBadge}
                  sx={{
                    bgcolor: currentStatus === "Hoàn thành" ? "#f0fdf4" : "#fff7ed",
                    border:  `1px solid ${currentStatus === "Hoàn thành" ? "#bbf7d0" : "#fed7aa"}`,
                    color:   currentStatus === "Hoàn thành" ? "#16a34a" : "#ea580c",
                  }}
                >
                  {currentStatus === "Hoàn thành"
                    ? <><FiCheckCircle size={12} /> Đã thanh toán</>
                    : <><FiClock size={12} /> Chưa thanh toán</>
                  }
                </Box>
              </InfoItem>
              <InfoItem label="Tổng tiền" value={fmtVND(total)} bold />
              <InfoItem label="Mã đơn"    value={order.id}       mono />
            </Box>
          </Box>
        </Box>

        {/* ── RIGHT COLUMN ───────────────────────────────────────────────── */}
        <Box className={styles.rightColumn}>

          {/* Customer */}
          <Box className={styles.card}>
            <CardHeader icon={<FiUser size={15} />} title="Khách hàng" />
            <Box className={styles.customerHeader}>
              <Avatar sx={{ width: 44, height: 44, bgcolor: "#eef2ff", color: "#4f67f5", fontSize: "1rem", fontWeight: 700 }}>
                {order.customer[0]}
              </Avatar>
              <Box>
                <Typography className={styles.customerName}>{order.customer}</Typography>
                <Typography className={styles.customerRole}>Khách hàng</Typography>
              </Box>
            </Box>
            <Divider sx={{ borderColor: "#f1f5f9" }} />
            <Box className={styles.contactList}>
              <ContactRow icon={<FiPhone size={13} />} label={order.phone} />
              <ContactRow icon={<FiMail size={13} />}  label={order.email} />
              <ContactRow icon={<FiMapPin size={13} />} label={order.address} />
            </Box>
          </Box>

          {/* Delivery */}
          <Box className={styles.card}>
            <CardHeader icon={<FiTruck size={15} />} title="Giao hàng" />
            <Box className={styles.deliveryList}>
              <InfoItem label="Địa chỉ nhận">
                <Typography sx={{ fontSize: "0.82rem", color: "#374151", lineHeight: 1.5 }}>
                  {order.address}
                </Typography>
              </InfoItem>
              <InfoItem label="Ngày đặt"    value={`${order.date} lúc ${order.time}`} />
              <InfoItem label="Dự kiến giao" value={estimateDelivery(order.date)} />
              {order.note && (
                <Box className={styles.noteBox}>
                  <Typography className={styles.noteTitle}>Ghi chú</Typography>
                  <Typography className={styles.noteText}>{order.note}</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Quick actions */}
          <Box className={`${styles.card} ${styles.cardGray}`}>
            <Typography className={styles.quickActionsTitle}>Thao tác nhanh</Typography>
            <Box className={styles.actionList}>
              {[
                { label: "Xác nhận đơn hàng",    color: "#4f67f5", disabled: currentStatus !== "Chờ duyệt" },
                { label: "Đánh dấu đang giao",   color: "#2563eb", disabled: currentStatus !== "Đang xử lý" },
                { label: "Hoàn thành đơn",        color: "#16a34a", disabled: currentStatus !== "Đang giao" },
                { label: "Huỷ đơn hàng",          color: "#dc2626", disabled: currentStatus === "Hoàn thành" || currentStatus === "Huỷ" },
              ].map((action) => (
                <Button
                  key={action.label}
                  disabled={action.disabled}
                  fullWidth
                  sx={{
                    textTransform: "none",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    borderRadius: "9px",
                    py: 0.9,
                    px: 2,
                    justifyContent: "flex-start",
                    color:   action.disabled ? "#9ca3af" : action.color,
                    bgcolor: action.disabled ? "#f3f4f6" : `${action.color}10`,
                    border:  `1px solid ${action.disabled ? "#e5e7eb" : `${action.color}30`}`,
                    "&:hover": { bgcolor: action.disabled ? "#f3f4f6" : `${action.color}20` },
                    "&.Mui-disabled": { color: "#9ca3af", bgcolor: "#f3f4f6" },
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function estimateDelivery(dateStr) {
  try {
    const [d, m, y] = dateStr.split("/").map(Number);
    const date = new Date(y, m - 1, d + 3);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  } catch { return "N/A"; }
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function CardHeader({ icon, title, right }) {
  return (
    <Box className={styles.cardHeader}>
      <Box className={styles.cardHeaderLeft}>
        <Box className={styles.cardHeaderIcon}>{icon}</Box>
        <Typography className={styles.cardHeaderTitle}>{title}</Typography>
      </Box>
      {right}
    </Box>
  );
}

function SummaryRow({ label, value, bold, color }) {
  return (
    <Box className={styles.summaryRow}>
      <Typography className={styles.summaryLabel}>{label}</Typography>
      <Typography
        className={bold ? styles.summaryValueBold : styles.summaryValue}
        sx={color ? { color } : {}}
      >
        {value}
      </Typography>
    </Box>
  );
}

function InfoItem({ label, value, bold, mono, children }) {
  return (
    <Box className={styles.infoItem}>
      <Typography className={styles.infoLabel}>{label}</Typography>
      {children ?? (
        <Typography
          className={`${styles.infoValue} ${bold ? styles.infoValueBold : ""} ${mono ? styles.infoValueMono : ""}`}
        >
          {value}
        </Typography>
      )}
    </Box>
  );
}

function ContactRow({ icon, label }) {
  return (
    <Box className={styles.contactRow}>
      <Box className={styles.contactIcon}>{icon}</Box>
      <Typography className={styles.contactLabel}>{label}</Typography>
    </Box>
  );
}

OrderDetailPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;