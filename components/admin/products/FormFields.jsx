// components/FormFields.jsx
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import styles from "../../../styles/admin/productForm.module.css";

/**
 * Standard text / number field inside a Grid item.
 */
export function Field({
  label, name, value, onChange,
  type = "text", required = false,
  rows, adornment, helperText, error,
  half = false,
}) {
  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        multiline={!!rows}
        rows={rows}
        error={!!error}
        helperText={error || helperText}
        fullWidth
        size="small"
        className={styles.field}
        InputProps={
          adornment
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontSize: "0.82rem", color: "#9ca3af" }}>
                      {adornment}
                    </Typography>
                  </InputAdornment>
                ),
              }
            : undefined
        }
      />
    </Grid>
  );
}

/**
 * Select / dropdown field inside a Grid item.
 */
export function SelectField({
  label, name, value, onChange,
  options, required = false, error, half = false,
}) {
  const labelText = `${label}${required ? " *" : ""}`;

  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <FormControl fullWidth size="small" error={!!error} className={styles.field}>
        <InputLabel>{labelText}</InputLabel>
        <Select value={value} label={labelText} onChange={onChange}>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt} sx={{ fontSize: "0.875rem" }}>
              {opt}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Grid>
  );
}