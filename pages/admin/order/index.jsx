"use client";
import { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
import Drawer from "@mui/material/Drawer";
import {
  FiSearch, FiDownload, FiPlus, FiMoreHorizontal,
  FiEye, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown,
  FiShoppingCart, FiDollarSign, FiClock, FiCheckCircle,
  FiTrendingUp, FiTrendingDown, FiFilter, FiX, FiCalendar, FiUser, FiPhone, FiCreditCard
} from "react-icons/fi";
import AdminLayout from "@/layouts/AdminLayout";
import Pagination from "@/components/admin/Pagination";
import { ALL_ORDERS, STATUS_MAP as ORDER_STATUS_MAP } from "@/data/order";

const PAGE_SIZE_OPTIONS = [5, 7, 10, 20];
const STATUS_TABS = ["Tất cả", "pending", "processing", "shipping", "completed", "cancelled"];
const PAYMENT_OPTIONS = ["Tất cả", "COD", "Chuyển khoản", "Ví điện tử"];
const fmtVND = (n) => n.toLocaleString("vi-VN") + "₫";

const STATUS_UI = {
  completed:  { label: "Hoàn thành", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  shipping:   { label: "Đang giao",  color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  processing: { label: "Đang xử lý", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  pending:    { label: "Chờ duyệt",  color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  cancelled:  { label: "Huỷ",         color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

const StatusBadge = memo(({ status }) => {
  const cfg = STATUS_UI[status] ?? { label: status, color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" };
  return (
    <Box sx={{ 
      display: "inline-flex", px: 1.5, py: 0.5, borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
      color: cfg.color, bgcolor: cfg.bg, border: `1px solid ${cfg.border}`, whiteSpace: "nowrap"
    }}>
      {cfg.label}
    </Box>
  );
});

const SortHeader = memo(({ label, sortKey, currentSort, onSort }) => {
  const active = currentSort?.key === sortKey;
  const asc    = currentSort?.dir === "asc";
  return (
    <Box onClick={() => onSort(sortKey)} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer", userSelect: "none", "&:hover": { color: "#111827" } }}>
      {label}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1px", opacity: active ? 1 : 0.3 }}>
        <FiArrowUp size={8} color={active && asc ? "#4f67f5" : "#9ca3af"} />
        <FiArrowDown size={8} color={active && !asc ? "#4f67f5" : "#9ca3af"} />
      </Box>
    </Box>
  );
});

const RowMenu = memo(({ id }) => {
  const [anchor, setAnchor] = useState(null);
  const router = useRouter();
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ color: "#9ca3af" }}>
        <FiMoreHorizontal size={16} />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} PaperProps={{ elevation: 0, sx: { border: "1px solid #e8ecf0", borderRadius: "10px", minWidth: 160 } }}>
        <MenuItem onClick={() => { setAnchor(null); router.push(`/admin/order/${id}`); }} sx={{ fontSize: "0.82rem", gap: 1, py: 1 }}> <FiEye size={14} /> Xem chi tiết </MenuItem>
        <MenuItem onClick={() => { setAnchor(null); router.push(`/admin/order/${id}/edit`); }} sx={{ fontSize: "0.82rem", gap: 1, py: 1 }}> <FiEdit2 size={14} /> Cập nhật </MenuItem>
        <MenuItem onClick={() => setAnchor(null)} sx={{ fontSize: "0.82rem", color: "#ef4444", gap: 1, py: 1 }}> <FiTrash2 size={14} /> Huỷ đơn </MenuItem>
      </Menu>
    </>
  );
});

function FilterDrawer({ open, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters);
  const set = (key, val) => setLocal((p) => ({ ...p, [key]: val }));
  const reset = () => setLocal({ customerName: "", phone: "", payment: "Tất cả", dateFrom: "", dateTo: "" });
  const apply = () => { onApply(local); onClose(); };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: "100%", sm: 360 }, p: 0 } }}>
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9" }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>Bộ lọc nâng cao</Typography>
        <IconButton onClick={onClose}><FiX size={18} /></IconButton>
      </Box>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, flex: 1, overflowY: "auto" }}>
        <FilterInput label="Tên khách hàng" value={local.customerName} onChange={(v) => set("customerName", v)} icon={<FiUser size={14} />} placeholder="VD: Nguyễn Văn An" />
        <FilterInput label="Số điện thoại" value={local.phone} onChange={(v) => set("phone", v)} icon={<FiPhone size={14} />} placeholder="VD: 090..." />
        
        <Box>
           <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <FiCreditCard size={14} color="#4f67f5" /> Thanh toán
           </Typography>
           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {PAYMENT_OPTIONS.map(p => (
                <Box key={p} onClick={() => set("payment", p)} sx={{ 
                  px: 1.5, py: 0.6, borderRadius: "20px", border: "1px solid", cursor: "pointer", fontSize: "0.8rem", fontWeight: 500,
                  borderColor: local.payment === p ? "#4f67f5" : "#e8ecf0",
                  bgcolor: local.payment === p ? "#eef2ff" : "transparent",
                  color: local.payment === p ? "#4f67f5" : "#6b7280"
                }}>{p}</Box>
              ))}
           </Box>
        </Box>

        <Box>
           <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <FiCalendar size={14} color="#4f67f5" /> Khoảng thời gian
           </Typography>
           <Box sx={{ display: "flex", gap: 1.5 }}>
              <Box component="input" type="date" value={local.dateFrom} onChange={(e) => set("dateFrom", e.target.value)} sx={{ flex: 1, height: 38, border: "1px solid #e8ecf0", borderRadius: "8px", px: 1, fontSize: "0.8rem", outline: "none" }} />
              <Box component="input" type="date" value={local.dateTo} onChange={(e) => set("dateTo", e.target.value)} sx={{ flex: 1, height: 38, border: "1px solid #e8ecf0", borderRadius: "8px", px: 1, fontSize: "0.8rem", outline: "none" }} />
           </Box>
        </Box>
      </Box>
      <Box sx={{ p: 2.5, borderTop: "1px solid #f1f5f9", display: "flex", gap: 1.5 }}>
        <Button fullWidth onClick={reset} sx={{ textTransform: "none", fontWeight: 600, color: "#6b7280", bgcolor: "#f8fafc" }}>Đặt lại</Button>
        <Button fullWidth onClick={apply} variant="contained" sx={{ textTransform: "none", fontWeight: 600, bgcolor: "#4f67f5", boxShadow: "none" }}>Áp dụng</Button>
      </Box>
    </Drawer>
  );
}

