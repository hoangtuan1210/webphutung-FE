"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
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
import {
  FiSearch, FiSliders, FiDownload, FiPlus,
  FiMoreHorizontal, FiEdit2, FiTrash2, FiEye,
  FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown,
} from "react-icons/fi";
import Pagination from "@/components/admin/Pagination";
import AdminLayout from "@/layouts/AdminLayout";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  { id: 1,  image: "/bao-tay.jpg",      name: "Lốp xe Michelin Pilot Street 2",   sku: "LX-MC-001", category: "Lốp xe",               price: 850000,  stock: 42,  status: "Còn hàng",  brand: "Michelin",  createdAt: "12 Jan, 2025" },
  { id: 2,  image: "/bo-cong-tac.jpg",   name: "Bình ắc quy xe điện GS 12V-20Ah", sku: "AQ-GS-002", category: "Ắc quy",               price: 1250000, stock: 18,  status: "Còn hàng",  brand: "GS",         createdAt: "05 Feb, 2025" },
  { id: 3,  image: "/cum-tang-toc.jpg",  name: "Phanh đĩa Wave Alpha 110cc",       sku: "PD-WA-003", category: "Phanh",                price: 320000,  stock: 0,   status: "Hết hàng",  brand: "Honda",      createdAt: "18 Mar, 2025" },
  { id: 4,  image: "/day-curoa.jpg",     name: "Đèn LED headlight xe máy 35W",     sku: "DL-LE-004", category: "Đèn chiếu sáng",       price: 185000,  stock: 76,  status: "Còn hàng",  brand: "Osram",      createdAt: "22 Mar, 2025" },
  { id: 5,  image: "/gu-carbon.jpg",     name: "Nhớt Motul 3000 4T 20W-50 1L",    sku: "NT-MO-005", category: "Nhớt & dầu",           price: 145000,  stock: 120, status: "Còn hàng",  brand: "Motul",      createdAt: "01 Apr, 2025" },
  { id: 6,  image: "/tay-thang.jpg",     name: "Bộ côn xe SH 150i 2023",           sku: "BC-SH-006", category: "Động cơ",              price: 2100000, stock: 5,   status: "Sắp hết",   brand: "Honda",      createdAt: "10 Apr, 2025" },
  { id: 7,  image: "/bao-tay.jpg",      name: "Pin lithium xe đạp điện 48V-15Ah", sku: "PN-LI-007", category: "Ắc quy",               price: 3850000, stock: 12,  status: "Còn hàng",  brand: "Panasonic",  createdAt: "14 Apr, 2025" },
  { id: 8,  image: "/bo-cong-tac.jpg",   name: "Bộ lọc gió Yamaha Exciter 155",    sku: "LG-YM-008", category: "Lọc & làm sạch",      price: 95000,   stock: 0,   status: "Hết hàng",  brand: "Yamaha",     createdAt: "20 Apr, 2025" },
  { id: 9,  image: "/cum-tang-toc.jpg",  name: "Còi điện 12V xe máy Denso",        sku: "CO-DN-009", category: "Điện xe",              price: 78000,   stock: 88,  status: "Còn hàng",  brand: "Denso",      createdAt: "25 Apr, 2025" },
  { id: 10, image: "/day-curoa.jpg",     name: "Yên xe Honda Vision 2022",          sku: "YX-HV-010", category: "Thân xe & ngoại thất", price: 750000,  stock: 9,   status: "Sắp hết",   brand: "Honda",      createdAt: "02 May, 2025" },
  { id: 11, image: "/gu-carbon.jpg",     name: "Bộ sạc xe điện thông minh 60V-5A", sku: "SC-EV-011", category: "Ắc quy",               price: 420000,  stock: 33,  status: "Còn hàng",  brand: "Bosch",      createdAt: "08 May, 2025" },
  { id: 12, image: "/tay-thang.jpg",     name: "Bugi NGK Iridium CR8EIX",           sku: "BG-NK-012", category: "Động cơ",              price: 165000,  stock: 64,  status: "Còn hàng",  brand: "NGK",        createdAt: "15 May, 2025" },
  { id: 13, image: "/bao-tay.jpg",      name: "Vành bánh trước Exciter 150",       sku: "VB-EX-013", category: "Thân xe & ngoại thất", price: 580000,  stock: 0,   status: "Hết hàng",  brand: "Yamaha",     createdAt: "18 May, 2025" },
  { id: 14, image: "/bo-cong-tac.jpg",   name: "Đèn xi nhan LED SH Mode 125",       sku: "XN-SH-014", category: "Đèn chiếu sáng",       price: 125000,  stock: 47,  status: "Còn hàng",  brand: "Honda",      createdAt: "22 May, 2025" },
  { id: 15, image: "/cum-tang-toc.jpg",  name: "Xích xe máy Honda Wave RSX",        sku: "XC-WR-015", category: "Truyền động",          price: 210000,  stock: 55,  status: "Còn hàng",  brand: "Honda",      createdAt: "28 May, 2025" },
  { id: 16, image: "/day-curoa.jpg",     name: "Nhớt Castrol Power 1 4T 10W-40",   sku: "NT-CA-016", category: "Nhớt & dầu",           price: 138000,  stock: 200, status: "Còn hàng",  brand: "Castrol",    createdAt: "01 Jun, 2025" },
  { id: 17, image: "/gu-carbon.jpg",     name: "Ắc quy Yuasa YTX7A-BS 12V",        sku: "AQ-YU-017", category: "Ắc quy",               price: 680000,  stock: 22,  status: "Còn hàng",  brand: "Yuasa",      createdAt: "05 Jun, 2025" },
  { id: 18, image: "/tay-thang.jpg",     name: "Kính chắn gió xe máy universal",   sku: "KC-UN-018", category: "Thân xe & ngoại thất", price: 290000,  stock: 3,   status: "Sắp hết",   brand: "Generic",    createdAt: "10 Jun, 2025" },
  { id: 19, image: "/bao-tay.jpg",      name: "Bộ phanh ABS Honda CB150R",         sku: "PH-CB-019", category: "Phanh",                price: 1850000, stock: 7,   status: "Còn hàng",  brand: "Honda",      createdAt: "12 Jun, 2025" },
  { id: 20, image: "/bo-cong-tac.jpg",   name: "Lốp Bridgestone Battlax BT46",     sku: "LX-BS-020", category: "Lốp xe",               price: 920000,  stock: 31,  status: "Còn hàng",  brand: "Bridgestone", createdAt: "15 Jun, 2025" },
];

