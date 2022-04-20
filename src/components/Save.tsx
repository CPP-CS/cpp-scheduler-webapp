import { CompressedQuery, CompressedSection, SaveData } from "../app/Classes";
import { fetchQueries, schedulerActions, SchedulerState } from "../app/slices/schedulerSlice";
import LZUTF8 from "lzutf8";
import { useAppDispatch, useAppSelector } from "app/store";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

function saveState(state: SchedulerState): SaveData {
  return {
    currentSchedule: state.currentSchedule,
    breakList: state.breakList,
    queryList: state.queryList.map((query) => {
      return {
        type: query.type,
        allowStaff: query.allowStaff || false,
        minGPA: query.minGPA,
        sections: query.sections.map((section) => {
          return {
            selected: section.selected,
            Subject: section.Subject,
            CourseNumber: section.CourseNumber,
            Section: section.Section,
          } as CompressedSection;
        }),
        course: query.course,
      } as CompressedQuery;
    }),
  };
}

function loadSave(key: string): SaveData | {} {
  try {
    return JSON.parse(LZUTF8.decompress(key, { inputEncoding: "StorageBinaryString", outputEncoding: "String" }));
  } catch (e) {
    console.log("Failed to load save key: ", e);
    return {};
  }
}

export function GetSave() {
  let state = useAppSelector((state) => state.scheduler);
  let [saveKey, setSaveKey] = useState("");
  return (
    <Paper elevation={4} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant='h3'>Get Save Key</Typography>
        <Typography>
          Get a save token to backup and share your schedules. WARNING: THIS IS VERY EXPERIMENTAL AND MAY BREAK THE
          SCHEDULER. PLEASE CONTACT ZombiMigz#6758 IF IT DOES BREAK.
        </Typography>
        <Button
          variant='outlined'
          onClick={() => {
            LZUTF8.compressAsync(
              JSON.stringify(saveState(state)),
              { outputEncoding: "StorageBinaryString" },
              (res, e) => {
                if (!e) setSaveKey(res);
                else console.log(e.message);
              }
            );
          }}>
          Generate Save Key
        </Button>
        <TextField label='Copy and Save Me' disabled value={saveKey}></TextField>
      </Stack>
    </Paper>
  );
}

export function LoadSave() {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState("");

  return (
    <Paper sx={{ p: 3 }} elevation={4}>
      <Stack spacing={3}>
        <Typography variant='h3'>Load Save Key</Typography>
        <TextField value={input} onChange={(e) => setInput(e.target.value)} label='Input Save Key'></TextField>
        <Button
          variant='outlined'
          onClick={() => {
            console.log("Loading Save Data: ", loadSave(input));
            dispatch(schedulerActions.setResetting(true));
            dispatch(schedulerActions.setState(loadSave(input)));
            dispatch(fetchQueries).then(() => {
              dispatch(schedulerActions.calculateSchedules);
              dispatch(schedulerActions.setResetting(false));
            });
          }}>
          Load Save Key
        </Button>
      </Stack>
    </Paper>
  );
}
