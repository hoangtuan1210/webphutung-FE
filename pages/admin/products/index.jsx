"use client";
import { useState, useMemo, useCallback, memo } from "react";
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

import { MOCK_PRODUCTS, CATEGORIES as PRODUCT_CATEGORIES } from "@/data/product";

const PAGE_SIZE_OPTIONS = [5, 7, 10, 20];
const fmtVND = (n) => n.toLocaleString("vi-VN") + "₫";

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  "Còn hàng": { label: "Còn hàng",  color: "#16a34a", bg: "transparent" },
  "Sắp hết":  { label: "Sắp hết",   color: "#d97706", bg: "transparent" },
  "Hết hàng": { label: "Hết hàng",  color: "#dc2626", bg: "transparent" },
};

const StatusText = memo(({ status }) => {
  const cfg = STATUS_CFG[status] ?? { label: status, color: "#6b7280", bg: "transparent" };
  return (
    <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: cfg.color }}>
      {cfg.label}
    </Typography>
  );
});
StatusText.displayName = "StatusText";

// ─── SORT HEADER ──────────────────────────────────────────────────────────────
const SortHeader = memo(({ label, sortKey, currentSort, onSort }) => {
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
});
SortHeader.displayName = "SortHeader";

// ─── ROW ACTION MENU ──────────────────────────────────────────────────────────
const RowMenu = memo(({ id, onView, onEdit, onDelete }) => {
  const [anchor, setAnchor] = useState(null);

  const handleView = useCallback(() => {
    setAnchor(null);
    onView(id);
  }, [id, onView]);

  const handleEdit = useCallback(() => {
    setAnchor(null);
    onEdit(id);
  }, [id, onEdit]);

  const handleDelete = useCallback(() => {
    setAnchor(null);
    onDelete(id);
  }, [id, onDelete]);

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
          onClick={handleDelete}
          sx={{ fontSize: "0.82rem", color: "#ef4444", gap: 1.25, py: 1, px: 1.75, "&:hover": { bgcolor: "#fef2f2" } }}
        >
          <FiTrash2 size={14} /> Xoá
        </MenuItem>
      </Menu>
    </>
  );
});
RowMenu.displayName = "RowMenu";

