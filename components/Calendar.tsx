import FullCalendar, { Fragment } from "@fullcalendar/react";

import timeGridPlugin from "@fullcalendar/timegrid";
import { Box, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import { Section } from "types/models";
import { CalendarEvent } from "types/types";
import { getDays } from "utils/utils";

export default function Calendar(props: { events: Array<CalendarEvent> }) {
  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView='timeGridWeek'
      allDaySlot={true}
      allDayContent='Async'
      dayHeaderFormat={{ weekday: "short" }}
      headerToolbar={{ start: "", center: "", end: "" }}
      initialDate='2011-10-02'
      slotMinTime='06:00:00'
      events={props.events}
      slotDuration='00:30:00'
      expandRows={true}
      height='100%'
      eventContent={(arg) => {
        let event: CalendarEvent = arg.event.extendedProps as CalendarEvent;
        let section: Section = event.section as Section;
        return (
          <Tooltip
            enterTouchDelay={0}
            title={
              <Box>
                <Typography>Class Number: {section.ClassNumber || "TBA"}</Typography>
                <Typography>Days: {getDays(section)}</Typography>
                <Typography>
                  {section.StartTime && section.EndTime
                    ? `Time: ${moment(section.StartTime, "HH:mm").format("h:mma")} - ${moment(
                        section.EndTime,
                        "HH:mm"
                      ).format("h:mma")}`
                    : "Time: TBA"}
                </Typography>
                <Typography>Location: {section.Location || "TBA"}</Typography>
                <Typography>Component: {section.Component || "TBA"}</Typography>
                <Typography>Units: {section.Units || "TBA"}</Typography>
              </Box>
            }>
            <div className='fc-event-main-frame'>
              {arg.timeText && <div className='fc-event-time'>{arg.timeText}</div>}
              <div className='fc-event-title-container'>
                <div className='fc-event-title fc-sticky'>{arg.event.title || <Fragment>&nbsp;</Fragment>}</div>
              </div>
            </div>
          </Tooltip>
        );
      }}
    />
  );
}