const PAGE_SIZE_OPTIONS = [5, 7, 10, 20];
const fmtVND = (n) => n.toLocaleString("vi-VN") + "₫";

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  "Còn hàng": { label: "Còn hàng",  color: "#16a34a", bg: "transparent" },
  "Sắp hết":  { label: "Sắp hết",   color: "#d97706", bg: "transparent" },
  "Hết hàng": { label: "Hết hàng",  color: "#dc2626", bg: "transparent" },
};

function StatusText({ status }) {
  const cfg = STATUS_CFG[status] ?? { label: status, color: "#6b7280", bg: "transparent" };
  return (
    <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: cfg.color }}>
      {cfg.label}
    </Typography>
  );
}

// ─── SORT HEADER ──────────────────────────────────────────────────────────────
function SortHeader({ label, sortKey, currentSort, onSort }) {
  const active = currentSort?.key === sortKey;
  const asc    = currentSort?.dir === "asc";
  return (
    <Box
      onClick={() => onSort(sortKey)}
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer", userSelect: "none", "&:hover": { color: "#111827" } }}
    >
      {label}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1px", opacity: active ? 1 : 0.35 }}>
        <FiArrowUp   size={9} color={active && asc  ? "#4f67f5" : "#9ca3af"} />
        <FiArrowDown size={9} color={active && !asc ? "#4f67f5" : "#9ca3af"} />
      </Box>
    </Box>
  );
}

