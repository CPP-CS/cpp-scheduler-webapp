import { Box, Container, Typography } from "@mui/material";

export default function Credits() {
  return (
    <Box sx={{ mt: 10 }}>
      <Container maxWidth='xl'>
        <Typography variant='h1'>Credits</Typography>

        <Box sx={{ ml: 2 }}>
          <Typography variant='h2'>Assets</Typography>
          <Typography variant='h5'>
            <a target='_blank' href='https://icons8.com/icon/8UOuieTsWxj6/lightbulb' rel='noreferrer'>
              Lightbulb Icon
            </a>{" "}
            icon by{" "}
            <a target='_blank' href='https://icons8.com' rel='noreferrer'>
              Icons8
            </a>
          </Typography>

          <Typography variant='h2'>Frameworks | Libraries</Typography>
          <Typography variant='h5'>
            <a target='_blank' href='https://reactjs.org/' rel='noreferrer'>
              ReactJS
            </a>
          </Typography>
          <Typography variant='h5'>
            <a target='_blank' href='https://create-react-app.dev/' rel='noreferrer'>
              Create React App Tool
            </a>{" "}
            <a target='_blank' href='https://www.npmjs.com/package/create-react-app' rel='noreferrer'>
              Package
            </a>
          </Typography>
          <Typography variant='h5'>
            <a target='_blank' href='https://reactrouter.com/' rel='noreferrer'>
              React Router
            </a>{" "}
            <a target='_blank' href='https://www.npmjs.com/package/react-router' rel='noreferrer'>
              Package
            </a>
          </Typography>

          <Typography variant='h2'>Data</Typography>
          <Typography variant='h5'>
            <a target='_blank' href='https://www.cpp.edu/' rel='noreferrer'>
              California Polytechnic State University - California
            </a>
          </Typography>
          <Typography variant='h5'>
            <a target='_blank' href='https://schedule.cpp.edu/' rel='noreferrer'>
              CalPoly Pomona Public Class Schedule
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
