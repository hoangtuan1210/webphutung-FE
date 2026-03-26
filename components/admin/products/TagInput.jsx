// components/TagInput.jsx
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { FiPlus } from "react-icons/fi";
import styles from "../../../styles/productForm.module.css";

export default function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  };

  const remove = (tag) => onChange(tags.filter((t) => t !== tag));

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
          className={styles.field}
        />
        <Button
          onClick={add}
          variant="outlined"
          size="small"
          aria-label="Thêm tag"
          sx={{
            borderRadius: "8px", borderColor: "var(--color-admin-border)", color: "var(--color-pagination-inactive)",
            minWidth: 40, px: 1.5,
            "&:hover": { borderColor: "var(--color-primary)", color: "var(--color-primary)", bgcolor: "var(--color-gray-50)" },
          }}
        >
          <FiPlus size={16} />
        </Button>
      </Box>

      {tags.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.25 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onDelete={() => remove(tag)}
              sx={{
                bgcolor: "var(--color-gray-50)", color: "var(--color-primary)",
                fontWeight: 500, fontSize: "0.78rem",
                border: "1px solid var(--color-gray-100)",
                "& .MuiChip-deleteIcon": { color: "var(--color-gray-200)", "&:hover": { color: "var(--color-primary)" } },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}