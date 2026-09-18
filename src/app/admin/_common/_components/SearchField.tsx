"use client";

// mui
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

type SearchFieldProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export default function SearchField({ value, placeholder, onChange }: SearchFieldProps) {
  return (
    <SearchTextField
      type="search"
      fullWidth
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        htmlInput: {
          "aria-label": placeholder,
        },
        input: {
          endAdornment: (
            <SearchInputAdornment position="end">
              <SearchIcon />
            </SearchInputAdornment>
          ),
        },
      }}
    />
  );
}

const SearchTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  marginBottom: "24px",

  "& .MuiOutlinedInput-root": {
    height: "56px",
    padding: "20px",
    borderRadius: "5px",
    boxSizing: "border-box",
    backgroundColor: theme.palette.grey[100],

    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },

  "& .MuiInputBase-input": {
    height: "56px",
    padding: "0",
    boxSizing: "border-box",
    color: theme.palette.text.primary,
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: "32px",

    "&::placeholder": {
      color: theme.palette.grey[500],
      opacity: 1,
    },
  },

  "& input[type='search']::-webkit-search-cancel-button": {
    display: "none",
    WebkitAppearance: "none",
    appearance: "none",
  },
}));

const SearchInputAdornment = styled(InputAdornment)({
  marginLeft: 0,
  pointerEvents: "none",
});

const SearchIcon = styled(SearchRoundedIcon)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "24px",
}));
