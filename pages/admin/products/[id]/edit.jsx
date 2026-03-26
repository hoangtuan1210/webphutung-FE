"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import {
  FiArrowLeft, FiChevronRight, FiSave,
  FiPackage, FiTag, FiTruck, FiImage,
  FiUploadCloud, FiX, FiPlus, FiEye,
} from "react-icons/fi";
import AdminLayout from "@/layouts/AdminLayout";
import { MOCK_PRODUCTS } from "@/data/product";
import { Field, SelectField } from "@/components/admin/products/FormFields";
import {
  CATEGORIES, BRANDS, VEHICLE_TYPES, UNITS, INITIAL_FORM,
} from "@/constants/product";

// ─── CARD SX ─────────────────────────────────────────────────────────────────
const card = { bgcolor: "#fff", borderRadius: "16px", border: "1px solid #e8ecf0" };

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", fontSize: "0.875rem",
    "& fieldset":             { borderColor: "#e2e8f0" },
    "&:hover fieldset":       { borderColor: "#94a3b8" },
    "&.Mui-focused fieldset": { borderColor: "#4f67f5", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root":            { fontSize: "0.875rem" },
  "& .MuiInputLabel-root.Mui-focused":{ color: "#4f67f5" },
};

function SectionHead({ icon, title, subtitle }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, pb: 1.75, mb: 1.75, borderBottom: "1px solid #f1f5f9" }}>
      <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: "#eef2ff", color: "#4f67f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827", lineHeight: 1.2 }}>{title}</Typography>
        {subtitle && <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>{subtitle}</Typography>}
      </Box>
    </Box>
  );
}

// ─── 4-IMAGE EDITOR ──────────────────────────────────────────────────────────
const MAX_IMAGES = 4;

function ImageEditor({ images, onChange }) {
  const inputRef = useRef(null);
  const [dragIdx, setDragIdx] = useState(null);

  // images = array of { url: string, file?: File }

  const addFiles = (files) => {
    const next = Array.from(files)
      .slice(0, MAX_IMAGES - images.length)
      .map((f) => ({ url: URL.createObjectURL(f), file: f }));
    onChange([...images, ...next].slice(0, MAX_IMAGES));
  };

  const remove = (i) => onChange(images.filter((_, idx) => idx !== i));

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  // Drag-to-reorder
  const dragStart = (i) => setDragIdx(i);
  const dragOver  = (e, i) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const next = [...images];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    onChange(next);
    setDragIdx(i);
  };
  const dragEnd = () => setDragIdx(null);

  return (
    <Box>
      {/* 4-slot grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5, mb: 2 }}>
        {Array.from({ length: MAX_IMAGES }).map((_, i) => {
          const img = images[i];
          return (
            <Box
              key={i}
              draggable={!!img}
              onDragStart={() => dragStart(i)}
              onDragOver={(e) => dragOver(e, i)}
              onDragEnd={dragEnd}
              sx={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: "12px",
                border: img
                  ? i === 0 ? "2px solid #4f67f5" : "1px solid #e8ecf0"
                  : "2px dashed #e8ecf0",
                bgcolor: img ? "#f8fafc" : "#fafafa",
                overflow: "hidden",
                cursor: img ? "grab" : "pointer",
                transition: "border-color 0.15s, opacity 0.15s",
                opacity: dragIdx === i ? 0.5 : 1,
                "&:hover .slot-overlay": { opacity: 1 },
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onClick={!img ? () => inputRef.current?.click() : undefined}
            >
              {img ? (
                <>
                  <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />

                  {/* Main badge */}
                  {i === 0 && (
                    <Box sx={{ position: "absolute", top: 6, left: 6, bgcolor: "#4f67f5", color: "#fff", fontSize: "0.58rem", fontWeight: 800, px: 0.75, py: 0.25, borderRadius: "4px", letterSpacing: "0.04em" }}>
                      ẢNH CHÍNH
                    </Box>
                  )}

                  {/* Hover overlay */}
                  <Box className="slot-overlay" sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.38)", opacity: 0, transition: "opacity 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); remove(i); }}
                      sx={{ bgcolor: "rgba(255,255,255,0.9)", color: "#ef4444", p: 0.6, "&:hover": { bgcolor: "#fff" } }}
                    >
                      <FiX size={14} />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: "center", px: 1 }}>
                  <FiPlus size={20} color="#d1d5db" />
                  <Typography sx={{ fontSize: "0.68rem", color: "#9ca3af", mt: 0.5, lineHeight: 1.3 }}>
                    {i === 0 ? "Ảnh chính" : `Ảnh ${i + 1}`}
                  </Typography>
                </Box>
              )}

              {/* Slot number */}
              <Box sx={{ position: "absolute", bottom: 5, right: 6, fontSize: "0.6rem", color: i === 0 ? "#4f67f5" : "#c4c9d4", fontWeight: 700 }}>
                {i + 1}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Drop zone (shown when < MAX_IMAGES) */}
      {images.length < MAX_IMAGES && (
        <Box
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          sx={{
            border: "2px dashed #e8ecf0", borderRadius: "10px", p: 2.5,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 0.75,
            cursor: "pointer", bgcolor: "#fafafa",
            "&:hover": { borderColor: "#4f67f5", bgcolor: "#eef2ff" },
            transition: "all 0.15s",
          }}
        >
          <FiUploadCloud size={24} color="#9ca3af" />
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 500 }}>
            Kéo thả hoặc <Box component="span" sx={{ color: "#4f67f5", fontWeight: 700 }}>chọn ảnh</Box>
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
            PNG, JPG, WEBP · Còn {MAX_IMAGES - images.length} slot
          </Typography>
        </Box>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />

      <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mt: 1.25, textAlign: "center" }}>
        Kéo ảnh để sắp xếp lại · Ảnh ô số 1 là ảnh chính
      </Typography>
    </Box>
  );
}

