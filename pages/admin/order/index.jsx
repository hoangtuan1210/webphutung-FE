"use client";
import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { ALL_ORDERS } from "@/data/order";
import {
  FiSearch,
  FiDownload,
  FiFilter,
  FiMoreHorizontal,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingCart,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiX,
  FiPhone,
  FiUser,
  FiCalendar,
  FiCreditCard,
} from "react-icons/fi";
import AdminLayout from "@/layouts/AdminLayout";
import styles from "../../../styles/admin/order.module.css";

const PAGE_SIZE_OPTIONS = [7, 10, 15, 20];
const STATUS_TABS = ["Tất cả", "Chờ duyệt", "Đang xử lý", "Đang giao", "Hoàn thành", "Huỷ"];
const PAYMENT_OPTIONS = ["Tất cả", "COD", "Chuyển khoản", "Ví điện tử"];

const STATUS_CFG = {
  "Hoàn thành": { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "Đang giao":  { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "Đang xử lý": { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  "Chờ duyệt":  { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  Huỷ:          { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

const PAYMENT_CFG = {
  COD:            { color: "#374151", bg: "#f9fafb", border: "#e5e7eb" },
  "Chuyển khoản": { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "Ví điện tử":   { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
};

const fmtVND = (n) => n.toLocaleString("vi-VN") + "₫";

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] ?? { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" };
  return (
    <Box className={styles.statusBadge} sx={{ color: cfg.color, bgcolor: cfg.bg, borderColor: cfg.border }}>
      {status}
    </Box>
  );
}

function PaymentBadge({ method }) {
  const cfg = PAYMENT_CFG[method] ?? { color: "#374151", bg: "#f9fafb", border: "#e5e7eb" };
  return (
    <Box className={styles.paymentBadge} sx={{ color: cfg.color, bgcolor: cfg.bg, borderColor: `1px solid ${cfg.border}` }}>
      {method}
    </Box>
  );
}

function SortHeader({ label, sortKey, currentSort, onSort }) {
  const active = currentSort?.key === sortKey;
  const asc = currentSort?.dir === "asc";
  return (
    <Box onClick={() => onSort(sortKey)} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer", userSelect: "none", "&:hover": { color: "#111827" } }}>
      {label}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1px", opacity: active ? 1 : 0.3 }}>
        <FiArrowUp size={8} color={active && asc ? "#4f67f5" : "#9ca3af"} />
        <FiArrowDown size={8} color={active && !asc ? "#4f67f5" : "#9ca3af"} />
      </Box>
    </Box>
  );
}

function RowMenu({ id }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} className={styles.rowMenu}>
        <FiMoreHorizontal size={16} />
      </IconButton>
      <Menu
        anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        PaperProps={{ elevation: 0, sx: { border: "1px solid #e8ecf0", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", minWidth: 160 } }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {[
          { icon: <FiEye size={13} />,   label: "Xem chi tiết", color: "#374151", href: `/admin/order/${id}` },
          { icon: <FiEdit2 size={13} />, label: "Cập nhật",     color: "#374151", href: `/admin/order/${id}/edit` },
          { icon: <FiTrash2 size={13} />,label: "Huỷ đơn",      color: "#ef4444" },
        ].map(({ icon, label, color, href }) => (
          <MenuItem key={label} component={href ? Link : "li"} href={href} onClick={() => setAnchor(null)}
            sx={{ fontSize: "0.82rem", color, gap: 1.25, py: 1, px: 1.75, "&:hover": { bgcolor: "#f8fafc" } }}>
            {icon} {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function PageBtn({ label, active, disabled, onClick }) {
  return (
    <Box onClick={!disabled ? onClick : undefined}
      className={`${styles.pageBtn} ${active ? styles.pageBtnActive : ""} ${disabled ? styles.pageBtnDisabled : ""}`}>
      {label}
    </Box>
  );
}

// ─── FILTER DRAWER ────────────────────────────────────────────────────────────
function FilterDrawer({ open, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters);

  const set = (key, val) => setLocal((p) => ({ ...p, [key]: val }));

  const activeCount = [
    local.customerName,
    local.phone,
    local.payment !== "Tất cả" ? local.payment : "",
    local.dateFrom,
    local.dateTo,
  ].filter(Boolean).length;

  const reset = () => setLocal({ customerName: "", phone: "", payment: "Tất cả", dateFrom: "", dateTo: "" });

  const apply = () => { onApply(local); onClose(); };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 380 }, borderRadius: "16px 0 0 16px", p: 0 } }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2.5, borderBottom: "1px solid #f1f5f9" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>Lọc đơn hàng</Typography>
          {activeCount > 0 && (
            <Box sx={{ px: 1, py: 0.2, borderRadius: "20px", bgcolor: "#eef2ff", color: "#4f67f5", fontSize: "0.72rem", fontWeight: 700 }}>
              {activeCount}
            </Box>
          )}
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#6b7280", "&:hover": { bgcolor: "#f3f4f6" } }}>
          <FiX size={18} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 3, display: "flex", flexDirection: "column", gap: 3 }}>

        {/* Tên khách hàng */}
        <FilterField
          icon={<FiUser size={13} />}
          label="Tên khách hàng"
          value={local.customerName}
          onChange={(v) => set("customerName", v)}
          placeholder="Nhập tên khách hàng..."
        />

        {/* Số điện thoại */}
        <FilterField
          icon={<FiPhone size={13} />}
          label="Số điện thoại"
          value={local.phone}
          onChange={(v) => set("phone", v)}
          placeholder="VD: 0901234567"
          type="tel"
        />

        <Divider sx={{ borderColor: "#f1f5f9" }} />

        {/* Phương thức thanh toán */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.25 }}>
            <FiCreditCard size={13} color="#4f67f5" />
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Thanh toán</Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {PAYMENT_OPTIONS.map((p) => (
              <Box
                key={p}
                onClick={() => set("payment", p)}
                sx={{
                  px: 1.5, py: 0.6, borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 500,
                  border: `1px solid ${local.payment === p ? "#4f67f5" : "#e8ecf0"}`,
                  bgcolor: local.payment === p ? "#eef2ff" : "#fff",
                  color: local.payment === p ? "#4f67f5" : "#6b7280",
                  transition: "all 0.15s",
                  "&:hover": { borderColor: "#4f67f5", color: "#4f67f5" },
                }}
              >
                {p}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Khoảng thời gian */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.25 }}>
            <FiCalendar size={13} color="#4f67f5" />
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Khoảng thời gian</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.5 }}>Từ ngày</Typography>
              <Box
                component="input"
                type="date"
                value={local.dateFrom}
                onChange={(e) => set("dateFrom", e.target.value)}
                sx={{ width: "100%", height: 36, border: "1px solid #e8ecf0", borderRadius: "9px", px: 1.5, fontSize: "0.82rem", color: "#374151", outline: "none", "&:focus": { borderColor: "#4f67f5" }, boxSizing: "border-box" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.5 }}>Đến ngày</Typography>
              <Box
                component="input"
                type="date"
                value={local.dateTo}
                onChange={(e) => set("dateTo", e.target.value)}
                sx={{ width: "100%", height: 36, border: "1px solid #e8ecf0", borderRadius: "9px", px: 1.5, fontSize: "0.82rem", color: "#374151", outline: "none", "&:focus": { borderColor: "#4f67f5" }, boxSizing: "border-box" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 3, py: 2.5, borderTop: "1px solid #f1f5f9", display: "flex", gap: 1.5 }}>
        <Button
          fullWidth onClick={reset}
          sx={{ textTransform: "none", fontSize: "0.85rem", fontWeight: 500, borderRadius: "10px", border: "1px solid #e8ecf0", color: "#6b7280", "&:hover": { bgcolor: "#f8fafc" }, py: 1 }}>
          Đặt lại
        </Button>
        <Button
          fullWidth onClick={apply}
          sx={{ textTransform: "none", fontSize: "0.85rem", fontWeight: 600, borderRadius: "10px", bgcolor: "#4f67f5", color: "#fff", boxShadow: "0 2px 8px rgba(79,103,245,0.25)", "&:hover": { bgcolor: "#3d55e0" }, py: 1 }}>
          Áp dụng
          {activeCount > 0 && ` (${activeCount})`}
        </Button>
      </Box>
    </Drawer>
  );
}

function FilterField({ icon, label, value, onChange, placeholder, type = "text" }) {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
        <Box sx={{ color: "#4f67f5" }}>{icon}</Box>
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>{label}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, border: "1px solid #e8ecf0", borderRadius: "10px", bgcolor: "#fafbfc", "&:focus-within": { borderColor: "#4f67f5", bgcolor: "#fff" }, transition: "all 0.15s", height: 40 }}>
        <InputBase
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          endAdornment={value ? (
            <Box onClick={() => onChange("")} sx={{ cursor: "pointer", color: "#9ca3af", display: "flex", "&:hover": { color: "#374151" } }}>
              <FiX size={14} />
            </Box>
          ) : null}
          sx={{ fontSize: "0.85rem", color: "#374151", flex: 1, "& input::placeholder": { color: "#9ca3af" } }}
        />
      </Box>
    </Box>
  );
}

// ─── ACTIVE FILTER TAGS ───────────────────────────────────────────────────────
function ActiveFilters({ filters, onClear }) {
  const tags = [
    filters.customerName && { key: "customerName", label: `Tên: ${filters.customerName}` },
    filters.phone        && { key: "phone",         label: `SĐT: ${filters.phone}` },
    (filters.payment && filters.payment !== "Tất cả") && { key: "payment", label: `TT: ${filters.payment}` },
    filters.dateFrom     && { key: "dateFrom",      label: `Từ: ${filters.dateFrom}` },
    filters.dateTo       && { key: "dateTo",        label: `Đến: ${filters.dateTo}` },
  ].filter(Boolean);

  if (!tags.length) return null;

  return (
    <Box sx={{ px: 2.5, pb: 1.5, display: "flex", flexWrap: "wrap", gap: 0.75, alignItems: "center" }}>
      <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af", mr: 0.5 }}>Đang lọc:</Typography>
      {tags.map((t) => (
        <Chip
          key={t.key}
          label={t.label}
          size="small"
          onDelete={() => onClear(t.key)}
          sx={{ fontSize: "0.75rem", height: 24, bgcolor: "#eef2ff", color: "#4f67f5", border: "1px solid #c7d2fe", "& .MuiChip-deleteIcon": { color: "#818cf8", fontSize: "14px" } }}
        />
      ))}
      <Box onClick={() => onClear("all")} sx={{ fontSize: "0.72rem", color: "#9ca3af", cursor: "pointer", ml: 0.5, "&:hover": { color: "#ef4444" }, textDecoration: "underline" }}>
        Xoá tất cả
      </Box>
    </Box>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const EMPTY_FILTERS = { customerName: "", phone: "", payment: "Tất cả", dateFrom: "", dateTo: "" };

export default function OrdersPage() {
  const [search, setSearch]     = useState("");
  const [tab, setTab]           = useState("Tất cả");
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [selected, setSelected] = useState([]);
  const [sort, setSort]         = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters]   = useState(EMPTY_FILTERS);

  const handleSort = (key) =>
    setSort((p) => p?.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });

  const clearFilter = (key) => {
    if (key === "all") { setFilters(EMPTY_FILTERS); return; }
    setFilters((p) => ({ ...p, [key]: key === "payment" ? "Tất cả" : "" }));
  };

  // Convert dd/MM/yyyy → Date for comparison
  const parseDate = (str) => {
    if (!str) return null;
    const [d, m, y] = str.split("/").map(Number);
    return new Date(y, m - 1, d);
  };
  const parseInputDate = (str) => str ? new Date(str) : null;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = ALL_ORDERS.filter((o) => {
      // Tab filter
      if (tab !== "Tất cả" && o.status !== tab) return false;

      // Search bar (mã đơn, khách hàng, SĐT, sản phẩm)
      if (q) {
        const matchQ =
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q) ||
          o.phone.includes(q);
        if (!matchQ) return false;
      }

      // Filter drawer — tên khách hàng
      if (filters.customerName && !o.customer.toLowerCase().includes(filters.customerName.toLowerCase())) return false;

      // Filter drawer — số điện thoại
      if (filters.phone && !o.phone.includes(filters.phone)) return false;

      // Filter drawer — phương thức thanh toán
      if (filters.payment !== "Tất cả" && o.payment !== filters.payment) return false;

      // Filter drawer — khoảng ngày
      const orderDate = parseDate(o.date);
      const from = parseInputDate(filters.dateFrom);
      const to   = parseInputDate(filters.dateTo);
      if (from && orderDate && orderDate < from) return false;
      if (to   && orderDate && orderDate > to)   return false;

      return true;
    });

    if (sort) {
      list = [...list].sort((a, b) => {
        const va = a[sort.key], vb = b[sort.key];
        const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [search, tab, sort, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const allChecked  = paginated.length > 0 && paginated.every((r) => selected.includes(r.id));
  const someChecked = paginated.some((r) => selected.includes(r.id));
  const toggleAll   = () => setSelected(allChecked ? [] : paginated.map((r) => r.id));
  const toggleRow   = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const pageNums = useMemo(() => {
    const r = [], d = 1;
    for (let i = Math.max(1, safePage - d); i <= Math.min(totalPages, safePage + d); i++) r.push(i);
    return r;
  }, [safePage, totalPages]);

  const stats = useMemo(() => ({
    total:    ALL_ORDERS.length,
    pending:  ALL_ORDERS.filter((o) => o.status === "Chờ duyệt").length,
    shipping: ALL_ORDERS.filter((o) => o.status === "Đang giao").length,
    revenue:  ALL_ORDERS.filter((o) => o.status === "Hoàn thành").reduce((s, o) => s + o.amount, 0),
  }), []);

  const COLS = [
    { key: "id",       label: "Mã đơn" },
    { key: "customer", label: "Khách hàng" },
    { key: "product",  label: "Sản phẩm" },
    { key: "amount",   label: "Giá trị" },
    { key: "payment",  label: "Thanh toán" },
    { key: "status",   label: "Trạng thái" },
    { key: "date",     label: "Ngày đặt" },
  ];

  // Active filter count for badge
  const activeFilterCount = [
    filters.customerName,
    filters.phone,
    filters.payment !== "Tất cả" ? filters.payment : "",
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  return (
    <Box>
      {/* ── Header ────────────────────────────────────────────────── */}
      <Box className={styles.pageHeader}>
        <Box>
          <Typography className={styles.pageTitle}>Quản lý đơn hàng</Typography>
          <Typography className={styles.pageSubtitle}>Theo dõi và xử lý tất cả đơn hàng của cửa hàng</Typography>
        </Box>
        <Box className={styles.headerActions}>
          <Button variant="outlined" startIcon={<FiDownload size={14} />}
            sx={{ borderRadius: "10px", textTransform: "none", fontSize: "0.85rem", fontWeight: 500, borderColor: "#e8ecf0", color: "#374151", "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" }, px: 2, py: 0.9 }}>
            Xuất file
          </Button>
          <Button
            variant="contained"
            startIcon={<FiFilter size={14} />}
            onClick={() => setFilterOpen(true)}
            sx={{
              borderRadius: "10px", textTransform: "none", fontSize: "0.85rem", fontWeight: 600,
              bgcolor: activeFilterCount > 0 ? "#3d55e0" : "#4f67f5",
              boxShadow: "0 2px 10px rgba(79,103,245,0.25)",
              "&:hover": { bgcolor: "#3d55e0" }, px: 2, py: 0.9, position: "relative",
            }}
          >
            Lọc đơn hàng
            {activeFilterCount > 0 && (
              <Box sx={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", bgcolor: "#ef4444", color: "#fff", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                {activeFilterCount}
              </Box>
            )}
          </Button>
        </Box>
      </Box>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <Box className={styles.statsGrid}>
        {[
          { icon: <FiShoppingCart size={18} />, label: "Tổng đơn hàng", value: stats.total,                                color: "#4f67f5", light: "#eef2ff", trend: "+12%", up: true,  sub: "So với tháng trước" },
          { icon: <FiClock size={18} />,        label: "Chờ duyệt",     value: stats.pending,                              color: "#7c3aed", light: "#f5f3ff", trend: "-2",   up: false, sub: "Cần xử lý ngay" },
          { icon: <FiCheckCircle size={18} />,  label: "Đang giao",     value: stats.shipping,                             color: "#2563eb", light: "#eff6ff", trend: "+5",   up: true,  sub: "Đang trên đường" },
          { icon: <FiDollarSign size={18} />,   label: "Doanh thu HT",  value: `${(stats.revenue / 1_000_000).toFixed(1)}M₫`, color: "#16a34a", light: "#f0fdf4", trend: "+18%", up: true, sub: "Đơn hoàn thành" },
        ].map((s) => (
          <Box key={s.label} className={styles.statCard}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box className={styles.statIcon} sx={{ bgcolor: s.light, color: s.color }}>{s.icon}</Box>
              <Box className={s.up ? styles.trendUp : styles.trendDown}>
                {s.up ? <FiTrendingUp size={11} /> : <FiTrendingDown size={11} />}
                {s.trend}
              </Box>
            </Box>
            <Box>
              <Typography className={styles.statValue}>{s.value}</Typography>
              <Typography className={styles.statLabel}>{s.label}</Typography>
            </Box>
            <Typography className={styles.statFooter}>{s.sub}</Typography>
          </Box>
        ))}
      </Box>

      {/* ── Table card ────────────────────────────────────────────── */}
      <Box className={styles.tableCard}>
        {/* Status tabs */}
        <Box sx={{ px: 2.5, pt: 2, pb: 0, borderBottom: "1px solid #f1f5f9", overflowX: "auto" }}>
          <Box className={styles.statusTabs} sx={{ width: "fit-content" }}>
            {STATUS_TABS.map((t) => (
              <Box key={t} className={`${styles.statusTab} ${tab === t ? styles.statusTabActive : ""}`}
                onClick={() => { setTab(t); setPage(1); }}>
                {t}
                {t !== "Tất cả" && (
                  <Box component="span" sx={{ ml: 0.75, fontSize: "0.68rem", fontWeight: 700, opacity: 0.7 }}>
                    {ALL_ORDERS.filter((o) => o.status === t).length}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Toolbar: search + filter */}
        <Box className={styles.toolbar}>
          <Box className={styles.searchBox}>
            <FiSearch size={14} color="#9ca3af" />
            <InputBase
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm mã đơn, tên, SĐT, sản phẩm..."
              endAdornment={search ? (
                <Box onClick={() => setSearch("")} sx={{ cursor: "pointer", color: "#9ca3af", display: "flex", mr: 0.5, "&:hover": { color: "#374151" } }}>
                  <FiX size={13} />
                </Box>
              ) : null}
              sx={{ fontSize: "0.85rem", color: "#374151", flex: 1, "& input::placeholder": { color: "#9ca3af" } }}
            />
          </Box>
          <Box className={styles.toolbarRight}>
            <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              {filtered.length} đơn hàng
            </Typography>
            <Select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              size="small"
              sx={{ fontSize: "0.8rem", height: 34, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8ecf0", borderRadius: "8px" } }}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <MenuItem key={n} value={n} sx={{ fontSize: "0.82rem" }}>{n} / trang</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Active filter tags */}
        <ActiveFilters filters={filters} onClear={clearFilter} />

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <Box className={styles.bulkBar}>
            <Typography className={styles.bulkCount}>Đã chọn {selected.length} đơn hàng</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {["Xác nhận", "Đang giao", "Huỷ"].map((action) => (
                <Button key={action} size="small" variant="outlined"
                  sx={{ fontSize: "0.78rem", textTransform: "none", borderRadius: "7px", borderColor: "#c7d2fe", color: "#4f46e5", "&:hover": { bgcolor: "#eef2ff" }, px: 1.5, py: 0.5 }}>
                  {action}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell sx={{ pl: 2.5, width: 44 }}>
                  <Checkbox size="small" checked={allChecked} indeterminate={someChecked && !allChecked} onChange={toggleAll}
                    sx={{ p: 0, color: "#d1d5db", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#4f67f5" } }} />
                </TableCell>
                {COLS.map((col) => (
                  <TableCell key={col.key}
                    className={`${col.key === "payment" ? styles.hideOnMobile : ""} ${col.key === "product" ? styles.hideOnTablet : ""}`}
                    sx={{ minWidth: col.key === "customer" || col.key === "product" ? 180 : "auto" }}>
                    <SortHeader label={col.label} sortKey={col.key} currentSort={sort} onSort={handleSort} />
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Box className={styles.emptyState}>
                      <Box className={styles.emptyIcon}><FiShoppingCart size={24} /></Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "#9ca3af" }}>Không có đơn hàng nào</Typography>
                      {(search || activeFilterCount > 0) && (
                        <Button size="small" onClick={() => { setSearch(""); setFilters(EMPTY_FILTERS); }}
                          sx={{ mt: 1, textTransform: "none", fontSize: "0.8rem", color: "#4f67f5" }}>
                          Xoá bộ lọc
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((row) => {
                  const checked = selected.includes(row.id);
                  return (
                    <TableRow key={row.id} className={`${styles.tableRow} ${checked ? styles.tableRowSelected : ""}`}>
                      <TableCell sx={{ pl: 2.5 }}>
                        <Checkbox size="small" checked={checked} onChange={() => toggleRow(row.id)}
                          sx={{ p: 0, color: "#d1d5db", "&.Mui-checked": { color: "#4f67f5" } }} />
                      </TableCell>
                      <TableCell sx={{ pl: 0 }}>
                        <Typography className={styles.orderId}>{row.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                          <Avatar sx={{ width: 30, height: 30, fontSize: "0.75rem", bgcolor: "#eef2ff", color: "#4f67f5", flexShrink: 0 }}>
                            {row.customer[0]}
                          </Avatar>
                          <Box>
                            <Typography className={styles.customerName}>{row.customer}</Typography>
                            <Typography className={styles.customerContact}>{row.phone}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell className={styles.hideOnTablet} sx={{ color: "#6b7280", maxWidth: 200 }}>
                        <Typography noWrap sx={{ fontSize: "0.82rem" }}>{row.product}</Typography>
                        <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>x{row.qty}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className={styles.amount}>{fmtVND(row.amount)}</Typography>
                      </TableCell>
                      <TableCell className={styles.hideOnMobile}>
                        <PaymentBadge method={row.payment} />
                      </TableCell>
                      <TableCell><StatusBadge status={row.status} /></TableCell>
                      <TableCell sx={{ color: "#9ca3af", whiteSpace: "nowrap", fontSize: "0.8rem" }}>{row.date}</TableCell>
                      <TableCell align="right" sx={{ pr: 2 }}><RowMenu id={row.id} /></TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box className={styles.pagination}>
          <Typography className={styles.paginationInfo}>
            Showing{" "}
            <Box component="span" className={styles.paginationBold}>{(safePage - 1) * pageSize + 1}</Box>
            {" "}to{" "}
            <Box component="span" className={styles.paginationBold}>{Math.min(safePage * pageSize, filtered.length)}</Box>
            {" "}of{" "}
            <Box component="span" className={styles.paginationBold}>{filtered.length}</Box>
            {" "}đơn hàng
          </Typography>

          <Box className={styles.paginationBtns}>
            <Box className={`${styles.pageBtn} ${safePage === 1 ? styles.pageBtnDisabled : ""}`} onClick={() => safePage > 1 && setPage(safePage - 1)}>
              <FiChevronLeft size={14} />
            </Box>
            {pageNums[0] > 1 && (
              <>
                <PageBtn label={1} onClick={() => setPage(1)} />
                {pageNums[0] > 2 && <Box sx={{ px: 0.5, color: "#9ca3af", fontSize: "0.82rem" }}>…</Box>}
              </>
            )}
            {pageNums.map((n) => (
              <PageBtn key={n} label={n} active={n === safePage} onClick={() => setPage(n)} />
            ))}
            {pageNums[pageNums.length - 1] < totalPages && (
              <>
                {pageNums[pageNums.length - 1] < totalPages - 1 && <Box sx={{ px: 0.5, color: "#9ca3af", fontSize: "0.82rem" }}>…</Box>}
                <PageBtn label={totalPages} onClick={() => setPage(totalPages)} />
              </>
            )}
            <Box className={`${styles.pageBtn} ${safePage === totalPages ? styles.pageBtnDisabled : ""}`} onClick={() => safePage < totalPages && setPage(safePage + 1)}>
              <FiChevronRight size={14} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Filter Drawer ──────────────────────────────────────────── */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(f) => { setFilters(f); setPage(1); }}
      />
    </Box>
  );
}

OrdersPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;