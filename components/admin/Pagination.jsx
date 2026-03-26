import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PageBtn = ({ label, active, disabled, onClick, icon }) => (
  <IconButton
    size="small"
    disabled={disabled}
    onClick={onClick}
    sx={{
      border: active ? "1px solid var(--color-pagination-active)" : "1px solid var(--color-pagination-border)",
      borderRadius: "7px",
      minWidth: 32,
      height: 32,
      px: 0.5,
      bgcolor: active ? "var(--color-pagination-active)" : "transparent",
      color: active ? "#fff" : "var(--color-pagination-inactive)",
      fontWeight: active ? 700 : 400,
      fontSize: "0.82rem",
      "&:disabled": { opacity: 0.35 },
      "&:hover:not(:disabled)": { bgcolor: active ? "var(--color-pagination-active-hover)" : "var(--color-pagination-inactive-hover)" },
    }}
  >
    {icon ?? label}
  </IconButton>
);

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions = [5, 10, 20],
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showPageInfo = true,
  className = "",
  sx = {}
}) => {
  const pageNums = useMemo(() => {
    const delta = 2, range = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) range.push(i);
    return range;
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <Box
      className={className}
      sx={{
        px: 3,
        py: 1.75,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
        borderTop: "1px solid var(--color-admin-border-light)",
        ...sx
      }}
    >
      {showPageSizeSelector && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: "0.8rem", color: "var(--color-admin-text-muted)" }}>Hiển thị</Typography>
          <Select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            size="small"
            sx={{ fontSize: "0.8rem", height: 30, "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-admin-border)", borderRadius: "7px" } }}
          >
            {pageSizeOptions.map((n) => (
              <MenuItem key={n} value={n} sx={{ fontSize: "0.82rem" }}>{n}</MenuItem>
            ))}
          </Select>
          {showPageInfo && (
            <Typography sx={{ fontSize: "0.8rem", color: "var(--color-admin-text-light)" }}>
              hàng &nbsp;·&nbsp; Trang {currentPage}/{totalPages}
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <PageBtn icon={<FiChevronLeft size={15} />} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />

        {pageNums[0] > 1 && (
          <>
            <PageBtn label={1} onClick={() => handlePageChange(1)} />
            {pageNums[0] > 2 && <Typography sx={{ px: 0.5, color: "#9ca3af", fontSize: "0.85rem" }}>…</Typography>}
          </>
        )}

        {pageNums.map((p) => (
          <PageBtn key={p} label={p} active={p === currentPage} onClick={() => handlePageChange(p)} />
        ))}

        {pageNums[pageNums.length - 1] < totalPages && (
          <>
            {pageNums[pageNums.length - 1] < totalPages - 1 && <Typography sx={{ px: 0.5, color: "#9ca3af", fontSize: "0.85rem" }}>…</Typography>}
            <PageBtn label={totalPages} onClick={() => handlePageChange(totalPages)} />
          </>
        )}

        <PageBtn icon={<FiChevronRight size={15} />} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
      </Box>
    </Box>
  );
};

export default Pagination;