// ─── TAG INPUT ────────────────────────────────────────────────────────────────
function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  };
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          size="small"
          fullWidth
          sx={fieldSx}
        />
        <Button onClick={add} variant="outlined" size="small"
          sx={{ borderRadius: "8px", borderColor: "#e2e8f0", color: "#374151", minWidth: 40, px: 1.5, "&:hover": { borderColor: "#4f67f5", color: "#4f67f5", bgcolor: "#eef2ff" } }}>
          <FiPlus size={16} />
        </Button>
      </Box>
      {tags.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.25 }}>
          {tags.map((t) => (
            <Chip key={t} label={t} size="small" onDelete={() => onChange(tags.filter((x) => x !== t))}
              sx={{ bgcolor: "#eef2ff", color: "#4f46e5", fontWeight: 500, fontSize: "0.78rem", border: "1px solid #c7d2fe", "& .MuiChip-deleteIcon": { color: "#818cf8", "&:hover": { color: "#4f46e5" } } }} />
          ))}
        </Box>
      )}
    </Box>
  );
}

// ─── TOGGLE ROW ───────────────────────────────────────────────────────────────
function ToggleRow({ label, sub, checked, onChange, last }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.25, borderBottom: last ? "none" : "1px solid #f8fafc" }}>
      <Box>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>{label}</Typography>
        <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>{sub}</Typography>
      </Box>
      <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} size="small"
        sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#4f67f5" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#4f67f5" } }} />
    </Box>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [form,       setFormState] = useState(INITIAL_FORM);
  const [images,     setImages]    = useState([]); // [{ url, file? }]
  const [tags,       setTags]      = useState([]);
  const [compatible, setCompat]    = useState([]);
  const [isActive,   setIsActive]  = useState(true);
  const [isFeatured, setFeatured]  = useState(false);
  const [errors,     setErrors]    = useState({});
  const [notFound,   setNotFound]  = useState(false);

  useEffect(() => {
    if (!id) return;
    const p = MOCK_PRODUCTS?.find((x) => x.id === Number(id));
    if (!p) { setNotFound(true); return; }

    setFormState({
      ...INITIAL_FORM,
      name:         p.name        ?? "",
      sku:          p.sku         ?? "",
      barcode:      p.barcode     ?? "",
      brand:        p.brand       ?? "",
      category:     p.category    ?? "",
      vehicleType:  p.vehicleType ?? "",
      unit:         p.unit        ?? "Cái",
      description:  p.desc        ?? "",
      price:        p.price       ?? "",
      comparePrice: p.oldPrice    ?? "",
      costPrice:    p.costPrice   ?? "",
      stock:        p.stock       ?? "",
      minStock:     p.minStock    ?? "",
      weight:       p.weight      ?? "",
      length:       p.dimensions?.length ?? "",
      width:        p.dimensions?.width  ?? "",
      height:       p.dimensions?.height ?? "",
      origin:       p.origin      ?? "",
      warranty:     p.warranty    ?? "",
    });

    setImages((p.images ?? []).slice(0, 4).map((url) => ({ url })));
    setTags(p.tags ?? []);
    setCompat(p.compatible ?? []);
    setIsActive(p.isActive !== false);
    setFeatured(!!p.isFeatured);
  }, [id]);

  const setField = (key) => (e) =>
    setFormState((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name     = "Tên không được để trống";
    if (!form.category)     e.category = "Vui lòng chọn danh mục";
    if (!form.price)        e.price    = "Vui lòng nhập giá";
    if (form.stock === "")  e.stock    = "Vui lòng nhập tồn kho";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Save:", { form, images, tags, compatible, isActive, isFeatured });
    router.push(`/admin/products/${id}`);
  };

  const f  = (key) => ({ name: key, value: form[key], onChange: setField(key), error: errors[key] });
  const sf = (key) => ({ name: key, value: form[key], onChange: setField(key), error: errors[key] });

  const profit = form.price && form.costPrice
    ? { amount: Number(form.price) - Number(form.costPrice), pct: Math.round(((Number(form.price) - Number(form.costPrice)) / Number(form.price)) * 100) }
    : null;

  if (!id) return <Box sx={{ p: 4 }}><Typography sx={{ color: "#9ca3af" }}>Đang tải...</Typography></Box>;

  if (notFound) return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography sx={{ mb: 2 }}>Không tìm thấy sản phẩm.</Typography>
      <Button component={Link} href="/admin/products" variant="outlined" sx={{ borderRadius: "8px", textTransform: "none" }}>Quay lại</Button>
    </Box>
  );

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <IconButton
              component={Link} href={`/admin/products/${id}`} size="small"
              sx={{ border: "1px solid #e8ecf0", borderRadius: "8px", p: 0.6, color: "#374151", "&:hover": { bgcolor: "#f8fafc" } }}
            >
              <FiArrowLeft size={16} />
            </IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: "#111827" }}>Chỉnh sửa sản phẩm</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pl: 0.5 }}>
            {[{ label: "Home", href: "/admin" }, { label: "Sản phẩm", href: "/admin/products" }, { label: "Chi tiết", href: `/admin/products/${id}` }].map(({ label, href }) => (
              <Box key={href} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography component={Link} href={href} sx={{ fontSize: "0.78rem", color: "#6b7280", textDecoration: "none", "&:hover": { color: "#4f67f5" } }}>{label}</Typography>
                <FiChevronRight size={12} color="#9ca3af" />
              </Box>
            ))}
            <Typography sx={{ fontSize: "0.78rem", color: "#111827", fontWeight: 500 }}>Chỉnh sửa</Typography>
          </Box>
        </Box>

        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1.25 }}>
          <Button
            component={Link} href={`/admin/products/${id}`}
            variant="outlined" startIcon={<FiEye size={14} />}
            sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.85rem", borderColor: "#e8ecf0", color: "#374151", "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" }, px: 2 }}>
            Xem chi tiết
          </Button>
          <Button type="submit" variant="contained" startIcon={<FiSave size={14} />}
            sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.85rem", fontWeight: 600, bgcolor: "#4f67f5", boxShadow: "0 2px 8px rgba(79,103,245,0.3)", "&:hover": { bgcolor: "#3d55e0" }, px: 2.25 }}>
            Lưu thay đổi
          </Button>
        </Box>
      </Box>

      {/* ── 2-column grid ──────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "3fr 2fr" }, gap: "20px", "& > *": { minWidth: 0 } }}>

        {/* ═══ CỘT TRÁI ═══ */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Thông tin cơ bản */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiPackage size={15} />} title="Thông tin cơ bản" subtitle="Tên, mô tả và phân loại" />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Tên sản phẩm" value={form.name} onChange={setField("name")} required fullWidth size="small" sx={fieldSx}
                  error={!!errors.name} helperText={errors.name ?? "VD: Lốp xe Michelin Pilot Street 2 90/80-17"} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Mô tả sản phẩm" value={form.description} onChange={setField("description")} multiline rows={4} fullWidth size="small" sx={fieldSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectField {...sf("category")} label="Danh mục" options={CATEGORIES} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectField {...sf("vehicleType")} label="Loại xe phù hợp" options={VEHICLE_TYPES} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectField {...sf("brand")} label="Thương hiệu" options={BRANDS} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectField {...sf("unit")} label="Đơn vị tính" options={UNITS} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Mã SKU" value={form.sku} onChange={setField("sku")} fullWidth size="small" sx={fieldSx} helperText="VD: LX-MC-001" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Barcode / EAN" value={form.barcode} onChange={setField("barcode")} fullWidth size="small" sx={fieldSx} />
              </Grid>
            </Grid>
          </Box>

          {/* Giá */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiTag size={15} />} title="Thông tin giá" subtitle="Giá bán, giá gốc và giá nhập" />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField label="Giá bán" type="number" value={form.price} onChange={setField("price")} required fullWidth size="small" sx={fieldSx}
                  error={!!errors.price} helperText={errors.price}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>₫</Typography></InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Giá so sánh" type="number" value={form.comparePrice} onChange={setField("comparePrice")} fullWidth size="small" sx={fieldSx}
                  helperText="Giá cũ / gạch ngang"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>₫</Typography></InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Giá nhập" type="number" value={form.costPrice} onChange={setField("costPrice")} fullWidth size="small" sx={fieldSx}
                  helperText="Không hiển thị ra ngoài"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>₫</Typography></InputAdornment> }} />
              </Grid>

              {profit && (
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 3, bgcolor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", px: 2, py: 1.25, flexWrap: "wrap" }}>
                    {[{ label: "Lợi nhuận / SP", value: `${profit.amount.toLocaleString("vi-VN")}₫` }, { label: "Biên LN", value: `${profit.pct}%` }].map(({ label, value }) => (
                      <Box key={label}>
                        <Typography sx={{ fontSize: "0.68rem", color: "#16a34a", fontWeight: 700, textTransform: "uppercase" }}>{label}</Typography>
                        <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "#15803d" }}>{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Kho + vận chuyển */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiTruck size={15} />} title="Kho hàng & Vận chuyển" subtitle="SKU, tồn kho, kích thước" />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Tồn kho" type="number" value={form.stock} onChange={setField("stock")} required fullWidth size="small" sx={fieldSx}
                  error={!!errors.stock} helperText={errors.stock} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Tồn kho tối thiểu" type="number" value={form.minStock} onChange={setField("minStock")} fullWidth size="small" sx={fieldSx}
                  helperText="Cảnh báo khi dưới mức này" />
              </Grid>
              <Grid item xs={12}><Divider sx={{ borderColor: "#f1f5f9" }} /></Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Khối lượng" type="number" value={form.weight} onChange={setField("weight")} fullWidth size="small" sx={fieldSx}
                  InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {[{ label: "Dài", key: "length" }, { label: "Rộng", key: "width" }, { label: "Cao", key: "height" }].map((d) => (
                    <TextField key={d.key} label={d.label} type="number" value={form[d.key]} onChange={setField(d.key)} size="small" sx={{ ...fieldSx, flex: 1 }}
                      InputProps={{ endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>cm</Typography></InputAdornment> }} />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Xuất xứ" value={form.origin} onChange={setField("origin")} fullWidth size="small" sx={fieldSx} helperText="VD: Nhật Bản, Việt Nam" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Bảo hành" value={form.warranty} onChange={setField("warranty")} fullWidth size="small" sx={fieldSx} helperText="VD: 12 tháng" />
              </Grid>
            </Grid>
          </Box>

        </Box>

        {/* ═══ CỘT PHẢI ═══ */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Hình ảnh — 4 slots */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiImage size={15} />} title="Hình ảnh sản phẩm" subtitle="Tối đa 4 ảnh · Ô số 1 là ảnh chính" />
            <ImageEditor images={images} onChange={setImages} />
          </Box>

          {/* Trạng thái */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiTag size={15} />} title="Xuất bản" />
            <ToggleRow label="Hiển thị sản phẩm" sub="Khách hàng có thể thấy" checked={isActive}   onChange={setIsActive}  />
            <ToggleRow label="Sản phẩm nổi bật"   sub="Xuất hiện ở trang chủ"  checked={isFeatured} onChange={setFeatured}  last />
          </Box>

          {/* Tags */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiTag size={15} />} title="Tags / Từ khoá" subtitle="Nhấn Enter để thêm" />
            <TagInput tags={tags} onChange={setTags} placeholder='VD: "bền", "cao cấp"' />
          </Box>

          {/* Xe tương thích */}
          <Box sx={{ ...card, p: 2.5 }}>
            <SectionHead icon={<FiTruck size={15} />} title="Xe tương thích" subtitle="Liệt kê dòng xe phù hợp" />
            <TagInput tags={compatible} onChange={setCompat} placeholder='VD: "Wave Alpha 110", "SH 150i"' />
          </Box>

        </Box>
      </Box>

      {/* Mobile sticky bar */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, position: "sticky", bottom: 0, bgcolor: "#fff", borderTop: "1px solid #e8ecf0", px: 2, py: 1.5, gap: 1.5, mt: 3, zIndex: 10, boxShadow: "0 -4px 16px rgba(0,0,0,0.06)" }}>
        <Button component={Link} href={`/admin/products/${id}`} fullWidth variant="outlined"
          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 500, borderColor: "#e8ecf0", color: "#374151", py: 1.1 }}>
          Huỷ
        </Button>
        <Button type="submit" fullWidth variant="contained" startIcon={<FiSave size={14} />}
          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, bgcolor: "#4f67f5", "&:hover": { bgcolor: "#3d55e0" }, py: 1.1 }}>
          Lưu thay đổi
        </Button>
      </Box>
    </Box>
  );
}

EditProductPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;