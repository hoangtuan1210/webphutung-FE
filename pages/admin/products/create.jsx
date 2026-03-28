"use client";
import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import {
  FiChevronRight,
  FiPackage,
  FiTag,
  FiTruck,
  FiImage,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";

import {
  CATEGORIES,
  BRANDS,
  VEHICLE_TYPES,
  UNITS,
  DIMENSION_FIELDS,
} from "../../../constants/product";
import styles from "../../../styles/admin/productForm.module.css";
import CardHeader from "../../../components/admin/products/CardHeader";
import ImageUpload from "../../../components/admin/products/ImageUpload";
import TagInput from "../../../components/admin/products/TagInput";
import {
  Field,
  SelectField,
} from "../../../components/admin/products/FormFields";
import { useProductForm } from "../../../hooks/useProductForm";
import AdminLayout from "@/layouts/AdminLayout";

// ── Profit preview ────────────────────────────────────────────────────────────
function ProfitBanner({ profit }) {
  if (!profit) return null;
  return (
    <Grid item xs={12}>
      <Box
        sx={{
          bgcolor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "8px",
          px: 2,
          py: 1.25,
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        {[
          {
            label: "Lợi nhuận / sản phẩm",
            value: `${profit.amount.toLocaleString("vi-VN")}₫`,
          },
          { label: "Biên lợi nhuận", value: `${profit.margin}%` },
        ].map(({ label, value }) => (
          <Box key={label}>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#16a34a",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: 700, color: "#15803d" }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Grid>
  );
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1,
        "&:not(:last-child)": { borderBottom: "1px solid #f1f5f9" },
      }}
    >
      <Box>
        <Typography
          sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#111827" }}
        >
          {label}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
          {sub}
        </Typography>
      </Box>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        size="small"
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: "#6366f1" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            bgcolor: "#6366f1",
          },
        }}
      />
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function CreateProductPage() {
  const {
    form,
    setField,
    images,
    setImages,
    tags,
    setTags,
    compatible,
    setCompatible,
    isActive,
    setIsActive,
    isFeatured,
    setIsFeatured,
    errors,
    profit,
    handleSubmit,
  } = useProductForm();

  // Shorthand prop binders
  const f = (name) => ({
    name,
    value: form[name],
    onChange: setField(name),
    error: errors[name],
  });
  const sf = (name) => ({
    name,
    value: form[name],
    onChange: setField(name),
    error: errors[name],
  });

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <IconButton
              component={Link}
              href="/admin/products"
              size="small"
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                p: 0.6,
                color: "#374151",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              <FiArrowLeft size={16} />
            </IconButton>
            <Typography
              sx={{ fontWeight: 700, fontSize: "1.2rem", color: "#111827" }}
            >
              Thêm sản phẩm mới
            </Typography>
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, pl: 0.5 }}
          >
            {[
              { label: "Home", href: "/admin" },
              { label: "Sản phẩm", href: "/admin/products" },
            ].map(({ label, href }) => (
              <Box
                key={href}
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Typography
                  component={Link}
                  href={href}
                  sx={{
                    fontSize: "0.78rem",
                    color: "#6b7280",
                    textDecoration: "none",
                    "&:hover": { color: "#6366f1" },
                  }}
                >
                  {label}
                </Typography>
                <FiChevronRight size={12} color="#9ca3af" />
              </Box>
            ))}
            <Typography
              sx={{ fontSize: "0.78rem", color: "#111827", fontWeight: 500 }}
            >
              Thêm mới
            </Typography>
          </Box>
        </Box>

        {/* Desktop buttons */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1.5 }}>
          <Button
            component={Link}
            href="/admin/products"
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.85rem",
              fontWeight: 500,
              borderColor: "#e2e8f0",
              color: "#374151",
              "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
              px: 2,
            }}
          >
            Huỷ
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<FiSave size={15} />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              bgcolor: "#6366f1",
              boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
              "&:hover": { bgcolor: "#5254cc" },
              px: 2.5,
            }}
          >
            Lưu sản phẩm
          </Button>
        </Box>
      </Box>

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <Grid container spacing={2.5}>
        {/* LEFT ─────────────────────────────────────────────────────────── */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* 1. Thông tin cơ bản */}
            <Box className={styles.card}>
              <CardHeader
                icon={<FiPackage size={16} />}
                title="Thông tin cơ bản"
                subtitle="Tên, mô tả và danh mục sản phẩm"
              />
              <Box className={styles.cardBody}>
                <Grid container spacing={2}>
                  <Field
                    {...f("name")}
                    label="Tên sản phẩm"
                    required
                    helperText="VD: Lốp xe Michelin Pilot Street 2 90/80-17"
                  />
                  <Field
                    {...f("description")}
                    label="Mô tả sản phẩm"
                    rows={4}
                    helperText="Mô tả chi tiết tính năng, thông số, phù hợp loại xe nào"
                  />
                  <SelectField
                    {...sf("category")}
                    label="Danh mục"
                    options={CATEGORIES}
                    required
                    half
                  />
                  <SelectField
                    {...sf("vehicleType")}
                    label="Loại xe phù hợp"
                    options={VEHICLE_TYPES}
                    half
                  />
                  <SelectField
                    {...sf("brand")}
                    label="Thương hiệu"
                    options={BRANDS}
                    half
                  />
                  <SelectField
                    {...sf("unit")}
                    label="Đơn vị tính"
                    options={UNITS}
                    half
                  />
                </Grid>
              </Box>
            </Box>

            {/* 2. Giá bán */}
            <Box className={styles.card}>
              <CardHeader
                icon={<FiTag size={16} />}
                title="Thông tin giá"
                subtitle="Giá bán, giá gốc và giá nhập"
              />
              <Box className={styles.cardBody}>
                <Grid container spacing={2}>
                  <Field
                    {...f("price")}
                    label="Giá bán"
                    type="number"
                    required
                    adornment="₫"
                    half
                  />
                  <Field
                    {...f("comparePrice")}
                    label="Giá so sánh (giá gốc)"
                    type="number"
                    adornment="₫"
                    half
                    helperText="Giá cũ để hiển thị % giảm giá"
                  />
                  <Field
                    {...f("costPrice")}
                    label="Giá nhập (nội bộ)"
                    type="number"
                    adornment="₫"
                    half
                    helperText="Không hiển thị ra ngoài"
                  />
                  <ProfitBanner profit={profit} />
                </Grid>
              </Box>
            </Box>

            {/* 3. Tồn kho & Mã */}
            <Box className={styles.card}>
              <CardHeader
                icon={<FiTruck size={16} />}
                title="Tồn kho & Mã sản phẩm"
                subtitle="SKU, barcode và số lượng tồn"
              />
              <Box className={styles.cardBody}>
                <Grid container spacing={2}>
                  <Field
                    {...f("sku")}
                    label="Mã SKU"
                    half
                    helperText="VD: LX-MC-001"
                  />
                  <Field {...f("barcode")} label="Barcode / EAN" half />
                  <Field
                    {...f("stock")}
                    label="Số lượng tồn kho"
                    type="number"
                    required
                    half
                  />
                  <Field
                    {...f("minStock")}
                    label="Tồn kho tối thiểu"
                    type="number"
                    half
                    helperText="Cảnh báo khi tồn kho dưới mức này"
                  />
                </Grid>
              </Box>
            </Box>

            {/* 4. Vận chuyển */}
            <Box className={styles.card}>
              <CardHeader
                icon={<FiTruck size={16} />}
                title="Vận chuyển & Kích thước"
                subtitle="Phục vụ tính phí ship tự động"
              />
              <Box className={styles.cardBody}>
                <Grid container spacing={2}>
                  <Field
                    {...f("weight")}
                    label="Khối lượng"
                    type="number"
                    adornment="kg"
                    half
                  />

                  {/* Dài / Rộng / Cao inline */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {DIMENSION_FIELDS.map(({ label, name: dName }) => (
                        <TextField
                          key={dName}
                          label={label}
                          value={form[dName]}
                          onChange={setField(dName)}
                          type="number"
                          size="small"
                          className={styles.field}
                          sx={{ flex: 1 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography
                                  sx={{ fontSize: "0.75rem", color: "#9ca3af" }}
                                >
                                  cm
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Field
                    {...f("origin")}
                    label="Xuất xứ"
                    half
                    helperText="VD: Nhật Bản, Việt Nam, Thái Lan"
                  />
                  <Field
                    {...f("warranty")}
                    label="Bảo hành"
                    half
                    helperText="VD: 12 tháng, 6 tháng"
                  />
                </Grid>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT ────────────────────────────────────────────────────────── */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Trạng thái */}
            <Box className={styles.card}>
              <CardHeader icon={<FiTag size={16} />} title="Trạng thái" />
              <Box className={styles.cardBody}>
                <ToggleRow
                  label="Hiển thị sản phẩm"
                  sub="Sản phẩm sẽ xuất hiện trên website"
                  checked={isActive}
                  onChange={setIsActive}
                />
                <ToggleRow
                  label="Sản phẩm nổi bật"
                  sub="Hiển thị ở trang chủ và đề xuất"
                  checked={isFeatured}
                  onChange={setIsFeatured}
                />
              </Box>
            </Box>

            {/* Hình ảnh */}
            <Box className={styles.card}>
              <CardHeader
                icon={<FiImage size={16} />}
                title="Hình ảnh sản phẩm"
                subtitle="Tối đa 4 ảnh · Ảnh đầu là ảnh chính"
              />
              <Box className={styles.cardBody}>
                <ImageUpload images={images} onChange={setImages} />
              </Box>
            </Box>

            {/* Tags */}
            <Box className={styles.card}>
              <CardHeader
                icon={<FiTag size={16} />}
                title="Tags / Từ khoá"
                subtitle="Hỗ trợ tìm kiếm sản phẩm"
              />
              <Box className={styles.cardBody}>
                <TagInput
                  tags={tags}
                  onChange={setTags}
                  placeholder='Nhập tag, nhấn Enter · VD: "bền", "cao cấp"'
                />
              </Box>
            </Box>

            {/* Xe tương thích */}
            <Box className={styles.card}>
              <CardHeader
                icon={<FiTruck size={16} />}
                title="Xe tương thích"
                subtitle="Liệt kê các dòng xe phù hợp"
              />
              <Box className={styles.cardBody}>
                <TagInput
                  tags={compatible}
                  onChange={setCompatible}
                  placeholder='VD: "Wave Alpha 110", "SH 150i 2023"'
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ── Mobile sticky bar ───────────────────────────────────────────── */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "sticky",
          bottom: 0,
          bgcolor: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          px: 2,
          py: 1.5,
          gap: 1.5,
          mt: 3,
          zIndex: 10,
          boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
        }}
      >
        <Button
          component={Link}
          href="/admin/products"
          fullWidth
          variant="outlined"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
            borderColor: "#e2e8f0",
            color: "#374151",
            py: 1.1,
          }}
        >
          Huỷ
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          startIcon={<FiSave size={15} />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#6366f1",
            boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
            "&:hover": { bgcolor: "#5254cc" },
            py: 1.1,
          }}
        >
          Lưu sản phẩm
        </Button>
      </Box>
    </Box>
  );
}

CreateProductPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default CreateProductPage;
