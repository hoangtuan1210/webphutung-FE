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
    { label: "Đã xác nhận", done: true },
    { label: "Đang xử lý", done: true },
    { label: "Đang giao", done: true },
    { label: "Hoàn thành", done: true },
  ],
  "Đang giao": [
    { label: "Đơn hàng đặt", done: true },
    { label: "Đã xác nhận", done: true },
    { label: "Đang xử lý", done: true },
    { label: "Đang giao", done: true },
    { label: "Hoàn thành", done: false },
  ],
  "Đang xử lý": [
    { label: "Đơn hàng đặt", done: true },
    { label: "Đã xác nhận", done: true },
    { label: "Đang xử lý", done: true },
    { label: "Đang giao", done: false },
    { label: "Hoàn thành", done: false },
  ],
  "Chờ duyệt": [
    { label: "Đơn hàng đặt", done: true },
    { label: "Đã xác nhận", done: false },
    { label: "Đang xử lý", done: false },
    { label: "Đang giao", done: false },
    { label: "Hoàn thành", done: false },
  ],
  Huỷ: [
    { label: "Đơn hàng đặt", done: true },
    { label: "Đã xác nhận", done: false },
    { label: "Đơn bị huỷ", done: true, cancelled: true },
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

  const cfg = STATUS_CFG[currentStatus] ?? STATUS_CFG["Chờ duyệt"];
  const timeline = TIMELINE[currentStatus] ?? TIMELINE["Chờ duyệt"];
  const paymentCfg = PAYMENT_CFG[order?.payment] ?? PAYMENT_CFG["COD"];

  const shipping = Math.round(order?.amount * 0.03) || 0;
  const discount = currentStatus === "Hoàn thành" ? 50000 : 0;
  const total = order ? order.amount + shipping - discount : 0;

  // ─── NOT FOUND ──────────────────────────────────────────────────────────────
  if (router.isReady && !order) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 2 }}>
        <FiAlertCircle size={48} color="#e5e7eb" />
        <Typography sx={{ color: "#9ca3af", fontSize: "1rem" }}>
          Không tìm thấy đơn hàng <strong>{id}</strong>
        </Typography>
        <Button component={Link} href="/admin/order" startIcon={<FiArrowLeft size={14} />}
          sx={{ textTransform: "none", borderRadius: "10px", bgcolor: "#4f67f5", color: "#fff", "&:hover": { bgcolor: "#3d55e0" }, px: 2.5 }}>
          Quay lại danh sách
        </Button>
      </Box>
    );
  }

  if (!order) return null;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", pb: 6 }}>
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            component={Link}
            href="/admin/order"
            startIcon={<FiArrowLeft size={14} />}
            sx={{
              textTransform: "none",
              fontSize: "0.82rem",
              color: "#6b7280",
              borderRadius: "9px",
              border: "1px solid #e8ecf0",
              px: 1.75,
              py: 0.7,
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
            }}
          >
            Quay lại
          </Button>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.15rem", color: "#111827", lineHeight: 1.2 }}>
              Chi tiết đơn hàng
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>
              {order.id} · {order.date} {order.time}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            startIcon={<FiPrinter size={13} />}
            sx={{ textTransform: "none", fontSize: "0.82rem", color: "#374151", border: "1px solid #e8ecf0", borderRadius: "9px", bgcolor: "#fff", px: 1.75, py: 0.7, "&:hover": { bgcolor: "#f8fafc" } }}
          >
            In đơn
          </Button>
          <Button
            startIcon={<FiDownload size={13} />}
            sx={{ textTransform: "none", fontSize: "0.82rem", color: "#374151", border: "1px solid #e8ecf0", borderRadius: "9px", bgcolor: "#fff", px: 1.75, py: 0.7, "&:hover": { bgcolor: "#f8fafc" } }}
          >
            Xuất PDF
          </Button>
          <Button
            component={Link}
            href={`/admin/order/${id}/edit`}
            startIcon={<FiEdit2 size={13} />}
            sx={{ textTransform: "none", fontSize: "0.82rem", color: "#fff", borderRadius: "9px", bgcolor: "#4f67f5", px: 2, py: 0.7, boxShadow: "0 2px 8px rgba(79,103,245,0.25)", "&:hover": { bgcolor: "#3d55e0" } }}
          >
            Chỉnh sửa
          </Button>
        </Box>
      </Box>

      {/* ── Main grid ───────────────────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" }, gap: 2.5 }}>

        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

          {/* Order Timeline */}
          <Card>
            <CardHeader
              icon={<FiPackage size={15} />}
              title="Trạng thái đơn hàng"
              right={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Select
                    value={currentStatus}
                    onChange={(e) => { setCurrentStatus(e.target.value); setStatusChanged(true); }}
                    size="small"
                    sx={{ fontSize: "0.8rem", height: 32, minWidth: 140, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8ecf0", borderRadius: "8px" } }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s} sx={{ fontSize: "0.82rem" }}>{s}</MenuItem>
                    ))}
                  </Select>
                  {statusChanged && (
                    <Button size="small"
                      onClick={() => setStatusChanged(false)}
                      sx={{ textTransform: "none", fontSize: "0.78rem", bgcolor: "#4f67f5", color: "#fff", borderRadius: "7px", px: 1.5, py: 0.4, "&:hover": { bgcolor: "#3d55e0" } }}>
                      Lưu
                    </Button>
                  )}
                </Box>
              }
            />
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0, mt: 1, overflowX: "auto", pb: 1 }}>
              {timeline.map((step, i) => (
                <Box key={step.label} sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 80, position: "relative" }}>
                  {/* Line */}
                  {i < timeline.length - 1 && (
                    <Box sx={{ position: "absolute", top: 13, left: "calc(50% + 13px)", right: "calc(-50% + 13px)", height: 2, bgcolor: step.done && timeline[i + 1]?.done ? "#4f67f5" : "#e8ecf0", zIndex: 0 }} />
                  )}
                  {/* Dot */}
                  <Box sx={{
                    width: 26, height: 26, borderRadius: "50%", zIndex: 1, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    bgcolor: step.cancelled ? "#fef2f2" : step.done ? "#eef2ff" : "#f9fafb",
                    border: `2px solid ${step.cancelled ? "#dc2626" : step.done ? "#4f67f5" : "#e8ecf0"}`,
                  }}>
                    {step.cancelled
                      ? <FiXCircle size={12} color="#dc2626" />
                      : step.done
                        ? <FiCheckCircle size={12} color="#4f67f5" />
                        : <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#d1d5db" }} />
                    }
                  </Box>
                  <Typography sx={{ fontSize: "0.68rem", color: step.done ? "#374151" : "#9ca3af", fontWeight: step.done ? 600 : 400, mt: 0.75, textAlign: "center", lineHeight: 1.3 }}>
                    {step.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Current status badge */}
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1.25, py: 0.5, borderRadius: "20px", bgcolor: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: "0.78rem", fontWeight: 600 }}>
                {cfg.icon}
                {currentStatus}
              </Box>
              {order.note && (
                <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af", fontStyle: "italic" }}>
                  Ghi chú: {order.note}
                </Typography>
              )}
            </Box>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader icon={<FiShoppingCart size={15} />} title="Sản phẩm đặt hàng" />
            <TableContainer sx={{ mt: 0.5 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { fontSize: "0.75rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", borderBottom: "1px solid #f1f5f9", py: 1.25, bgcolor: "#fafbfc" } }}>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ "& td": { borderBottom: "1px solid #f9fafb", py: 1.5 } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "8px", bgcolor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FiPackage size={16} color="#4f67f5" />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>{order.product}</Typography>
                          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>SKU: {order.id}-01</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "7px", bgcolor: "#f9fafb", border: "1px solid #e8ecf0", fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>
                        {order.qty}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: "0.85rem", color: "#6b7280" }}>{fmtVND(order.unitPrice)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{fmtVND(order.unitPrice * order.qty)}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Summary */}
            <Box sx={{ mt: 2, borderTop: "1px solid #f1f5f9", pt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <SummaryRow label="Tạm tính" value={fmtVND(order.amount)} />
              <SummaryRow label="Phí vận chuyển" value={`+${fmtVND(shipping)}`} color="#6b7280" />
              {discount > 0 && <SummaryRow label="Giảm giá" value={`-${fmtVND(discount)}`} color="#16a34a" />}
              <Divider sx={{ my: 0.5, borderColor: "#f1f5f9" }} />
              <SummaryRow label="Tổng cộng" value={fmtVND(total)} bold />
            </Box>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader icon={<FiCreditCard size={15} />} title="Thông tin thanh toán" />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
              <InfoItem label="Phương thức">
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.25, py: 0.4, borderRadius: "20px", bgcolor: paymentCfg.bg, border: `1px solid ${paymentCfg.border}`, color: paymentCfg.color, fontSize: "0.8rem", fontWeight: 600 }}>
                  <FiCreditCard size={12} />
                  {order.payment}
                </Box>
              </InfoItem>
              <InfoItem label="Trạng thái TT">
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.25, py: 0.4, borderRadius: "20px", bgcolor: currentStatus === "Hoàn thành" ? "#f0fdf4" : "#fff7ed", border: `1px solid ${currentStatus === "Hoàn thành" ? "#bbf7d0" : "#fed7aa"}`, color: currentStatus === "Hoàn thành" ? "#16a34a" : "#ea580c", fontSize: "0.8rem", fontWeight: 600 }}>
                  {currentStatus === "Hoàn thành" ? <><FiCheckCircle size={12} /> Đã thanh toán</> : <><FiClock size={12} /> Chưa thanh toán</>}
                </Box>
              </InfoItem>
              <InfoItem label="Tổng tiền" value={fmtVND(total)} bold />
              <InfoItem label="Mã đơn" value={order.id} mono />
            </Box>
          </Card>
        </Box>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────────── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

          {/* Customer */}
          <Card>
            <CardHeader icon={<FiUser size={15} />} title="Khách hàng" />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1.5, mb: 2 }}>
              <Avatar sx={{ width: 44, height: 44, bgcolor: "#eef2ff", color: "#4f67f5", fontSize: "1rem", fontWeight: 700 }}>
                {order.customer[0]}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>{order.customer}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>Khách hàng</Typography>
              </Box>
            </Box>
            <Divider sx={{ borderColor: "#f1f5f9", mb: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <ContactRow icon={<FiPhone size={13} />} label={order.phone} />
              <ContactRow icon={<FiMail size={13} />} label={order.email} />
              <ContactRow icon={<FiMapPin size={13} />} label={order.address} />
            </Box>
          </Card>

          {/* Delivery */}
          <Card>
            <CardHeader icon={<FiTruck size={15} />} title="Giao hàng" />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1.5 }}>
              <InfoItem label="Địa chỉ nhận">
                <Typography sx={{ fontSize: "0.82rem", color: "#374151", lineHeight: 1.5 }}>{order.address}</Typography>
              </InfoItem>
              <InfoItem label="Ngày đặt" value={`${order.date} lúc ${order.time}`} />
              <InfoItem label="Dự kiến giao" value={estimateDelivery(order.date)} />
              {order.note && (
                <Box sx={{ p: 1.5, bgcolor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px" }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#92400e", mb: 0.5 }}>Ghi chú</Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#78350f" }}>{order.note}</Typography>
                </Box>
              )}
            </Box>
          </Card>

          {/* Quick actions */}
          <Card sx={{ bgcolor: "#fafbfc" }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", mb: 1.5 }}>
              Thao tác nhanh
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { label: "Xác nhận đơn hàng", color: "#4f67f5", disabled: currentStatus !== "Chờ duyệt" },
                { label: "Đánh dấu đang giao", color: "#2563eb", disabled: currentStatus !== "Đang xử lý" },
                { label: "Hoàn thành đơn", color: "#16a34a", disabled: currentStatus !== "Đang giao" },
                { label: "Huỷ đơn hàng", color: "#dc2626", disabled: currentStatus === "Hoàn thành" || currentStatus === "Huỷ" },
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
                    color: action.disabled ? "#9ca3af" : action.color,
                    bgcolor: action.disabled ? "#f3f4f6" : `${action.color}10`,
                    border: `1px solid ${action.disabled ? "#e5e7eb" : `${action.color}30`}`,
                    "&:hover": { bgcolor: action.disabled ? "#f3f4f6" : `${action.color}20` },
                    "&.Mui-disabled": { color: "#9ca3af", bgcolor: "#f3f4f6" },
                    justifyContent: "flex-start",
                    px: 2,
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}