export default function ProductsPage() {
  const router = useRouter();
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [selected, setSelected] = useState([]);
  const [sort,     setSort]     = useState(null); 

  const handleSort = useCallback((key) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  }, []);

  const products = useMemo(() => {
    return MOCK_PRODUCTS.map(p => ({
      ...p,
      image: p.images?.[0] || "/placeholder.jpg",
      status: p.stock === 0 ? "Hết hàng" : p.stock < 10 ? "Sắp hết" : "Còn hàng"
    }));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = products.filter((p) =>
      !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)) || p.category.toLowerCase().includes(q)
    );
    if (sort) {
      list = [...list].sort((a, b) => {
        const va = a[sort.key], vb = b[sort.key];
        const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [products, search, sort]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length, pageSize]);
  const safePage   = useMemo(() => Math.min(page, totalPages), [page, totalPages]);
  const paginated  = useMemo(() => filtered.slice((safePage - 1) * pageSize, safePage * pageSize), [filtered, safePage, pageSize]);

  const allChecked   = useMemo(() => paginated.length > 0 && paginated.every((r) => selected.includes(r.id)), [paginated, selected]);
  const someChecked  = useMemo(() => paginated.some((r) => selected.includes(r.id)), [paginated, selected]);
  
  const toggleAll    = useCallback(() => setSelected(allChecked ? [] : paginated.map((r) => r.id)), [allChecked, paginated]);
  const toggleRow    = useCallback((id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]), []);

  const COLS = useMemo(() => [
    { key: "name",      label: "Sản phẩm"  },
    { key: "category",  label: "Danh mục"  },
    { key: "brand",     label: "Thương hiệu" },
    { key: "price",     label: "Giá"       },
    { key: "stock",     label: "Tồn kho"   },
    { key: "createdAt", label: "Ngày tạo"  },
  ], []);

  /* ── Navigation Handlers ── */
  const handleViewProduct = useCallback((id) => router.push(`/admin/products/${id}`), [router]);
  const handleEditProduct = useCallback((id) => router.push(`/admin/products/${id}/edit`), [router]);
  const handleDeleteProduct = useCallback((id) => {
     // handle delete logic or open confirm dialog
     console.log("Delete", id);
  }, []);

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
            Xuất File
          </Button>
          <Button
            component={Link}
            href="/admin/products/create"
            variant="contained"
            startIcon={<FiPlus size={15} />}
            sx={{ borderRadius: "10px", textTransform: "none", fontSize: "0.85rem", fontWeight: 600, bgcolor: "#4f67f5", boxShadow: "0 2px 10px rgba(79,103,245,0.3)", "&:hover": { bgcolor: "#3d55e0" }, px: 2.25, py: 0.9 }}
          >
            Thêm sản phẩm
          </Button>
        </Box>
      </Box>

      {/* ── Table card ──────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "#fff", borderRadius: "16px", border: "1px solid #e8ecf0", overflow: "hidden" }}>

        {/* Search + filter toolbar */}
        <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1,
            border: "1px solid #e8ecf0", borderRadius: "10px", px: 1.5, py: 0.75,
            width: { xs: "100%", sm: 280 },
            "&:focus-within": { borderColor: "#4f67f5", boxShadow: "0 0 0 3px rgba(79,103,245,0.1)" },
            transition: "all 0.15s",
          }}>
            <FiSearch size={15} color="#9ca3af" />
            <InputBase
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm kiếm sản phẩm..."
              sx={{ fontSize: "0.85rem", color: "#374151", flex: 1, "& input::placeholder": { color: "#9ca3af" } }}
            />
          </Box>
          <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>{filtered.length} kết quả</Typography>
        </Box>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ "& th": { bgcolor: "#f8fafc", color: "#6b7280", fontSize: "0.75rem", fontWeight: 600, borderBottom: "1px solid #f1f5f9" } }}>
                <TableCell sx={{ pl: 2.5, width: 44 }}>
                  <Checkbox
                    size="small"
                    checked={allChecked}
                    indeterminate={someChecked && !allChecked}
                    onChange={toggleAll}
                    sx={{ p: 0, color: "#d1d5db", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#4f67f5" } }}
                  />
                </TableCell>

                {COLS.map((col) => (
                  <TableCell key={col.key}>
                    <SortHeader label={col.label} sortKey={col.key} currentSort={sort} onSort={handleSort} />
                  </TableCell>
                ))}

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
                    hover
                    sx={{
                      "& td": { borderBottom: "1px solid #f8fafc", py: 2, fontSize: "0.875rem", color: "#374151" },
                      "&:last-child td": { borderBottom: "none" },
                      bgcolor: checked ? "#f5f7ff" : "transparent",
                      transition: "background 0.1s",
                    }}
                  >
                    <TableCell sx={{ pl: 2.5 }}>
                      <Checkbox
                        size="small"
                        checked={checked}
                        onChange={() => toggleRow(row.id)}
                        sx={{ p: 0, color: "#d1d5db", "&.Mui-checked": { color: "#4f67f5" } }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "8px", overflow: "hidden", border: "1px solid #f1f5f9", flexShrink: 0, bgcolor: "#f8fafc" }}>
                          <img src={row.image} alt={row.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>{row.name}</Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>{row.sku}</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ color: "#6b7280" }}>{row.category}</TableCell>
                    <TableCell sx={{ color: "#6b7280" }}>{row.brand}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#111827" }}>
                      {fmtVND(row.price)}
                    </TableCell>
                    <TableCell><StatusText status={row.status} /></TableCell>
                    <TableCell sx={{ color: "#9ca3af" }}>{row.createdAt}</TableCell>

                    <TableCell align="right" sx={{ pr: 2 }}>
                      <RowMenu 
                        id={row.id} 
                        onView={handleViewProduct}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </Box>
    </Box>
  );
}

ProductsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;