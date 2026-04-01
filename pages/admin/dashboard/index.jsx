"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {
  FiChevronRight, FiMoreVertical,
  FiTrendingUp, FiTrendingDown,
  FiUsers, FiShoppingBag, FiCalendar,
  FiChevronLeft, FiDollarSign, FiPackage,
  FiStar, FiRefreshCw, FiArrowUpRight,
} from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import AdminLayout from "@/layouts/AdminLayout";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const monthlySales = [
  { month: "T1",  value: 140 }, { month: "T2",  value: 370 },
  { month: "T3",  value: 190 }, { month: "T4",  value: 290 },
  { month: "T5",  value: 170 }, { month: "T6",  value: 155 },
  { month: "T7",  value: 275 }, { month: "T8",  value: 85  },
  { month: "T9",  value: 210 }, { month: "T10", value: 375 },
  { month: "T11", value: 265 }, { month: "T12", value: 105 },
];

const statsData = [
  { name: "T2", overview: 180, sales: 120, revenue: 95  },
  { name: "T3", overview: 220, sales: 180, revenue: 140 },
  { name: "T4", overview: 165, sales: 145, revenue: 110 },
  { name: "T5", overview: 240, sales: 200, revenue: 160 },
  { name: "T6", overview: 190, sales: 160, revenue: 125 },
  { name: "T7", overview: 280, sales: 230, revenue: 195 },
  { name: "T8", overview: 210, sales: 175, revenue: 145 },
  { name: "T9", overview: 260, sales: 215, revenue: 175 },
];

const TABS       = ["Overview", "Sales", "Revenue"];
const TARGET_PCT = 75.55;
const GAP        = 20;

const MONTHS_VI = ["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"];
const DAYS_VI   = ["CN","T2","T3","T4","T5","T6","T7"];

// ─── EXTRA DATA ───────────────────────────────────────────────────────────────
const TOP_PRODUCTS = [
  { name: "Lốp xe Michelin Pilot Street 2", sold: 312, revenue: 265200000, trend: 18 },
  { name: "Nhớt Motul 3000 4T 20W-50 1L",  sold: 289, revenue:  41905000, trend:  9 },
  { name: "Đèn LED headlight 35W",          sold: 201, revenue:  37185000, trend: -4 },
  { name: "Ắc quy Yuasa YTX7A-BS 12V",     sold: 147, revenue:  99960000, trend: 22 },
  { name: "Bugi NGK Iridium CR8EIX",        sold: 134, revenue:  22110000, trend:  5 },
];

const RECENT_ORDERS = [
  { id: "#ORD-10234", customer: "Nguyễn Văn A", amount: 1700000, status: "Hoàn thành",  date: "01/04/2026" },
  { id: "#ORD-10233", customer: "Trần Thị B",   amount: 3850000, status: "Đang giao",   date: "01/04/2026" },
  { id: "#ORD-10232", customer: "Lê Minh C",    amount:  560000, status: "Chờ duyệt",   date: "31/03/2026" },
  { id: "#ORD-10231", customer: "Phạm Thu D",   amount: 2100000, status: "Đang xử lý",  date: "31/03/2026" },
  { id: "#ORD-10230", customer: "Vũ Hải E",     amount:  850000, status: "Hoàn thành",  date: "30/03/2026" },
];

const ORDER_STATUS_DATA = [
  { name: "Hoàn thành", value: 58, color: "#16a34a" },
  { name: "Đang giao",  value: 22, color: "#2563eb" },
  { name: "Chờ duyệt", value: 12, color: "#7c3aed" },
  { name: "Huỷ",        value:  8, color: "#ef4444" },
];

const STATUS_CFG = {
  "Hoàn thành": { color: "#16a34a", bg: "#f0fdf4" },
  "Đang giao":  { color: "#2563eb", bg: "#eff6ff" },
  "Đang xử lý": { color: "#d97706", bg: "#fffbeb" },
  "Chờ duyệt":  { color: "#7c3aed", bg: "#f5f3ff" },
  "Huỷ":        { color: "#ef4444", bg: "#fef2f2" },
};

