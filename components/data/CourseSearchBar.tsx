import { Autocomplete, Box, TextField, createFilterOptions, Chip } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

export function CourseSearchBar(props: { courseLabels: string[]; current: string | null }) {
  let router = useRouter();
  return (
    <Box>
      <Autocomplete
        // getOptionLabel={(option) => option}
        filterOptions={createFilterOptions({
          matchFrom: "any",
          limit: 100,
        })}
        value={props.current}
        options={props.courseLabels || []}
        renderOption={(props, option, state) => (
          <Link href={"/courses/" + option.replaceAll(" ", "-").toLowerCase()} key={option}>
            <a style={{ textDecoration: "none", color: "black" }}>
              <li {...props}>{option}</li>
            </a>
          </Link>
        )}
        renderInput={(params) => <TextField {...params} label='Select a Course...'></TextField>}
      />
    </Box>
  );
}
