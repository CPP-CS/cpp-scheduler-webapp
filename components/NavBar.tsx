import {
  AppsOutlined,
  CalendarViewDayOutlined,
  ClassOutlined,
  ExpandLess,
  ExpandMore,
  InsertChartOutlined,
  Menu as MenuIcon,
  PeopleOutlined,
  PersonOutlineSharp,
  QuestionMarkOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useScrollTrigger,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListSubheader,
  Divider,
  Collapse,
  ListItemSecondaryAction,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

function ElevationScroll(props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(props.children, {
    elevation: trigger ? 4 : 0,
    color: trigger ? "primary" : "transparent",
  });
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [grades, setGrades] = useState(true);
  return (
    <ElevationScroll>
      <AppBar>
        <Toolbar>
          <IconButton size='large' color='inherit' sx={{ mr: 2 }} onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor={"left"} open={open} onClose={() => setOpen(false)}>
            <List>
              <ListSubheader>
                <Typography variant='h2'>Navigation</Typography>
              </ListSubheader>
              <Divider sx={{ mt: 2 }}></Divider>
              <NavLink to='/' icon={<AppsOutlined sx={{ fontSize: "2em" }} />} setOpen={setOpen}>
                Home
              </NavLink>
              <NavLink
                to='/scheduleBuilder'
                keyVal='scheduleBuilder'
                icon={<CalendarViewDayOutlined sx={{ fontSize: "2em" }} />}
                setOpen={setOpen}>
                Schedule Builder
              </NavLink>

              {/* grades */}
              <ListItemButton
                divider
                onClick={() => {
                  setGrades(!grades);
                }}
                sx={{ px: 2 }}>
                <ListItemIcon>
                  <InsertChartOutlined sx={{ fontSize: "2em" }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant='h5'>Data</Typography>}></ListItemText>
                <ListItemSecondaryAction>{grades ? <ExpandLess /> : <ExpandMore />}</ListItemSecondaryAction>
              </ListItemButton>
              <Collapse in={grades} unmountOnExit>
                <GradesNavLink
                  to='/data/instructors'
                  icon={<PersonOutlineSharp sx={{ fontSize: "2em" }} />}
                  setOpen={setOpen}>
                  Instructors
                </GradesNavLink>
                <GradesNavLink to='/data/courses' icon={<ClassOutlined sx={{ fontSize: "2em" }} />} setOpen={setOpen}>
                  Courses
                </GradesNavLink>
                {/* <GradesNavLink
                  to='/data/departments'
                  icon={<HouseOutlined sx={{ fontSize: "2em" }} />}
                  setOpen={setOpen}>
                  Departments
                </GradesNavLink> */}
              </Collapse>

              <NavLink to='/help' icon={<QuestionMarkOutlined sx={{ fontSize: "2em" }} />} setOpen={setOpen}>
                Help & Info
              </NavLink>
              <NavLink to='/credits' icon={<PeopleOutlined sx={{ fontSize: "2em" }} />} setOpen={setOpen}>
                Credits
              </NavLink>
            </List>
          </Drawer>
          <Typography variant='h5'>CPP Scheduler</Typography>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}

function NavLink(props) {
  let router = useRouter();
  return (
    <ListItemButton
      divider
      onClick={() => {
        router.push(props.to);
        props.setOpen(false);
      }}
      sx={{ px: 2 }}>
      <ListItemIcon> {props.icon}</ListItemIcon>
      <ListItemText primary={<Typography variant='h5'>{props.children}</Typography>}></ListItemText>
    </ListItemButton>
  );
}

function GradesNavLink(props) {
  let router = useRouter();
  return (
    <ListItemButton
      divider
      onClick={() => {
        router.push(props.to);
        props.setOpen(false);
      }}
      sx={{ pr: 2, pl: 4 }}>
      <ListItemIcon> {props.icon}</ListItemIcon>
      <ListItemText primary={<Typography variant='h5'>{props.children}</Typography>}></ListItemText>
    </ListItemButton>
  );
}
