"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import {
  FiArrowLeft, FiEdit2, FiTrash2, FiChevronRight,
  FiPackage, FiTag, FiTruck, FiAlertTriangle,
  FiCheckCircle, FiXCircle, FiStar, FiShare2, FiImage,
} from "react-icons/fi";
import AdminLayout from "@/layouts/AdminLayout";
import { MOCK_PRODUCTS } from "@/data/product";

const fmtVND = (n) => Number(n).toLocaleString("vi-VN") + "₫";

// ─── SHARED ───────────────────────────────────────────────────────────────────
const card = { bgcolor: "#fff", borderRadius: "16px", border: "1px solid #e8ecf0" };

function SectionHead({ icon, title }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, pb: 1.75, mb: 1.75, borderBottom: "1px solid #f1f5f9" }}>
      <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: "#eef2ff", color: "#4f67f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>{title}</Typography>
    </Box>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1, borderBottom: "1px solid #f8fafc", "&:last-child": { borderBottom: "none" } }}>
      <Typography sx={{ fontSize: "0.82rem", color: "#9ca3af", flexShrink: 0, mr: 2 }}>{label}</Typography>
      <Typography sx={{ fontSize: "0.82rem", color: "#111827", fontWeight: 500, fontFamily: mono ? "monospace" : "inherit", textAlign: "right" }}>
        {value ?? "—"}
      </Typography>
    </Box>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const router   = useRouter();
  const { id }   = router.query;
  const [imgIdx, setImgIdx] = useState(0);

  const p = MOCK_PRODUCTS?.find((x) => x.id === Number(id));

  // Loading / not found
  if (!id) return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography sx={{ color: "#9ca3af" }}>Đang tải...</Typography>
    </Box>
  );

  if (!p) return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography sx={{ fontSize: "1rem", color: "#6b7280", mb: 2 }}>Không tìm thấy sản phẩm.</Typography>
      <Button component={Link} href="/admin/products" variant="outlined" sx={{ borderRadius: "8px", textTransform: "none" }}>
        Quay lại danh sách
      </Button>
    </Box>
  );

  const images      = p.images?.length ? p.images : [null];
  const discountPct = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  const profitPct   = p.costPrice ? Math.round(((p.price - p.costPrice) / p.price) * 100) : null;

  return (
    <Box sx={{ width: "100%" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <IconButton
              component={Link} href="/admin/products" size="small"
              sx={{ border: "1px solid #e8ecf0", borderRadius: "8px", p: 0.6, color: "#374151", "&:hover": { bgcolor: "#f8fafc" } }}
            >
              <FiArrowLeft size={16} />
            </IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: "#111827" }}>Chi tiết sản phẩm</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pl: 0.5 }}>
            {[{ label: "Home", href: "/admin" }, { label: "Sản phẩm", href: "/admin/products" }].map(({ label, href }) => (
              <Box key={href} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography component={Link} href={href} sx={{ fontSize: "0.78rem", color: "#6b7280", textDecoration: "none", "&:hover": { color: "#4f67f5" } }}>{label}</Typography>
                <FiChevronRight size={12} color="#9ca3af" />
              </Box>
            ))}
            <Typography sx={{ fontSize: "0.78rem", color: "#111827", fontWeight: 500 }}>Chi tiết</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.25 }}>
          <Button variant="outlined" startIcon={<FiTrash2 size={14} />}
            sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.85rem", borderColor: "#fecaca", color: "#ef4444", "&:hover": { borderColor: "#ef4444", bgcolor: "#fef2f2" }, px: 2 }}>
            Xoá
          </Button>
          <Button
            component={Link} href={`/admin/products/${id}/edit`}
            variant="contained" startIcon={<FiEdit2 size={14} />}
            sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.85rem", fontWeight: 600, bgcolor: "#4f67f5", boxShadow: "0 2px 8px rgba(79,103,245,0.3)", "&:hover": { bgcolor: "#3d55e0" }, px: 2.25 }}
          >
            Chỉnh sửa
          </Button>
        </Box>
      </Box>

      {/* ── 2-column layout ────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: "20px", "& > *": { minWidth: 0 } }}>

        {/* ═══ CỘT TRÁI ═══ */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Gallery */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiImage size={15} />} title="Hình ảnh sản phẩm" />

            {/* Main image */}
            <Box sx={{ aspectRatio: "4/3", borderRadius: "12px", overflow: "hidden", bgcolor: "#f8fafc", border: "1px solid #e8ecf0", mb: 1.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {images[imgIdx] ? (
                <img src={images[imgIdx]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <FiPackage size={56} color="#d1d5db" />
              )}
            </Box>

            {/* Thumbnails */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {images.map((img, i) => (
                <Box key={i} onClick={() => setImgIdx(i)}
                  sx={{ width: 64, height: 64, borderRadius: "10px", overflow: "hidden", cursor: "pointer", border: imgIdx === i ? "2px solid #4f67f5" : "1px solid #e8ecf0", bgcolor: "#f8fafc", flexShrink: 0, transition: "border 0.15s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <FiPackage size={20} color="#d1d5db" />}
                  {i === 0 && (
                    <Box sx={{ position: "absolute", bottom: 2, left: 2, bgcolor: "#4f67f5", color: "#fff", fontSize: "0.5rem", fontWeight: 700, px: 0.5, py: 0.15, borderRadius: "3px", lineHeight: 1.4 }}>
                      Chính
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Mô tả */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiPackage size={15} />} title="Mô tả sản phẩm" />
            <Typography sx={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.8, mb: p.descDetails?.length ? 2 : 0 }}>
              {p.desc || "Chưa có mô tả."}
            </Typography>

            {p.descDetails?.length > 0 && (
              <Box component="ul" sx={{ m: 0, pl: 2.5, "& li": { fontSize: "0.85rem", color: "#374151", mb: 0.5, lineHeight: 1.7 } }}>
                {p.descDetails.map((d, i) => <li key={i}>{d}</li>)}
              </Box>
            )}

            {p.tags?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", mb: 1 }}>Tags</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {p.tags.map((t) => (
                    <Chip key={t} label={t} size="small" sx={{ bgcolor: "#eef2ff", color: "#4f46e5", fontWeight: 500, fontSize: "0.78rem", border: "1px solid #c7d2fe", height: 26 }} />
                  ))}
                </Box>
              </Box>
            )}

            {p.compatible?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", mb: 1 }}>Xe tương thích</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {p.compatible.map((t) => (
                    <Chip key={t} label={t} size="small" sx={{ bgcolor: "#f8fafc", color: "#374151", fontWeight: 500, fontSize: "0.78rem", border: "1px solid #e8ecf0", height: 26 }} />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Thông số kỹ thuật */}
          {p.specs?.length > 0 && (
            <Box sx={{ ...card, p: 2.5 }}>
              <SectionHead icon={<FiTag size={15} />} title="Thông số kỹ thuật" />
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", bgcolor: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                {p.specs.map((s, i) => (
                  <Box key={i} sx={{ bgcolor: "#fff", p: 1.5, borderBottom: "1px solid #f8fafc" }}>
                    <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.25 }}>{s.label}</Typography>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>{s.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

        </Box>

        {/* ═══ CỘT PHẢI ═══ */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Thông tin cơ bản */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiTag size={15} />} title="Thông tin sản phẩm" />

            {/* Status badges */}
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.25, py: 0.4, borderRadius: "6px", bgcolor: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", fontSize: "0.75rem", fontWeight: 600 }}>
                <FiCheckCircle size={12} /> {p.status ?? "Còn hàng"}
              </Box>
              {p.badge && (
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.25, py: 0.4, borderRadius: "6px", bgcolor: "#fffbeb", border: "1px solid #fde68a", color: "#d97706", fontSize: "0.75rem", fontWeight: 600 }}>
                  <FiStar size={12} /> {p.badge}
                </Box>
              )}
            </Box>

            <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "#111827", lineHeight: 1.5, mb: 2 }}>{p.name}</Typography>

            <InfoRow label="SKU"         value={p.sku}       mono />
            <InfoRow label="Thương hiệu" value={p.brand}          />
            <InfoRow label="Danh mục"    value={p.category}       />
            <InfoRow label="Loại xe"     value={p.vehicleType}    />
            <InfoRow label="Đơn vị"      value={p.unit}           />
          </Box>

          {/* Giá */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiTag size={15} />} title="Thông tin giá" />

            <Box sx={{ bgcolor: "#f8fafc", borderRadius: "12px", p: 2, mb: 2 }}>
              <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af", mb: 0.5 }}>Giá bán</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                  {fmtVND(p.price)}
                </Typography>
                {discountPct > 0 && (
                  <Box sx={{ px: 0.9, py: 0.25, bgcolor: "#fee2e2", borderRadius: "5px", fontSize: "0.72rem", fontWeight: 700, color: "#dc2626" }}>
                    -{discountPct}%
                  </Box>
                )}
              </Box>
              {p.oldPrice && (
                <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af", textDecoration: "line-through", mt: 0.4 }}>
                  {fmtVND(p.oldPrice)}
                </Typography>
              )}
            </Box>

            {p.costPrice && <InfoRow label="Giá nhập" value={fmtVND(p.costPrice)} />}

            {profitPct !== null && (
              <Box sx={{ mt: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                  <Typography sx={{ fontSize: "0.78rem", color: "#6b7280" }}>Biên lợi nhuận</Typography>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#16a34a" }}>
                    {fmtVND(p.price - p.costPrice)} ({profitPct}%)
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={profitPct}
                  sx={{ height: 6, borderRadius: 3, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { borderRadius: 3, bgcolor: "#4f67f5" } }} />
              </Box>
            )}
          </Box>

          {/* Tồn kho */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiTruck size={15} />} title="Tồn kho" />
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>Hiện có</Typography>
                <Typography sx={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.1, color: p.stock <= (p.minStock ?? 10) ? "#d97706" : "#111827" }}>
                  {p.stock}
                  <Box component="span" sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#9ca3af", ml: 0.75 }}>{p.unit ?? "Cái"}</Box>
                </Typography>
              </Box>
              {p.minStock && (
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>Tối thiểu</Typography>
                  <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#374151" }}>{p.minStock}</Typography>
                </Box>
              )}
            </Box>

            <LinearProgress variant="determinate" value={Math.min((p.stock / 100) * 100, 100)}
              sx={{ height: 7, borderRadius: 3, mb: 1, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { borderRadius: 3, bgcolor: p.stock <= (p.minStock ?? 10) ? "#f59e0b" : "#4f67f5" } }} />

            {p.stock <= (p.minStock ?? 10) && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", px: 1.5, py: 1, mt: 1 }}>
                <FiAlertTriangle size={13} color="#d97706" />
                <Typography sx={{ fontSize: "0.75rem", color: "#92400e", fontWeight: 500 }}>Tồn kho dưới mức tối thiểu</Typography>
              </Box>
            )}
          </Box>

          {/* Vận chuyển */}
          {(p.weight || p.dimensions || p.origin || p.warranty) && (
            <Box sx={{ ...card, p: 2.5 }}>
              <SectionHead icon={<FiTruck size={15} />} title="Vận chuyển & Kích thước" />
              {p.weight     && <InfoRow label="Khối lượng" value={`${p.weight} kg`} />}
              {p.dimensions && <InfoRow label="Kích thước" value={`${p.dimensions.length} × ${p.dimensions.width} × ${p.dimensions.height} cm`} />}
              {p.origin     && <InfoRow label="Xuất xứ"    value={p.origin} />}
              {p.warranty   && <InfoRow label="Bảo hành"   value={p.warranty} />}
            </Box>
          )}

          {/* Trạng thái xuất bản */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiShare2 size={15} />} title="Trạng thái xuất bản" />
            {[
              { label: "Hiển thị trên website", sub: "Khách hàng có thể thấy sản phẩm", value: p.isActive !== false },
              { label: "Sản phẩm nổi bật",       sub: "Hiển thị ở trang chủ & đề xuất", value: !!p.isFeatured      },
            ].map(({ label, sub, value }) => (
              <Box key={label} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.25, "&:not(:last-child)": { borderBottom: "1px solid #f8fafc" } }}>
                <Box>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>{label}</Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>{sub}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  {value ? <FiCheckCircle size={15} color="#16a34a" /> : <FiXCircle size={15} color="#9ca3af" />}
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: value ? "#16a34a" : "#9ca3af" }}>
                    {value ? "Bật" : "Tắt"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

ProductDetailPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;