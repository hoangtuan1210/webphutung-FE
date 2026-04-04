"use client";
import { useState, useMemo, useCallback, memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2,
  FiEye, FiFilter, FiFileText,
  FiCheckCircle, FiClock, FiEyeOff,
  FiMoreHorizontal, FiArrowUp, FiArrowDown, FiDownload
} from "react-icons/fi";
import AdminLayout from "@/layouts/AdminLayout";
import Pagination from "../../../components/admin/Pagination";
import StatusChip from "../../../components/admin/news/StatusChip";
import DeleteDialog from "../../../components/admin/news/DeleteDialog";
import { MOCK_NEWS, categories as NEWS_CATEGORIES, statusList as STATUS_LIST } from "@/data/news";
import { useRouter } from "next/router";

const PAGE_SIZE = 8;

const STAT_CARDS = (stats) => [
  { label: "Tổng bài viết", value: stats.total, color: "#3641f5", bg: "#eef2ff", icon: <FiFileText size={18} /> },
  { label: "Đã đăng", value: stats.published, color: "#059669", bg: "#d1fae5", icon: <FiCheckCircle size={18} /> },
  { label: "Bản nháp", value: stats.draft, color: "#d97706", bg: "#fef3c7", icon: <FiClock size={18} /> },
  { label: "Đang ẩn", value: stats.hidden, color: "#6b7280", bg: "#f3f4f6", icon: <FiEyeOff size={18} /> },
];

const SortHeader = memo(({ label, sortKey, currentSort, onSort }) => {
  const active = currentSort?.key === sortKey;
  const asc = currentSort?.dir === "asc";
  return (
    <Box
      onClick={() => onSort(sortKey)}
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer", userSelect: "none", "&:hover": { color: "#111827" } }}
    >
      {label}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1px", opacity: active ? 1 : 0.35 }}>
        <FiArrowUp size={8} color={active && asc ? "#4f67f5" : "#9ca3af"} />
        <FiArrowDown size={8} color={active && !asc ? "#4f67f5" : "#9ca3af"} />
      </Box>
    </Box>
  );
});