// ─── ROW ACTION MENU ──────────────────────────────────────────────────────────
function RowMenu({ id }) {
  const router = useRouter();
  const [anchor, setAnchor] = useState(null);

  const handleView = () => {
    setAnchor(null);
    router.push(`/admin/products/${id}`);
  };

  const handleEdit = () => {
    setAnchor(null);
    router.push(`/admin/products/${id}/edit`);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ color: "#9ca3af", borderRadius: "6px", "&:hover": { bgcolor: "#f1f5f9", color: "#374151" } }}
      >
        <FiMoreHorizontal size={16} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ elevation: 0, sx: { border: "1px solid #e8ecf0", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", minWidth: 150 } }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem
          onClick={handleView}
          sx={{ fontSize: "0.82rem", color: "#374151", gap: 1.25, py: 1, px: 1.75, "&:hover": { bgcolor: "#f8fafc" } }}
        >
          <FiEye size={14} /> Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={handleEdit}
          sx={{ fontSize: "0.82rem", color: "#374151", gap: 1.25, py: 1, px: 1.75, "&:hover": { bgcolor: "#f8fafc" } }}
        >
          <FiEdit2 size={14} /> Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => setAnchor(null)}
          sx={{ fontSize: "0.82rem", color: "#ef4444", gap: 1.25, py: 1, px: 1.75, "&:hover": { bgcolor: "#fef2f2" } }}
        >
          <FiTrash2 size={14} /> Xoá
        </MenuItem>
      </Menu>
    </>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [selected, setSelected] = useState([]);
  const [sort,     setSort]     = useState(null); // { key, dir }

  const handleSort = (key) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = ALL_PRODUCTS.filter((p) =>
      !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    if (sort) {
      list = [...list].sort((a, b) => {
        const va = a[sort.key], vb = b[sort.key];
        const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const allChecked   = paginated.length > 0 && paginated.every((r) => selected.includes(r.id));
  const someChecked  = paginated.some((r) => selected.includes(r.id));
  const toggleAll    = () => setSelected(allChecked ? [] : paginated.map((r) => r.id));
  const toggleRow    = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const COLS = [
    { key: "name",      label: "Sản phẩm"  },
    { key: "category",  label: "Danh mục"  },
    { key: "brand",     label: "Thương hiệu" },
    { key: "price",     label: "Giá"       },
    { key: "stock",     label: "Tồn kho"   },
    { key: "createdAt", label: "Ngày tạo"  },
  ];

  return (
    <Box>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", color: "#111827", lineHeight: 1.2 }}>
           Danh sách sản phẩm
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#9ca3af", mt: 0.4 }}>
              Theo dõi và quản lý tất cả sản phẩm trong kho của bạn
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.25 }}>
          <Button
            variant="outlined"
            startIcon={<FiDownload size={15} />}
            sx={{ borderRadius: "10px", textTransform: "none", fontSize: "0.85rem", fontWeight: 500, borderColor: "#e8ecf0", color: "#374151", "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" }, px: 2.25, py: 0.9 }}
          >
            Export
          </Button>
          <Button
            component={Link}
            href="/admin/products/create"
            variant="contained"
            startIcon={<FiPlus size={15} />}
            sx={{ borderRadius: "10px", textTransform: "none", fontSize: "0.85rem", fontWeight: 600, bgcolor: "#4f67f5", boxShadow: "0 2px 10px rgba(79,103,245,0.3)", "&:hover": { bgcolor: "#3d55e0" }, px: 2.25, py: 0.9 }}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* ── Table card ──────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "#fff", borderRadius: "16px", border: "1px solid #e8ecf0", overflow: "hidden" }}>

        {/* Search + filter toolbar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 2, gap: 2 }}>
          {/* Search input */}
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1,
            border: "1px solid #e8ecf0", borderRadius: "10px", px: 1.75, py: 0.85,
            width: { xs: "100%", sm: 280 },
            "&:focus-within": { borderColor: "#4f67f5", boxShadow: "0 0 0 3px rgba(79,103,245,0.1)" },
            transition: "all 0.15s",
          }}>
            <FiSearch size={15} color="#9ca3af" />
            <InputBase
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search..."
              sx={{ fontSize: "0.85rem", color: "#374151", flex: 1, "& input::placeholder": { color: "#9ca3af" } }}
            />
          </Box>

          {/* Filter button */}
          <Button
            variant="outlined"
            startIcon={<FiSliders size={14} />}
            sx={{ borderRadius: "10px", textTransform: "none", fontSize: "0.82rem", fontWeight: 500, borderColor: "#e8ecf0", color: "#374151", "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" }, px: 2, py: 0.85, whiteSpace: "nowrap" }}
          >
            Filter
          </Button>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { borderBottom: "1px solid #f1f5f9", py: 1.25, fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", bgcolor: "#fff" } }}>
                {/* Checkbox */}
                <TableCell sx={{ pl: 2.5, width: 44 }}>
                  <Checkbox
                    size="small"
                    checked={allChecked}
                    indeterminate={someChecked && !allChecked}
                    onChange={toggleAll}
                    sx={{ p: 0, color: "#d1d5db", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#4f67f5" } }}
                  />
                </TableCell>

                {/* Sortable columns */}
                {COLS.map((col) => (
                  <TableCell key={col.key} sx={{ cursor: "pointer", ...(col.key === "name" && { minWidth: 260 }) }}>
                    <SortHeader label={col.label} sortKey={col.key} currentSort={sort} onSort={handleSort} />
                  </TableCell>
                ))}

                {/* Actions */}
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8, color: "#9ca3af", fontSize: "0.875rem" }}>
                    Không tìm thấy sản phẩm nào
                  </TableCell>
                </TableRow>
              ) : paginated.map((row) => {
                const checked = selected.includes(row.id);
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      "& td": { borderBottom: "1px solid #f8fafc", py: 1.75, fontSize: "0.875rem", color: "#374151" },
                      "&:last-child td": { borderBottom: "none" },
                      bgcolor: checked ? "#f5f7ff" : "transparent",
                      "&:hover": { bgcolor: checked ? "#eef1ff" : "#fafafa" },
                      transition: "background 0.1s",
                    }}
                  >
                    {/* Checkbox */}
                    <TableCell sx={{ pl: 2.5 }}>
                      <Checkbox
                        size="small"
                        checked={checked}
                        onChange={() => toggleRow(row.id)}
                        sx={{ p: 0, color: "#d1d5db", "&.Mui-checked": { color: "#4f67f5" } }}
                      />
                    </TableCell>

                    {/* Product */}
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: "10px", overflow: "hidden", border: "1px solid #f1f5f9", flexShrink: 0, bgcolor: "#f8fafc" }}>
                          <img src={row.image} alt={row.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Box>
                        <Link href={`/admin/products/${row.id}`} style={{ textDecoration: "none", color: "#111827", fontWeight: 600 }}>
                          <Typography sx={{fontSize: "0.875rem" }}>
                            {row.name}
                          </Typography>
                        </Link>
                      </Box>
                    </TableCell>

                    {/* Category */}
                    <TableCell sx={{ color: "#6b7280" }}>{row.category}</TableCell>

                    {/* Brand */}
                    <TableCell sx={{ color: "#6b7280" }}>{row.brand}</TableCell>

                    {/* Price */}
                    <TableCell sx={{ fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>
                      {fmtVND(row.price)}
                    </TableCell>

                    {/* Stock status */}
                    <TableCell><StatusText status={row.status} /></TableCell>

                    {/* Created At */}
                    <TableCell sx={{ color: "#9ca3af", whiteSpace: "nowrap" }}>{row.createdAt}</TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <RowMenu id={row.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
          showPageSizeSelector={true}
          showPageInfo={true}
        />
      </Box>
    </Box>
  );
}

ProductsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;