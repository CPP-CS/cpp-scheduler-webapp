import { Container, Link, Typography } from "@mui/material";

export default function Help() {
  return (
    <Container sx={{ flex: "1 1", paddingRight: { md: "30%" } }} maxWidth='xl'>
      <Typography variant='h1'>Help & Info</Typography>
      <Typography variant='h2'>Contact Me</Typography>
      <Typography variant='body1'>
        Have any questions, suggestions, or just general comments? Feel free to reach out at any time!
      </Typography>
      <Typography variant='body1'>
        Discord:{" "}
        <Link rel='noopener noreferrer' target='_blank' href='https://discordapp.com/users/154359400142864384'>
          ZombiMigz#6758
        </Link>
      </Typography>
      <Typography variant='body1'>
        CS Discord Server:{" "}
        <Link rel='noopener noreferrer' target='_blank' href='https://discord.gg/pYjC82F'>
          Invite Link
        </Link>
      </Typography>
      <Typography variant='body1'>
        Email: <Link href='mailto: lmlim@cpp.edu'>lmlim@cpp.edu</Link>
      </Typography>

      <Typography variant='h2' sx={{ mt: "5%" }}>
        FAQ
      </Typography>
      <Typography variant='h3'>Is this affiliated with CPP?</Typography>
      <Typography variant='body1'>
        This project is not affiliated with California Polytechnic State University - Pomona nor any other organization.
        CPP Does not endorse this site and does not have any influence on the content of this site.
      </Typography>
      <Typography variant='h3'>Where do you get this data from?</Typography>
      <Typography variant='body1'>
        This data is obtained from public resources such as the{" "}
        <Link rel='noopener noreferrer' target='_blank' href='https://schedule.cpp.edu/'>
          Public Class Schedule Page
        </Link>{" "}
        and California public records requests.
      </Typography>
    </Container>
  );
}