function FilterInput({ label, value, onChange, icon, placeholder }) {
  return (
    <Box>
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ color: "#4f67f5", display: "flex" }}>{icon}</Box> {label}
      </Typography>
      <Box sx={{ border: "1px solid #e8ecf0", borderRadius: "8px", px: 1.5, py: 0.8, display: "flex", alignItems: "center" }}>
        <InputBase fullWidth placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} sx={{ fontSize: "0.82rem" }} />
      </Box>
    </Box>
  );
}

// ─── MAIN PAGE ───
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

  const handleSort = useCallback((key) => {
    setSort((p) => p?.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  }, []);

  const parseOrderDate = (d) => { // dd/mm/yyyy
    const [day, month, year] = d.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_ORDERS.filter((o) => {
      if (tab !== "Tất cả" && o.status !== tab) return false;
      if (q && !o.id.toLowerCase().includes(q) && !o.customer.toLowerCase().includes(q) && !o.phone.includes(q)) return false;
      
      if (filters.customerName && !o.customer.toLowerCase().includes(filters.customerName.toLowerCase())) return false;
      if (filters.phone && !o.phone.includes(filters.phone)) return false;
      if (filters.payment !== "Tất cả" && o.payment !== filters.payment) return false;
      
      const oDate = parseOrderDate(o.date);
      if (filters.dateFrom && oDate < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && oDate > new Date(filters.dateTo)) return false;

      return true;
    }).sort((a, b) => {
      if (!sort) return 0;
      const va = a[sort.key], vb = b[sort.key];
      const res = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sort.dir === "asc" ? res : -res;
    });
  }, [search, tab, sort, filters]);

  const stats = useMemo(() => ({
    total:    ALL_ORDERS.length,
    pending:  ALL_ORDERS.filter((o) => o.status === "pending").length,
    shipping: ALL_ORDERS.filter((o) => o.status === "shipping").length,
    revenue:  ALL_ORDERS.filter((o) => o.status === "completed").reduce((s, o) => s + (o.total || 0), 0),
  }), []);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", color: "#111827" }}>Quản lý đơn hàng</Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#9ca3af", mt: 0.4 }}>Theo dõi và xử lý tất cả đơn hàng của cửa hàng</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.25 }}>
          <Button variant="outlined" startIcon={<FiDownload size={15} />} sx={{ borderRadius: "10px", textTransform: "none", fontSize: "0.85rem", fontWeight: 500, borderColor: "#e8ecf0", color: "#374151" }}>
            Xuất file
          </Button>
          <Button variant="contained" startIcon={<FiFilter size={15} />} onClick={() => setFilterOpen(true)} sx={{ borderRadius: "10px", textTransform: "none", fontSize: "0.85rem", fontWeight: 600, bgcolor: "#4f67f5", boxShadow: "0 2px 10px rgba(79,103,245,0.3)" }}>
            Lọc đơn hàng
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        {[
          { icon: <FiShoppingCart size={18} />, label: "Tổng đơn hàng", value: stats.total,    color: "#4f67f5", bg: "#eef2ff", trend: "+12%" },
          { icon: <FiClock size={18} />,        label: "Chờ duyệt",     value: stats.pending,  color: "#7c3aed", bg: "#f5f3ff", trend: "-2" },
          { icon: <FiCheckCircle size={18} />,  label: "Đang giao",     value: stats.shipping, color: "#2563eb", bg: "#eff6ff", trend: "+5" },
          { icon: <FiDollarSign size={18} />,   label: "Doanh thu HT",  value: fmtVND(stats.revenue), color: "#16a34a", bg: "#f0fdf4", trend: "+18%" },
        ].map((s) => (
          <Box key={s.label} sx={{ p: 2.5, bgcolor: "#fff", borderRadius: "16px", border: "1px solid #e8ecf0" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ width: 42, height: 42, bgcolor: s.bg, color: s.color, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</Box>
              <Box sx={{ fontSize: "0.75rem", fontWeight: 700, color: s.trend.startsWith("+") ? "#16a34a" : "#dc2626" }}>{s.trend}</Box>
            </Box>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 800 }}>{s.value}</Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>{s.label}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ bgcolor: "#fff", borderRadius: "16px", border: "1px solid #e8ecf0", overflow: "hidden" }}>
        <Box sx={{ px: 2.5, pt: 2, borderBottom: "1px solid #f1f5f9", display: "flex", gap: 3, overflowX: "auto" }}>
          {STATUS_TABS.map((t) => (
            <Box key={t} onClick={() => { setTab(t); setPage(1); }} sx={{ 
              pb: 1.5, px: 0.5, cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
              color: tab === t ? "#4f67f5" : "#6b7280",
              borderBottom: `2px solid ${tab === t ? "#4f67f5" : "transparent"}`,
              transition: "all 0.2s"
            }}>{t === "Tất cả" ? t : STATUS_UI[t]?.label}</Box>
          ))}
        </Box>

        <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: "1px solid #e8ecf0", borderRadius: "10px", px: 1.5, py: 0.75, width: 280 }}>
            <FiSearch color="#9ca3af" />
            <InputBase placeholder="Tìm đơn hàng, khách hàng..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} sx={{ fontSize: "0.85rem", flex: 1 }} />
          </Box>
          <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>{filtered.length} kết quả</Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { bgcolor: "#f8fafc", color: "#6b7280", fontSize: "0.75rem", fontWeight: 600, borderBottom: "1px solid #f1f5f9" } }}>
                <TableCell sx={{ pl: 2.5, width: 44 }}><Checkbox size="small" sx={{ p: 0 }} /></TableCell>
                <TableCell><SortHeader label="MÃ ĐƠN" sortKey="id" currentSort={sort} onSort={handleSort} /></TableCell>
                <TableCell><SortHeader label="KHÁCH HÀNG" sortKey="customer" currentSort={sort} onSort={handleSort} /></TableCell>
                <TableCell><SortHeader label="GIÁ TRỊ" sortKey="total" currentSort={sort} onSort={handleSort} /></TableCell>
                <TableCell><SortHeader label="TRẠNG THÁI" sortKey="status" currentSort={sort} onSort={handleSort} /></TableCell>
                <TableCell><SortHeader label="NGÀY ĐẶT" sortKey="date" currentSort={sort} onSort={handleSort} /></TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((row) => (
                <TableRow key={row.id} hover sx={{ "& td": { py: 2, fontSize: "0.875rem" } }}>
                  <TableCell sx={{ pl: 2.5 }}><Checkbox size="small" sx={{ p: 0 }} /></TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4f67f5" }}>#{row.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem", bgcolor: "#eef2ff", color: "#4f67f5" }}>{row.customer[0]}</Avatar>
                      <Box><Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>{row.customer}</Typography><Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>{row.phone}</Typography></Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{fmtVND(row.total || 0)}</TableCell>
                  <TableCell><StatusBadge status={row.status} /></TableCell>
                  <TableCell sx={{ color: "#6b7280" }}>{row.date}</TableCell>
                  <TableCell align="right"><RowMenu id={row.id} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination currentPage={page} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />
      </Box>

      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} onApply={(f) => { setFilters(f); setPage(1); }} />
    </Box>
  );
}

OrdersPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;