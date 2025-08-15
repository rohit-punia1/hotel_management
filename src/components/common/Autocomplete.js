"use client";
import { Autocomplete, TextField } from "@mui/material";

export default function DestinationAutocomplete({
  value,
  onInputChange,
  onChange,
  options,
  label,
}) {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option?.name || ""
      }
      value={value}
      onInputChange={(event, newValue) => {
        onInputChange(newValue);
      }}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          size="small"
          fullWidth
        />
      )}
    />
  );
}