const fmtVND = (n) => n.toLocaleString("vi-VN") + "₫";

// ─── CARD SX ─────────────────────────────────────────────────────────────────
const card = {
  bgcolor: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e8ecf0",
};

// ─── DATE RANGE PICKER ────────────────────────────────────────────────────────
function DateRangePicker({ value, onChange }) {
  const [open,      setOpen]      = useState(false);
  const [viewDate,  setViewDate]  = useState(value?.start ?? new Date());
  const [selecting, setSelecting] = useState(null); // null | Date (start selected, picking end)
  const [hovered,   setHovered]   = useState(null);
  const ref = useRef(null);

  const start = value?.start;
  const end   = value?.end;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Calendar helpers ────────────────────────────────────────────────────────
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay   = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSameDay = (a, b) =>
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate();

  const inRange = (d) => {
    const endRef = selecting ? (hovered ?? null) : end;
    if (!start || !endRef) return false;
    const lo = start <= endRef ? start : endRef;
    const hi = start <= endRef ? endRef : start;
    return d > lo && d < hi;
  };

  const isStart   = (d) => isSameDay(d, start);
  const isEnd     = (d) => isSameDay(d, selecting ? (hovered ?? null) : end);

  const handleDay = (d) => {
    if (!selecting) {
      // First click → set start
      setSelecting(d);
      onChange({ start: d, end: null });
    } else {
      // Second click → set end, close
      const lo = d >= selecting ? selecting : d;
      const hi = d >= selecting ? d : selecting;
      onChange({ start: lo, end: hi });
      setSelecting(null);
      setOpen(false);
    }
  };

  // ── Format label ────────────────────────────────────────────────────────────
  const fmt = (d) => d ? `${d.getDate()}/${d.getMonth() + 1}` : "?";
  const label = start && end
    ? `${fmt(start)} – ${fmt(end)}`
    : start
    ? `${fmt(start)} – ...`
    : "Chọn ngày";

  // ── Build calendar cells ────────────────────────────────────────────────────
  const cells = [];
  // Empty cells before first day (Sun=0)
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <Box ref={ref} sx={{ position: "relative" }}>
      {/* Trigger */}
      <Box
        onClick={() => setOpen((p) => !p)}
        sx={{
          display: "flex", alignItems: "center", gap: 0.75,
          border: `1px solid ${open ? "#4f67f5" : "#e8ecf0"}`,
          borderRadius: "10px", px: 1.5, py: 0.75,
          cursor: "pointer", bgcolor: "#fff",
          "&:hover": { borderColor: "#4f67f5" },
          transition: "border 0.15s",
          userSelect: "none",
        }}
      >
        <FiCalendar size={14} color={open ? "#4f67f5" : "#6b7280"} />
        <Typography sx={{ fontSize: "0.8rem", color: open ? "#4f67f5" : "#374151", fontWeight: 500 }}>
          {label}
        </Typography>
      </Box>

      {/* Popover calendar */}
      {open && (
        <Box
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 999,
            bgcolor: "#fff",
            borderRadius: "14px",
            border: "1px solid #e8ecf0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            p: 2,
            minWidth: 280,
          }}
        >
          {/* Header: prev / month-year / next */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <IconButton size="small" onClick={prevMonth}
              sx={{ color: "#6b7280", "&:hover": { bgcolor: "#f1f5f9" }, borderRadius: "8px" }}>
              <FiChevronLeft size={15} />
            </IconButton>

            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>
              {MONTHS_VI[month]} {year}
            </Typography>

            <IconButton size="small" onClick={nextMonth}
              sx={{ color: "#6b7280", "&:hover": { bgcolor: "#f1f5f9" }, borderRadius: "8px" }}>
              <FiChevronRight size={15} />
            </IconButton>
          </Box>

          {/* Day-of-week labels */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0.5 }}>
            {DAYS_VI.map((d) => (
              <Typography key={d} sx={{ textAlign: "center", fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", py: 0.5 }}>
                {d}
              </Typography>
            ))}
          </Box>

          {/* Day cells */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
            {cells.map((d, i) => {
              if (!d) return <Box key={`e-${i}`} />;

              const _isStart  = isStart(d);
              const _isEnd    = isEnd(d);
              const _inRange  = inRange(d);
              const _today    = isSameDay(d, new Date());
              const highlight = _isStart || _isEnd;

              return (
                <Box
                  key={d.toISOString()}
                  onClick={() => handleDay(d)}
                  onMouseEnter={() => selecting && setHovered(d)}
                  onMouseLeave={() => setHovered(null)}
                  sx={{
                    height: 34,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: highlight ? "8px" : _inRange ? "0" : "8px",
                    bgcolor: highlight
                      ? "#4f67f5"
                      : _inRange
                      ? "#eef2ff"
                      : "transparent",
                    color: highlight ? "#fff" : _inRange ? "#4f67f5" : "#111827",
                    fontWeight: highlight ? 700 : _today ? 700 : 400,
                    fontSize: "0.82rem",
                    position: "relative",
                    // Subtle today indicator
                    ..._today && !highlight && {
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 3,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        bgcolor: "#4f67f5",
                      },
                    },
                    "&:hover": {
                      bgcolor: highlight ? "#3d55e0" : "#f1f5f9",
                      color: highlight ? "#fff" : "#111827",
                    },
                    transition: "all 0.1s",
                  }}
                >
                  {d.getDate()}
                </Box>
              );
            })}
          </Box>

          {/* Footer hint */}
          <Typography sx={{ mt: 1.5, fontSize: "0.72rem", color: "#9ca3af", textAlign: "center" }}>
            {selecting ? "Chọn ngày kết thúc" : "Chọn ngày bắt đầu"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── GAUGE ────────────────────────────────────────────────────────────────────
function GaugeChart({ pct }) {
  const r = 100, cx = 140, cy = 120, sw = 16;
  const half = Math.PI * r;
  const filled = (pct / 100) * half;
  return (
    <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
      <svg width="280" height="150" viewBox="0 0 280 150">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f67f5" />
          </linearGradient>
        </defs>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#e8ecf0" strokeWidth={sw} strokeLinecap="round" />
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="url(#gaugeGrad)" strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${filled} ${half}`} />
      </svg>
      <Box sx={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", textAlign: "center", pb: 0.5 }}>
        <Typography sx={{ fontSize: "2.4rem", fontWeight: 900, color: "#111827", lineHeight: 1, letterSpacing: "-0.02em" }}>
          {pct}%
        </Typography>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.4, mt: 0.75, bgcolor: "#dcfce7", borderRadius: "20px", px: 1.25, py: 0.3 }}>
          <FiTrendingUp size={11} color="#16a34a" />
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#16a34a" }}>+10%</Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, pct, up }) {
  return (
    <Box sx={{ ...card, p: 2.5, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5 }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mb: 1 }}>{label}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, px: 1.1, py: 0.4, borderRadius: "8px", bgcolor: up ? "#f0fdf4" : "#fef2f2" }}>
          {up ? <FiTrendingUp size={13} color="#16a34a" /> : <FiTrendingDown size={13} color="#ef4444" />}
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: up ? "#16a34a" : "#ef4444" }}>{pct}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: "#1e293b", borderRadius: "8px", px: 1.75, py: 1 }}>
      <Typography sx={{ fontSize: "0.68rem", color: "#94a3b8", mb: 0.35 }}>{label}</Typography>
      <Typography sx={{ fontSize: "0.82rem", color: "#f1f5f9", fontWeight: 600 }}>{payload[0].value}</Typography>
    </Box>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
function DashboardPage() {
  const [activeTab,  setActiveTab]  = useState("Overview");
  const [dateRange,  setDateRange]  = useState({
    start: new Date(2026, 2, 17), // 17/3
    end:   new Date(2026, 2, 23), // 23/3
  });

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>

      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: `${GAP}px` }}>
        <Typography component={Link} href="/admin"
          sx={{ fontSize: "0.8rem", color: "#6b7280", textDecoration: "none", "&:hover": { color: "#4f67f5" } }}>
          Home
        </Typography>
        <FiChevronRight size={13} color="#9ca3af" />
        <Typography sx={{ fontSize: "0.8rem", color: "#111827", fontWeight: 600 }}>Dashboard</Typography>
      </Box>

      {/* ── Section 1: 2 cột ────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: `${GAP}px`,
          mb: `${GAP}px`,
          "& > *": { minWidth: 0 },
        }}
      >
        {/* Cột trái */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: `${GAP}px` }}>
          {/* 4 KPI stat cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: `${GAP}px` }}>
            <StatCard icon={<FiUsers size={22} color="#374151" />}      label="Khách hàng" value="3,782" pct="11.01%" up />
            <StatCard icon={<FiShoppingBag size={22} color="#374151" />} label="Đơn hàng"  value="5,359" pct="9.05%"  up={false} />
            <StatCard icon={<FiDollarSign size={22} color="#374151" />}  label="Doanh thu" value="112M₫" pct="18.2%"  up />
            <StatCard icon={<FiPackage size={22} color="#374151" />}     label="Sản phẩm"  value="248"   pct="4.5%"   up />
          </Box>

          {/* Bar chart */}
          <Box sx={{ ...card, p: 2.5, flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>Doanh số hàng tháng</Typography>
              <IconButton size="small" sx={{ color: "#9ca3af" }}><FiMoreVertical size={18} /></IconButton>
            </Box>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={monthlySales} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="value" fill="#4f67f5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Cột phải: Monthly Target */}
        <Box sx={{ ...card, p: 2.5, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: "#111827" }}>Mục tiêu tháng</Typography>
              <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af", mt: 0.3 }}>Mục tiêu bạn đặt mỗi tháng</Typography>
            </Box>
            <IconButton size="small" sx={{ color: "#9ca3af", mt: -0.5 }}><FiMoreVertical size={18} /></IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 1 }}>
            <GaugeChart pct={TARGET_PCT} />
          </Box>

          <Typography sx={{ fontSize: "0.875rem", color: "#6b7280", textAlign: "center", lineHeight: 1.7, mb: 3 }}>
            Hôm nay bạn đã thu về{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "#111827" }}>32.87M₫</Box>
            , cao hơn tháng trước.{" "}
            <Box component="span" sx={{ color: "#111827", fontWeight: 500 }}>Tiếp tục phát huy!</Box>
          </Typography>

          <Box sx={{ display: "flex", borderTop: "1px solid #f1f5f9", pt: 2 }}>
            {[
              { label: "Mục tiêu",  value: "200M₫", up: false },
              { label: "Doanh thu", value: "112M₫", up: true  },
              { label: "Hôm nay",   value: "3.2M₫", up: true  },
            ].map((m, i, arr) => (
              <Box key={m.label} sx={{ flex: 1, textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af", mb: 0.6 }}>{m.label}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                  <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>{m.value}</Typography>
                  {m.up ? <FiTrendingUp size={13} color="#16a34a" /> : <FiTrendingDown size={13} color="#ef4444" />}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Section 1.5: Bottom row — Top SP + Đơn gần đây + Pie ──────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr 360px" },
          gap: `${GAP}px`,
          mb: `${GAP}px`,
          "& > *": { minWidth: 0 },
        }}
      >
        {/* Top sản phẩm bán chạy */}
        <Box sx={{ ...card, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>Top sản phẩm bán chạy</Typography>
            <Box component={Link} href="/admin/products"
              sx={{ fontSize: "0.78rem", color: "#4f67f5", display: "flex", alignItems: "center", gap: 0.4, textDecoration: "none", "&:hover": { opacity: 0.8 } }}>
              Xem tất cả <FiArrowUpRight size={13} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
            {TOP_PRODUCTS.map((p, i) => (
              <Box key={p.name} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ width: 26, height: 26, borderRadius: "8px", bgcolor: i === 0 ? "#fef3c7" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: i === 0 ? "#d97706" : "#9ca3af" }}>#{i + 1}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>{p.name}</Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>{p.sold} đã bán · {fmtVND(p.revenue)}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, px: 1, py: 0.3, borderRadius: "20px", bgcolor: p.trend >= 0 ? "#f0fdf4" : "#fef2f2", flexShrink: 0 }}>
                  {p.trend >= 0 ? <FiTrendingUp size={11} color="#16a34a" /> : <FiTrendingDown size={11} color="#ef4444" />}
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: p.trend >= 0 ? "#16a34a" : "#ef4444" }}>{p.trend > 0 ? "+" : ""}{p.trend}%</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Đơn hàng gần đây */}
        <Box sx={{ ...card, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>Đơn hàng gần đây</Typography>
            <Box component={Link} href="/admin/order"
              sx={{ fontSize: "0.78rem", color: "#4f67f5", display: "flex", alignItems: "center", gap: 0.4, textDecoration: "none", "&:hover": { opacity: 0.8 } }}>
              Xem tất cả <FiArrowUpRight size={13} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {RECENT_ORDERS.map((o) => {
              const cfg = STATUS_CFG[o.status] ?? { color: "#6b7280", bg: "#f9fafb" };
              return (
                <Box key={o.id} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#4f67f5" }}>{o.id}</Typography>
                      <Typography noWrap sx={{ fontSize: "0.78rem", color: "#6b7280" }}>· {o.customer}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mt: 0.2 }}>{o.date}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827", flexShrink: 0 }}>{fmtVND(o.amount)}</Typography>
                  <Box sx={{ px: 1, py: 0.3, borderRadius: "20px", bgcolor: cfg.bg, flexShrink: 0 }}>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: cfg.color }}>{o.status}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Biểu đồ tỷ lệ đơn hàng */}
        <Box sx={{ ...card, p: 2.5, display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827", mb: 0.5 }}>Tỷ lệ đơn hàng</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af", mb: 2 }}>Phân bổ theo trạng thái</Typography>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PieChart width={170} height={170}>
              <Pie data={ORDER_STATUS_DATA} cx={85} cy={85} innerRadius={50} outerRadius={78}
                dataKey="value" paddingAngle={3} strokeWidth={0}>
                {ORDER_STATUS_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} />
            </PieChart>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            {ORDER_STATUS_DATA.map((s) => (
              <Box key={s.name} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: s.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: "0.78rem", color: "#374151" }}>{s.name}</Typography>
                </Box>
                <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}>{s.value}%</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Section 2: Statistics + tabs + date picker ──────────────────── */}
      <Box sx={{ ...card, p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2.5, flexWrap: "wrap", gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>Thống kê</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af", mt: 0.2 }}>Mục tiêu bạn đặt mỗi tháng</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            {/* Tab pills */}
            <Box sx={{ display: "flex", bgcolor: "#f8fafc", borderRadius: "10px", p: 0.5, border: "1px solid #e8ecf0" }}>
              {TABS.map((tab) => (
                <Box
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  sx={{
                    px: 1.75, py: 0.6, borderRadius: "8px", cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: activeTab === tab ? 700 : 500,
                    color: activeTab === tab ? "#111827" : "#9ca3af",
                    bgcolor: activeTab === tab ? "#ffffff" : "transparent",
                    boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.15s",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab}
                </Box>
              ))}
            </Box>

            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </Box>
        </Box>

        <ResponsiveContainer width="100%" height={220}>
          {activeTab === "Revenue" ? (
            <AreaChart data={statsData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#4f67f5" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#4f67f5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="revenue" stroke="#4f67f5" strokeWidth={2.5} fill="url(#gRev)" dot={false} activeDot={{ r: 5, fill: "#4f67f5" }} />
            </AreaChart>
          ) : activeTab === "Sales" ? (
            <LineChart data={statsData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="sales" stroke="#4f67f5" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#4f67f5" }} />
            </LineChart>
          ) : (
            <BarChart data={statsData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="overview" fill="#4f67f5" radius={[5, 5, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>

    </Box>
  );
}

DashboardPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default DashboardPage;