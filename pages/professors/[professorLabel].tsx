import { Instructor, Instruction } from "types/models";
import { API } from "constants/API";
import ReactGA from "react-ga4";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { defaultKeywords, round } from "utils/utils";
import { Container } from "@mui/system";
import { SearchBar } from "components/data/SearchBar";

import Head from "next/head";
import { cache, ProfessorMap } from "utils/cache";

export default function ProfessorListing(props: {
  professor: string;
  instructionList: string;
  professorLabels: string;
}) {
  let professor = JSON.parse(props.professor) as Instructor;
  let instructionList = JSON.parse(props.instructionList) as Instruction[];
  let professorLabels = JSON.parse(props.professorLabels) as string[];

  //create GPA table
  let tableData: Array<JSX.Element> = [];
  let key = 0;

  // generate table
  for (let instruction of instructionList) {
    tableData.push(
      <TableRow key={key++}>
        <TableCell>{`${instruction.InstructorFirst} ${instruction.InstructorLast}`}</TableCell>
        <TableCell>{`${round(instruction.AvgGPA || 0)}`}</TableCell>
        <TableCell>{`${instruction.TotalEnrollment}`}</TableCell>
      </TableRow>
    );
  }

  // generate metadata
  let description = `Professor data and history for ${professor.Label}. Average GPA: ${
    professor.AvgGPA ? round(professor.AvgGPA) : "unknown"
  } out of ${professor.TotalEnrollment} enrollments`;
  let keyword = [
    professor.InstructorFirst,
    professor.InstructorLast,
    professor.Label,
    ...instructionList.reduce(
      (arr, instruction) => arr.concat(`${instruction.InstructorFirst} ${instruction.InstructorLast}`),
      [] as String[]
    ),
    "Professor",
    ...defaultKeywords,
  ].join(", ");

  return (
    <>
      <Head>
        <title>{professor.Label}</title>
        <meta name='description' key='description' content={description} />
        <meta name='keywords' key='keywords' content={keyword} />
      </Head>
      <Container sx={{ px: { xs: 0 } }}>
        <Paper variant='elevation' elevation={4} sx={{ px: { md: 10, xs: 2 }, p: 5, mt: 17 }}>
          <SearchBar
            subtext='Select a professor...'
            labels={professorLabels}
            current={professor.Label || "Error label not found in professor"}
            path='professors/'
          />
          <Grid item xs={12} mt={3}>
            <Typography variant='h1'>{professor.Label}</Typography>
            <Typography variant='h3'>
              Average GPA: {round(professor.AvgGPA || 0)} out of {professor.TotalEnrollment} Students
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        Course Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        Avg GPA
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        Total Grades
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{tableData}</TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export async function getStaticPaths() {
  // gets professor list
  let data = await fetch(API + "data/instructors/find", {
    method: "POST",
  });
  let professorList = (await data.json()) as Instructor[];
  await cache.set(
    "professors",
    professorList.reduce((map: ProfessorMap, professor) => {
      map[professor.Label?.toLowerCase().replaceAll(" ", "-") || "err"] = professor;
      return map;
    }, {})
  );
  return {
    paths: professorList.map((professor) => {
      return { params: { professorLabel: professor.Label?.toLowerCase().replaceAll(" ", "-") } };
    }),
    fallback: false,
  };
}

export async function getStaticProps(props: { params: { professorLabel: string } }) {
  let { professorLabel } = props.params;

  let professorMap = (await cache.get("professors")) as ProfessorMap;
  let professor = professorMap[professorLabel];
  let professorList = Object.values(professorMap);

  // get instructions pertaining to professor
  let data = await fetch(API + "data/instructions/find", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      InstructorFirst: professor.InstructorFirst,
      InstructorLast: professor.InstructorLast,
    }),
  });
  let instructionList = (await data.json()) as Instruction[];

  // send professor search event to google analytics
  ReactGA.event({
    category: "Query",
    action: "Professor Data Search",
  });

  return {
    props: {
      professor: JSON.stringify(professor),
      instructionList: JSON.stringify(instructionList),
      professorLabels: JSON.stringify(professorList.map((professor) => professor.Label)),
    },
    // revalidate: 60 * 60 * 24, // 1 day
  };
}