const RowMenu = memo(({ id, onEdit, onDelete }) => {
  const [anchor, setAnchor] = useState(null);
  const handleEdit = useCallback(() => { setAnchor(null); onEdit(id); }, [id, onEdit]);
  const handleDelete = useCallback(() => { setAnchor(null); onDelete(id); }, [id, onDelete]);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ color: "#9ca3af", borderRadius: "6px", "&:hover": { bgcolor: "#f1f5f9", color: "#374151" } }}>
        <FiMoreHorizontal size={16} />
      </IconButton>
      <Menu
        anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        PaperProps={{ elevation: 0, sx: { border: "1px solid #e8ecf0", borderRadius: "10px", minWidth: 150 } }}
      >
        <MenuItem onClick={handleEdit} sx={{ fontSize: "0.82rem", gap: 1.25, py: 1, px: 1.75 }}> <FiEdit2 size={14} /> Chỉnh sửa </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontSize: "0.82rem", color: "#ef4444", gap: 1.25, py: 1, px: 1.75 }}> <FiTrash2 size={14} /> Xoá </MenuItem>
      </Menu>
    </>
  );
});

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState(MOCK_NEWS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tất cả");
  const [stFilter, setStFilter] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState(null);

  const handleSort = useCallback((key) => {
    setSort((prev) => prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  }, []);

  const filtered = useMemo(() => {
    let list = news.filter((n) => {
      const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "Tất cả" || n.category === catFilter;
      const matchSt = stFilter === "Tất cả" || n.status === stFilter;
      return matchSearch && matchCat && matchSt;
    });
    if (sort) {
      list = [...list].sort((a, b) => {
        const va = a[sort.key], vb = b[sort.key];
        const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [news, search, catFilter, stFilter, sort]);

  const totalPages = useMemo(() => Math.ceil(filtered.length / pageSize), [filtered.length, pageSize]);
  const safePage = useMemo(() => Math.min(page, Math.max(1, totalPages)), [page, totalPages]);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * pageSize, safePage * pageSize), [filtered, safePage, pageSize]);

  const stats = useMemo(() => ({
    total: news.length,
    published: news.filter((n) => n.status === "Đã đăng").length,
    draft: news.filter((n) => n.status === "Nháp").length,
    hidden: news.filter((n) => n.status === "Ẩn").length,
  }), [news]);

  const allChecked = useMemo(() => paginated.length > 0 && paginated.every((r) => selected.includes(r.id)), [paginated, selected]);
  const someChecked = useMemo(() => paginated.some((r) => selected.includes(r.id)), [paginated, selected]);
  const toggleAll = useCallback(() => setSelected(allChecked ? [] : paginated.map((r) => r.id)), [allChecked, paginated]);
  const toggleRow = useCallback((id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]), []);

  return (
    <Box>
      {/* ── Header ── */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", color: "#111827", lineHeight: 1.2 }}>Quản lý tin tức</Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#9ca3af", mt: 0.4 }}>Đăng tải và cập nhật các tin tức mới nhất của cửa hàng</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.25 }}>
          <Button variant="outlined" startIcon={<FiDownload size={15} />} sx={{ borderRadius: "10px", textTransform: "none", fontSize: "0.85rem", fontWeight: 500, borderColor: "#e8ecf0", color: "#374151" }}>
            Xuất File
          </Button>
          <Button variant="contained" startIcon={<FiPlus size={15} />} onClick={() => router.push("/admin/news/add")} sx={{ borderRadius: "10px", textTransform: "none", fontSize: "0.85rem", fontWeight: 600, bgcolor: "#4f67f5" }}>
            Thêm bài viết
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        {STAT_CARDS(stats).map((c) => (
          <Box key={c.label} sx={{ p: 2.5, bgcolor: "#fff", borderRadius: "16px", border: "1px solid #e8ecf0", display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 42, height: 42, bgcolor: c.bg, color: c.color, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {c.icon}
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>{c.label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>{c.value}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ bgcolor: "#fff", borderRadius: "16px", border: "1px solid #e8ecf0", overflow: "hidden" }}>
        <Box sx={{ p: 2.5, display: "flex", gap: 2, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: "1px solid #e8ecf0", borderRadius: "10px", px: 1.5, py: 0.75, width: 280 }}>
            <FiSearch color="#9ca3af" />
            <InputBase placeholder="Tìm kiếm bài viết..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ fontSize: "0.85rem", flex: 1 }} />
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <SelectSmall label="Danh mục" value={catFilter} options={NEWS_CATEGORIES} onChange={setCatFilter} />
            <SelectSmall label="Trạng thái" value={stFilter} options={STATUS_LIST} onChange={setStFilter} />
            <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af", ml: 1 }}>{filtered.length} kết quả</Typography>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { bgcolor: "#f8fafc", color: "#6b7280", fontSize: "0.75rem", fontWeight: 600, borderBottom: "1px solid #f1f5f9" } }}>
                <TableCell sx={{ pl: 2.5, width: 44 }}>
                  <Checkbox size="small" sx={{ p: 0 }} checked={allChecked} indeterminate={someChecked && !allChecked} onChange={toggleAll} />
                </TableCell>
                <TableCell><SortHeader label="BÀI VIẾT" sortKey="title" currentSort={sort} onSort={handleSort} /></TableCell>
                <TableCell><SortHeader label="DANH MỤC" sortKey="category" currentSort={sort} onSort={handleSort} /></TableCell>
                <TableCell><SortHeader label="TRẠNG THÁI" sortKey="status" currentSort={sort} onSort={handleSort} /></TableCell>
                <TableCell align="right"><SortHeader label="LƯỢT XEM" sortKey="views" currentSort={sort} onSort={handleSort} /></TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((row) => (
                <TableRow key={row.id} hover sx={{ "& td": { py: 2 } }}>
                  <TableCell sx={{ pl: 2.5 }}>
                    <Checkbox size="small" sx={{ p: 0 }} checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: "8px", overflow: "hidden", border: "1px solid #f1f5f9", flexShrink: 0 }}>
                        <img src={row.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>{row.title}</Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>{row.date} · {row.author}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem" }}>{row.category}</TableCell>
                  <TableCell><StatusChip status={row.status} /></TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>{row.views?.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <RowMenu id={row.id} onEdit={(id) => router.push(`/admin/news/${id}/edit`)} onDelete={setDeleteTarget} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination currentPage={safePage} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />
      </Box>

      <DeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { setNews(p => p.filter(x => x.id !== deleteTarget)); setDeleteTarget(null); }} />
    </Box>
  );
}

function SelectSmall({ label, value, options, onChange }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <Button size="small" onClick={(e) => setAnchor(e.currentTarget)} startIcon={<FiFilter size={13} />} sx={{ border: "1px solid #e8ecf0", borderRadius: "10px", color: "#374151", px: 1.5, textTransform: "none", fontSize: "0.8rem", fontWeight: 500, height: 36 }}>
        {label}: {value}
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} PaperProps={{ elevation: 0, sx: { border: "1px solid #e8ecf0", borderRadius: "10px", mt: 0.5, minWidth: 140 } }}>
        {options.map(o => (
          <MenuItem key={o} onClick={() => { onChange(o); setAnchor(null); }} sx={{ fontSize: "0.82rem", py: 1 }}>{o}</MenuItem>
        ))}
      </Menu>
    </>
  );
}

NewsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;