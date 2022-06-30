import { CircularProgress, Grid, Typography } from "@mui/material";

export function Loading() {
  return (
    <Grid
      container
      spacing={0}
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: "100vh" }}>
      <Grid item xs={3}>
        <Typography variant='h3'>Loading...</Typography>
      </Grid>
      <Grid item xs={3} sx={{ mt: 3 }}>
        <CircularProgress />
      </Grid>
    </Grid>
  );
}
