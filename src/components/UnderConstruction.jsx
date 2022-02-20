import { Container, Grid, Typography } from "@mui/material";

export default function UnderConstruction(props) {
  return (
    <Container>
      <Grid container direction='column' alignItems='center' justifyContent='center' style={{ minHeight: "100vh" }}>
        <Grid item>
          <Typography textAlign='center' variant='h3'>
            We're sorry! ☹
          </Typography>
          <Typography textAlign='center' variant='h3'>
            This page is under construction.
          </Typography>
          <Typography textAlign='center' variant='h6'>
            {props.children}
          </Typography>
          <Typography textAlign='center' variant='body2'>
            Need more information? Checkout the Help page or contact me at ZombiMigz#6758
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
