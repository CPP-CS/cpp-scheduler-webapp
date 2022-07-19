import { Container, Typography } from "@mui/material";
import Head from "next/head";
import { SearchBar } from "components/data/SearchBar";
import { Instructor } from "types/models";
import { API } from "constants/API";

export default function InstructorSearch(props: { professorLabels: string[] }) {
  return (
    <>
      <Head>
        <title>CPP Professor Search</title>
        <meta
          name='description'
          content='Search for Cal Poly Pomona - CPP Professor Data and History'
          key='description'
        />
      </Head>
      <Container sx={{ mt: 17, display: "flex", flexDirection: "column", justifyContent: "center", height: "60vh" }}>
        <Typography variant='h1' textAlign='center'>
          Search for Professor Data
        </Typography>
        <SearchBar
          subtext='Select a Professor...'
          labels={props.professorLabels}
          current={null}
          sx={{ px: { md: "20%" }, mt: 3 }}
          path='professors/'
        />
      </Container>
    </>
  );
}

export async function getStaticProps() {
  let data = await fetch(API + "data/instructors/find", {
    method: "POST",
  });
  let professorList = (await data.json()) as Instructor[];

  return {
    props: {
      professorLabels: professorList.map((professor) => professor.Label),
    },
    // revalidate: 60 * 60 * 24, // 1 day
  };
}
