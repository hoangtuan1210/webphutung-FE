// components/CardHeader.jsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "../../../styles/admin/productForm.module.css";

export default function CardHeader({ icon, title, subtitle }) {
  return (
    <Box className={styles.cardHeader}>
      <Box className={styles.sectionIcon}>{icon}</Box>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827", lineHeight: 1.3 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}