function estimateDelivery(dateStr) {
  try {
    const [d, m, y] = dateStr.split("/").map(Number);
    const date = new Date(y, m - 1, d + 3);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  } catch { return "N/A"; }
}

function Card({ children, sx = {} }) {
  return (
    <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #f1f5f9", p: 2.5, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", ...sx }}>
      {children}
    </Box>
  );
}

function CardHeader({ icon, title, right }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: "8px", bgcolor: "#eef2ff", color: "#4f67f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>{title}</Typography>
      </Box>
      {right}
    </Box>
  );
}

function SummaryRow({ label, value, bold, color }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography sx={{ fontSize: "0.82rem", color: "#6b7280" }}>{label}</Typography>
      <Typography sx={{ fontSize: bold ? "0.95rem" : "0.82rem", fontWeight: bold ? 700 : 500, color: color ?? (bold ? "#111827" : "#374151") }}>
        {value}
      </Typography>
    </Box>
  );
}

function InfoItem({ label, value, bold, mono, children }) {
  return (
    <Box>
      <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.4 }}>
        {label}
      </Typography>
      {children ?? (
        <Typography sx={{ fontSize: "0.85rem", fontWeight: bold ? 700 : 500, color: "#111827", fontFamily: mono ? "monospace" : "inherit" }}>
          {value}
        </Typography>
      )}
    </Box>
  );
}

function ContactRow({ icon, label }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
      <Box sx={{ color: "#4f67f5", flexShrink: 0, mt: "1px" }}>{icon}</Box>
      <Typography sx={{ fontSize: "0.82rem", color: "#374151", lineHeight: 1.5, wordBreak: "break-word" }}>{label}</Typography>
    </Box>
  );
}

OrderDetailPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;