import { Autocomplete, Box, TextField, createFilterOptions, Chip, SxProps } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

export function SearchBar(props: {
  labels: string[];
  current: string | null;
  subtext?: string;
  sx?: SxProps;
  path: string;
}) {
  return (
    <Box sx={props.sx}>
      <Autocomplete
        // getOptionLabel={(option) => option}
        filterOptions={createFilterOptions({
          matchFrom: "any",
          limit: 100,
        })}
        value={props.current}
        options={props.labels || []}
        renderOption={(elProps, option, state) => (
          <Link href={props.path + option.replaceAll(" ", "-").toLowerCase()} key={option}>
            <a style={{ textDecoration: "none", color: "black" }}>
              <li {...elProps}>{option}</li>
            </a>
          </Link>
        )}
        renderInput={(params) => <TextField {...params} label={props.subtext}></TextField>}
      />
    </Box>
  );
}
